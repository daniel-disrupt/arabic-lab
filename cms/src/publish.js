const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Read lazily (not captured at module-load time) so tests can point these at a disposable local
// bare repo instead of the real GitHub remote, by setting DATA_DIR / REPO_URL before calling in.
function dataDir() { return process.env.DATA_DIR || path.join(__dirname, '..', '.data'); }
function repoDir() { return path.join(dataDir(), 'repo'); }
function repoUrl() { return process.env.REPO_URL; } // e.g. https://<PAT>@github.com/daniel-disrupt/arabic-lab.git
function gitUserName() { return process.env.GIT_USER_NAME || 'Arabic Lab CMS'; }
function gitUserEmail() { return process.env.GIT_USER_EMAIL || 'cms@arabiclab.local'; }

function git(args) {
  return execFileSync('git', args, { cwd: repoDir(), stdio: 'pipe' }).toString();
}

// Real Postgres (pg) auto-parses JSONB columns into JS values already; pglite (used only in
// this service's own local tests, see src/db.js) can hand back the raw JSON text instead --
// normalize so buildBundle() below doesn't care which driver produced the row.
function asJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'string') { try { return JSON.parse(value); } catch { return fallback; } }
  return value;
}

function ensureRepo() {
  const url = repoUrl();
  if (!url) throw new Error('REPO_URL is not configured.');
  fs.mkdirSync(dataDir(), { recursive: true });
  if (!fs.existsSync(path.join(repoDir(), '.git'))) {
    execFileSync('git', ['clone', url, repoDir()], { stdio: 'pipe' });
    git(['config', 'user.name', gitUserName()]);
    git(['config', 'user.email', gitUserEmail()]);
  } else {
    git(['fetch', 'origin', 'master']);
    git(['reset', '--hard', 'origin/master']);
  }
}

function buildBundle(lesson) {
  const content = asJson(lesson.content_json, {}) || {};
  const voiceover = asJson(lesson.voiceover_json, {}) || {};
  return {
    meta: {
      slug: lesson.slug,
      title: lesson.title,
      subtitle: lesson.subtitle || '',
    },
    chunks: asJson(lesson.chunks_json, []),
    phraseGlosses: asJson(lesson.phrase_glosses_json, []),
    vocabSeed: asJson(lesson.vocab_json, []),
    verbs: asJson(lesson.verbs_json, []),
    watchCaptions: asJson(lesson.watch_captions_json, []),
    voiceover: { src: voiceover.src || '', chunks: voiceover.chunks || [], wordTimes: voiceover.wordTimes || [] },
    homeContent: content.homeContent || null,
    introContent: content.introContent || null,
    aboutContent: content.aboutContent || null,
    headerGloss: content.headerGloss || null,
  };
}

function copyIfExists(srcPath, destDir, destName) {
  if (!srcPath || !fs.existsSync(srcPath)) return null;
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, path.join(destDir, destName));
  return destName;
}

function publishLesson(lesson) {
  ensureRepo();
  const dir = repoDir();
  const lessonDir = path.join(dir, 'app', 'lessons', lesson.slug);
  fs.mkdirSync(lessonDir, { recursive: true });

  const bundle = buildBundle(lesson);

  const videoName = lesson.video_asset_path ? path.basename(lesson.video_asset_path) : null;
  const captionsName = lesson.captions_vtt_path ? path.basename(lesson.captions_vtt_path) : null;
  const voiceoverName = lesson.voiceover_audio_path ? path.basename(lesson.voiceover_audio_path) : null;

  if (videoName && copyIfExists(lesson.video_asset_path, path.join(lessonDir, 'video'), videoName)) {
    bundle.meta.videoPath = 'video/' + videoName;
  }
  if (captionsName && copyIfExists(lesson.captions_vtt_path, path.join(lessonDir, 'video'), captionsName)) {
    bundle.meta.captionsPath = 'video/' + captionsName;
  }
  if (voiceoverName && copyIfExists(lesson.voiceover_audio_path, path.join(lessonDir, 'audio', 'voiceover'), voiceoverName)) {
    bundle.voiceover.src = 'audio/voiceover/' + voiceoverName;
  }

  fs.writeFileSync(path.join(lessonDir, 'data.json'), JSON.stringify(bundle));

  const manifestPath = path.join(dir, 'app', 'lessons', 'manifest.json');
  let manifest = [];
  if (fs.existsSync(manifestPath)) manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const idx = manifest.findIndex((l) => l.slug === lesson.slug);
  const entry = { slug: lesson.slug, title: lesson.title, subtitle: lesson.subtitle || '' };
  if (idx >= 0) manifest[idx] = entry; else manifest.push(entry);
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  git(['add', 'app/lessons']);
  const status = git(['status', '--porcelain']);
  if (!status.trim()) return { pushed: false, reason: 'no changes', bundle };
  git(['commit', '-m', 'Publish lesson: ' + lesson.slug]);
  git(['push', 'origin', 'master']);
  return { pushed: true, bundle };
}

module.exports = { publishLesson, buildBundle, ensureRepo };
