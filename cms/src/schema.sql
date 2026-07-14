-- Deliberately denormalized for the CMS skeleton: each pipeline artifact is stored as a JSONB
-- blob rather than its own relational table. Normalize into per-row segment/vocab/verb tables
-- once an in-CMS review/edit UI actually needs to query or filter individual items -- see
-- the "Arabic Lab CMS -- Walking Skeleton" plan for the full phase sequencing.
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  dialect TEXT,
  source_note TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'published'

  chunks_json JSONB,          -- reading-edition CHUNKS (Reader tab)
  phrase_glosses_json JSONB,  -- PHRASE_GLOSSES (idiom/proverb fallback glosses)
  vocab_json JSONB,           -- SEED_VOCAB (Vocab tab starter list)
  verbs_json JSONB,           -- SAVED_VERBS (Verbs tab)
  watch_captions_json JSONB,  -- WATCH_CAPTIONS (Watch tab running transcript/translation)
  voiceover_json JSONB,       -- { src, chunks, wordTimes } for the AI voiceover
  content_json JSONB,         -- { homeContent, introContent, aboutContent, headerGloss }

  video_asset_path TEXT,          -- local path (on the CMS's persistent volume) to the uploaded video
  voiceover_audio_path TEXT,      -- local path to the uploaded voiceover mp3
  captions_vtt_path TEXT,         -- local path to the uploaded captions vtt

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
