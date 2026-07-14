require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');

const { basicAuth } = require('./src/auth');
const db = require('./src/db');
const lessons = require('./src/lessons');
const { publishLesson } = require('./src/publish');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '.data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const upload = multer({ dest: UPLOAD_DIR });

const app = express();
app.use(basicAuth);
app.use(express.json({ limit: '15mb' })); // lesson JSON blobs (chunks/verbs/etc.) can be sizeable
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lessons', async (req, res, next) => {
  try { res.json(await lessons.listLessons()); }
  catch (err) { next(err); }
});

app.post('/api/lessons', async (req, res, next) => {
  try { res.status(201).json(await lessons.createLesson(req.body || {})); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/lessons/:slug', async (req, res, next) => {
  try {
    const lesson = await lessons.getLesson(req.params.slug);
    if (!lesson) return res.status(404).json({ error: 'not found' });
    res.json(lesson);
  } catch (err) { next(err); }
});

app.put('/api/lessons/:slug/json/:field', async (req, res) => {
  try { res.json(await lessons.updateLessonJson(req.params.slug, req.params.field, req.body)); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/lessons/:slug/media/:kind', upload.single('file'), async (req, res) => {
  try {
    if (!lessons.MEDIA_COLUMNS[req.params.kind]) return res.status(400).json({ error: 'unknown media kind' });
    if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
    const destPath = path.join(UPLOAD_DIR, req.params.slug + '-' + req.params.kind + path.extname(req.file.originalname));
    fs.renameSync(req.file.path, destPath);
    res.json(await lessons.updateLessonMediaPath(req.params.slug, req.params.kind, destPath));
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/lessons/:slug/publish', async (req, res) => {
  try {
    const lesson = await lessons.getLesson(req.params.slug);
    if (!lesson) return res.status(404).json({ error: 'not found' });
    const result = publishLesson(lesson);
    if (result.pushed) await lessons.markPublished(req.params.slug);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, stderr: err.stderr ? err.stderr.toString() : undefined });
  }
});

const PORT = process.env.PORT || 3000;
db.init()
  .then(() => app.listen(PORT, () => console.log('Arabic Lab CMS listening on :' + PORT)))
  .catch((err) => { console.error('Failed to initialize database', err); process.exit(1); });

module.exports = app;
