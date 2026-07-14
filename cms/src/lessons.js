const { query } = require('./db');

// The seven pipeline-artifact blobs an admin pastes in per lesson -- mirrors exactly what gets
// hand-assembled into app/js/*-data.js today (see scripts/migrate-lesson-to-json.js for the
// original migration this schema is modeled on).
const JSON_FIELDS = [
  'chunks_json',
  'phrase_glosses_json',
  'vocab_json',
  'verbs_json',
  'watch_captions_json',
  'voiceover_json',
  'content_json',
];

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Real Postgres (pg) auto-parses JSONB columns into JS values already; pglite (used only for
// this service's own local tests, see src/db.js) can hand a row back with those columns still
// as raw JSON text. Normalize here so every caller -- the admin UI included -- sees the same
// shape regardless of which driver answered the query.
function normalizeRow(row) {
  if (!row) return row;
  for (const field of JSON_FIELDS) {
    if (typeof row[field] === 'string') {
      try { row[field] = JSON.parse(row[field]); } catch { /* leave as-is */ }
    }
  }
  return row;
}

async function listLessons() {
  const { rows } = await query(
    'SELECT id, slug, title, subtitle, dialect, status, created_at, updated_at FROM lessons ORDER BY created_at DESC'
  );
  return rows;
}

async function createLesson({ slug, title, subtitle, dialect, source_note }) {
  if (!slug || !SLUG_RE.test(slug)) {
    throw new Error('slug must be lowercase letters/digits/hyphens, e.g. "abed-jaffa-speech"');
  }
  if (!title) throw new Error('title is required');
  const { rows } = await query(
    `INSERT INTO lessons (slug, title, subtitle, dialect, source_note)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [slug, title, subtitle || null, dialect || null, source_note || null]
  );
  return normalizeRow(rows[0]);
}

async function getLesson(slug) {
  const { rows } = await query('SELECT * FROM lessons WHERE slug = $1', [slug]);
  return rows[0] ? normalizeRow(rows[0]) : null;
}

async function updateLessonJson(slug, field, value) {
  if (!JSON_FIELDS.includes(field)) throw new Error('Unknown field: ' + field);
  const { rows } = await query(
    `UPDATE lessons SET ${field} = $2, updated_at = now() WHERE slug = $1 RETURNING *`,
    [slug, JSON.stringify(value)]
  );
  if (!rows[0]) throw new Error('No lesson with slug "' + slug + '"');
  return normalizeRow(rows[0]);
}

const MEDIA_COLUMNS = {
  video: 'video_asset_path',
  voiceover: 'voiceover_audio_path',
  captions: 'captions_vtt_path',
};

async function updateLessonMediaPath(slug, kind, value) {
  const column = MEDIA_COLUMNS[kind];
  if (!column) throw new Error('Unknown media kind: ' + kind);
  const { rows } = await query(
    `UPDATE lessons SET ${column} = $2, updated_at = now() WHERE slug = $1 RETURNING *`,
    [slug, value]
  );
  if (!rows[0]) throw new Error('No lesson with slug "' + slug + '"');
  return normalizeRow(rows[0]);
}

async function markPublished(slug) {
  const { rows } = await query(
    `UPDATE lessons SET status = 'published', updated_at = now() WHERE slug = $1 RETURNING *`,
    [slug]
  );
  return normalizeRow(rows[0]);
}

async function markUnpublished(slug) {
  const { rows } = await query(
    `UPDATE lessons SET status = 'draft', updated_at = now() WHERE slug = $1 RETURNING *`,
    [slug]
  );
  return normalizeRow(rows[0]);
}

async function deleteLesson(slug) {
  const { rows } = await query('DELETE FROM lessons WHERE slug = $1 RETURNING *', [slug]);
  return rows[0] ? normalizeRow(rows[0]) : null;
}

module.exports = {
  JSON_FIELDS,
  MEDIA_COLUMNS,
  listLessons,
  createLesson,
  getLesson,
  updateLessonJson,
  updateLessonMediaPath,
  markPublished,
  markUnpublished,
  deleteLesson,
};
