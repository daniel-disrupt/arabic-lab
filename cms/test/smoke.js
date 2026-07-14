#!/usr/bin/env node
/* ─────────────── CMS SKELETON SMOKE TEST ───────────────
   Exercises the full ingest -> publish loop end-to-end WITHOUT touching the real GitHub
   repo or a hosted Postgres: uses @electric-sql/pglite (real WASM Postgres) for the database,
   and a disposable local bare git repo standing in for daniel-disrupt/arabic-lab. Verifies:
     1. the HTTP API (auth, create lesson, save each JSON field, upload media, publish)
     2. the resulting commit in the fake remote actually contains a correct data.json + manifest

   Run: node test/smoke.js  (from the cms/ directory)
*/
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { spawn } = require('child_process');
const { isDeepStrictEqual } = require('util');

const WORKDIR = fs.mkdtempSync(path.join(os.tmpdir(), 'arabiclab-cms-smoke-'));
const REMOTE_DIR = path.join(WORKDIR, 'remote.git');
const DATA_DIR = path.join(WORKDIR, 'data');
const PORT = 3971;
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'test-pass';
const AUTH_HEADER = 'Basic ' + Buffer.from(ADMIN_USER + ':' + ADMIN_PASS).toString('base64');
const BASE = 'http://127.0.0.1:' + PORT;

function git(args, cwd) { return execFileSync('git', args, { cwd, stdio: 'pipe' }).toString(); }

function setupFakeRemote() {
  fs.mkdirSync(REMOTE_DIR, { recursive: true });
  git(['init', '--bare', '-b', 'master'], REMOTE_DIR);

  // Seed the remote with a minimal but realistic app/ tree, mirroring the real repo's shape
  // after Part 1's refactor, so publish's manifest-merge logic has something real to merge into.
  const seedDir = path.join(WORKDIR, 'seed');
  fs.mkdirSync(path.join(seedDir, 'app', 'lessons'), { recursive: true });
  fs.writeFileSync(path.join(seedDir, 'app', 'lessons', 'manifest.json'), '[]\n');
  git(['init', '-b', 'master'], seedDir);
  git(['config', 'user.name', 'Seed'], seedDir);
  git(['config', 'user.email', 'seed@test.local'], seedDir);
  git(['add', '.'], seedDir);
  git(['commit', '-m', 'seed'], seedDir);
  git(['remote', 'add', 'origin', REMOTE_DIR], seedDir);
  git(['push', 'origin', 'master'], seedDir);
}

function fixtureBundleFields() {
  return {
    chunks_json: [{ start: 0, end: 5, label: '0:00 – 0:05', text: [{ w: 'مرحبا', he: 'שלום', en: 'hello', pos: null, root: null }] }],
    phrase_glosses_json: [{ keys: ['مرحبا'], he: 'שלום', en: 'hello', type: null }],
    vocab_json: [{ type: 'word', ar: 'مرحبا', he: 'שלום', en: 'hello', root: null, isVerb: false, ci: 0 }],
    verbs_json: [],
    watch_captions_json: [{ start: 0, end: 5, words: [{ w: 'مرحبا', t: 0.1 }], he: 'שלום', en: 'hello' }],
    voiceover_json: { src: 'audio/voiceover/reading-edition.mp3', chunks: [{ start: 0, end: 5, label: '0:00 – 0:05' }], wordTimes: [{ idx: 0, t: 0.1 }] },
    content_json: {
      homeContent: { en: { title: 'Fixture Lesson', subtitle: 'Test', intro: ['Hi'] }, he: { title: 'שיעור', subtitle: 'בדיקה', intro: ['שלום'] } },
      introContent: { en: { title: 'Fixture', text: 'Hi' }, he: { title: 'שיעור', text: 'שלום' } },
      aboutContent: { en: { dir: 'ltr', sections: [] }, he: { dir: 'rtl', sections: [] } },
      headerGloss: { title: { ar: 'x', en: 'x', he: 'x' }, location: { ar: 'x', en: 'x', he: 'x' } },
    },
  };
}

async function jsonFetch(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { Authorization: AUTH_HEADER, ...(opts.body && !opts.isForm ? { 'Content-Type': 'application/json' } : {}), ...(opts.headers || {}) },
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + url + ': ' + JSON.stringify(data));
  return data;
}

function assert(cond, msg) { if (!cond) throw new Error('ASSERTION FAILED: ' + msg); }

async function main() {
  setupFakeRemote();

  const env = {
    ...process.env,
    DB_DRIVER: 'pglite',
    PORT: String(PORT),
    ADMIN_USER, ADMIN_PASS,
    DATA_DIR,
    REPO_URL: REMOTE_DIR,
    GIT_USER_NAME: 'Smoke Test', GIT_USER_EMAIL: 'smoke@test.local',
  };
  const server = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let serverOut = '';
  server.stdout.on('data', (d) => { serverOut += d; });
  server.stderr.on('data', (d) => { serverOut += d; });

  try {
    // wait for the server to report it's listening
    const deadline = Date.now() + 15000;
    while (!serverOut.includes('listening') && Date.now() < deadline) await new Promise((r) => setTimeout(r, 100));
    assert(serverOut.includes('listening'), 'server did not start in time. Output:\n' + serverOut);

    // 1. auth is enforced
    const unauthed = await fetch(BASE + '/api/lessons');
    assert(unauthed.status === 401, 'expected 401 without auth, got ' + unauthed.status);

    // 2. create lesson
    const created = await jsonFetch(BASE + '/api/lessons', {
      method: 'POST',
      body: JSON.stringify({ slug: 'fixture-lesson', title: 'Fixture Lesson', subtitle: 'Test', dialect: 'palestinian' }),
    });
    assert(created.slug === 'fixture-lesson', 'lesson not created correctly: ' + JSON.stringify(created));
    assert(created.status === 'draft', 'new lesson should start as draft');

    // 3. save each JSON field
    // NOTE: compare with deep-equality, not JSON.stringify -- Postgres's jsonb column type
    // normalizes storage and does not preserve object key order (array order IS preserved),
    // so a naive string comparison here fails on semantically-identical objects.
    const fields = fixtureBundleFields();
    for (const [key, value] of Object.entries(fields)) {
      const updated = await jsonFetch(BASE + '/api/lessons/fixture-lesson/json/' + key, { method: 'PUT', body: JSON.stringify(value) });
      assert(isDeepStrictEqual(updated[key], value), 'field ' + key + ' did not round-trip: ' + JSON.stringify(updated[key]));
    }

    // 4. upload media (small fixture files, not real video/audio -- proves the upload+path plumbing)
    const fixturesDir = path.join(WORKDIR, 'fixtures');
    fs.mkdirSync(fixturesDir, { recursive: true });
    fs.writeFileSync(path.join(fixturesDir, 'v.mp4'), 'fake video bytes');
    fs.writeFileSync(path.join(fixturesDir, 'a.mp3'), 'fake audio bytes');
    fs.writeFileSync(path.join(fixturesDir, 'c.vtt'), 'WEBVTT\n\n00:00.000 --> 00:05.000\nmarhaba\n');
    for (const [kind, file] of [['video', 'v.mp4'], ['voiceover', 'a.mp3'], ['captions', 'c.vtt']]) {
      const fd = new FormData();
      fd.append('file', new Blob([fs.readFileSync(path.join(fixturesDir, file))]), file);
      const res = await fetch(BASE + '/api/lessons/fixture-lesson/media/' + kind, { method: 'POST', headers: { Authorization: AUTH_HEADER }, body: fd });
      const data = await res.json();
      assert(res.ok, 'media upload failed for ' + kind + ': ' + JSON.stringify(data));
    }

    // 5. publish
    const publishRes = await jsonFetch(BASE + '/api/lessons/fixture-lesson/publish', { method: 'POST', body: '{}' });
    assert(publishRes.pushed === true, 'publish did not report pushed:true: ' + JSON.stringify(publishRes));

    const afterPublish = await jsonFetch(BASE + '/api/lessons/fixture-lesson');
    assert(afterPublish.status === 'published', 'lesson status not updated to published after publish');

    // 6. verify the fake remote actually received the commit with correct content
    const checkoutDir = path.join(WORKDIR, 'checkout');
    git(['clone', REMOTE_DIR, checkoutDir]);
    const dataJsonPath = path.join(checkoutDir, 'app', 'lessons', 'fixture-lesson', 'data.json');
    assert(fs.existsSync(dataJsonPath), 'data.json missing from published repo');
    const bundle = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
    assert(bundle.meta.slug === 'fixture-lesson', 'bundle meta.slug wrong');
    assert(bundle.chunks.length === 1 && bundle.chunks[0].text[0].w === 'مرحبا', 'bundle chunks not carried through');
    // Uploaded media is renamed server-side to <slug>-<kind><ext> (see server.js's media route)
    // to guarantee uniqueness -- publish then just carries that name through, it doesn't
    // preserve the original uploaded filename.
    assert(bundle.meta.videoPath === 'video/fixture-lesson-video.mp4', 'video path not set on publish: ' + bundle.meta.videoPath);
    assert(bundle.voiceover.src === 'audio/voiceover/fixture-lesson-voiceover.mp3', 'voiceover src not set on publish: ' + bundle.voiceover.src);
    assert(fs.existsSync(path.join(checkoutDir, 'app', 'lessons', 'fixture-lesson', 'video', 'fixture-lesson-video.mp4')), 'video file not copied into repo');
    assert(fs.existsSync(path.join(checkoutDir, 'app', 'lessons', 'fixture-lesson', 'video', 'fixture-lesson-captions.vtt')), 'captions file not copied into repo');
    assert(fs.existsSync(path.join(checkoutDir, 'app', 'lessons', 'fixture-lesson', 'audio', 'voiceover', 'fixture-lesson-voiceover.mp3')), 'voiceover file not copied into repo');

    const manifest = JSON.parse(fs.readFileSync(path.join(checkoutDir, 'app', 'lessons', 'manifest.json'), 'utf8'));
    assert(manifest.length === 1 && manifest[0].slug === 'fixture-lesson', 'manifest.json not updated correctly: ' + JSON.stringify(manifest));

    const log = git(['log', '--oneline'], checkoutDir);
    assert(log.includes('Publish lesson: fixture-lesson'), 'commit message missing from log:\n' + log);

    console.log('ALL SMOKE TESTS PASSED');
    console.log(' - auth enforced (401 without credentials)');
    console.log(' - lesson created, 7 JSON fields round-tripped');
    console.log(' - 3 media files uploaded and copied into the published repo');
    console.log(' - publish pushed a commit to the fake remote with correct data.json + manifest.json');
  } finally {
    server.kill();
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
