# Arabic Lab CMS — walking skeleton

Single-admin content pipeline: create a lesson, paste in the pipeline output you already
produce locally (transcription, tashkīl, translation, vocab/verb extraction, voiceover —
still your own local scripts, unchanged), upload the lesson's media, and hit **Publish** to
push it live onto the public multi-lesson site.

This is deliberately narrow: no in-CMS AI calls, no per-item review/edit UI, no multi-user
roles. It exists to prove the ingest → store → publish loop works, before automating anything
further. See the project's "Arabic Lab CMS — Walking Skeleton" plan for the full phased
roadmap this fits into.

## Architecture

- **Postgres**: one `lessons` table (see `src/schema.sql`), each pipeline artifact stored as a
  JSONB blob rather than normalized rows — intentional for this phase, see the comment at the
  top of `schema.sql`.
- **Auth**: HTTP Basic Auth in front of the entire app (`ADMIN_USER`/`ADMIN_PASS`). No sessions,
  no user table — this is a single-admin tool.
- **Storage**: uploaded video/audio/vtt land on this service's own disk, under `DATA_DIR`. On
  Railway that MUST be a mounted **Volume** — the default container filesystem is ephemeral
  and anything written to it can vanish on redeploy.
- **Publish**: clones (or fast-forwards) a working copy of the public site's repo under
  `DATA_DIR/repo`, writes `app/lessons/<slug>/data.json` + copies the lesson's media into
  `app/lessons/<slug>/`, updates `app/lessons/manifest.json`, commits, and pushes straight to
  `master` — the existing `.github/workflows/pages.yml` takes it from there. No separate
  object-storage service (e.g. S3/R2) is used; the Railway Volume covers both the upload
  staging area and the git working copy, which is simpler to operate than two storage
  providers with two sets of credentials.

## Local development

```bash
cd cms
npm install
cp .env.example .env   # fill in DATABASE_URL, ADMIN_USER/PASS, REPO_URL
npm start
```

Needs a real local Postgres for `DATABASE_URL`, or run the test suite instead, which uses
`@electric-sql/pglite` (a real embedded Postgres, no install required) and a disposable local
git repo standing in for GitHub — no external services needed at all:

```bash
node test/smoke.js
```

## Deploying on Railway

1. **Create a Railway project**, add this repo, and set the service's **root directory** to
   `cms/` (Railway supports deploying a subdirectory of a monorepo — the public `app/`
   directory is untouched and keeps deploying separately via GitHub Pages).
2. **Add a Postgres plugin** to the project. Reference its connection string as this service's
   `DATABASE_URL` env var (Railway can wire this automatically via `${{Postgres.DATABASE_URL}}`).
3. **Attach a Volume** to the service (Railway → service → Settings → Volumes), mounted at
   e.g. `/data`. Set `DATA_DIR=/data`.
4. **Mint a GitHub PAT** scoped to just this repo: GitHub → Settings → Developer settings →
   Fine-grained tokens → generate one scoped to `daniel-disrupt/arabic-lab` with
   **Contents: Read and write** permission only. Set `REPO_URL` to
   `https://<token>@github.com/daniel-disrupt/arabic-lab.git`.
5. Set `ADMIN_USER` / `ADMIN_PASS` to your own choice, `PORT` is provided by Railway
   automatically (don't hardcode it).
6. Deploy. First publish will take a moment longer (initial `git clone` into the volume).

## Using it

1. Open the service's URL, sign in with `ADMIN_USER`/`ADMIN_PASS` (your browser will prompt).
2. **New lesson**: slug, title, subtitle, dialect.
3. On the lesson page, paste in the seven JSON blobs — these are exactly the shapes your local
   pipeline already produces (see `../scripts/migrate-lesson-to-json.js` in the main repo for
   a worked example of assembling all seven from the original single-lesson build, including
   the `content_json` shape: `{ homeContent, introContent, aboutContent, headerGloss }`).
4. Upload the lesson's video (.mp4), voiceover (.mp3), and captions (.vtt).
5. Hit **Publish**. Once it reports "pushed to master," GitHub Actions deploys within a few
   minutes and the lesson appears on the public site's Home page.

## What's deliberately not here yet

Per-item review/edit UI for individual vocab/verb/segment rows, calling LLM/TTS APIs directly
from this backend instead of pasting in already-generated output, normalizing the `*_json`
blobs into real relational tables, and multi-reviewer roles — all explicitly deferred to
later phases once this skeleton has been used on a real second lesson.
