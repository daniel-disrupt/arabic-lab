---
name: lesson-app-integration
description: Wire a new lesson's generated content (audio, tashkeel'd/translated transcript, Reader tokens) into the actual Arabic Lab app as a navigable lesson — registering it, picking which tabs it needs, and the shared-code gaps that only show up once a *second* lesson exists. Use once a lesson's content data is ready and the goal shifts from "produce the content" to "make it load and render in the app."
---

# Wiring a new lesson into the app

Every lesson shares the same `app/lesson.html` shell and `app/js/app.js` —
building a lesson is authoring a `data.json` bundle, not writing new pages.
This skill covers the registration step and the shared-code assumptions that
only surface once a *second* lesson (this project's first was
`abed-jaffa-speech`) exercises a code path the original lesson never did.

## Registration checklist

1. Create `app/lessons/<slug>/data.json` (schema below) and any audio files
   under `app/lessons/<slug>/`.
2. Add an entry to `app/lessons/manifest.json` — a plain hand-editable array,
   one object per lesson (`slug`, `titleAr`, `title:{en,he}`,
   `subtitle:{en,he}`). This is what `index.html`'s homepage lesson list reads;
   nothing else needs touching to make a lesson reachable at
   `lesson.html?slug=<slug>`.
3. Set `meta.tabs` to just the tabs this lesson actually has content for
   (e.g. `["watch"]` before a Reader exists, `["watch","reader"]` once it
   does) — `applyActiveTabs()` hides everything else automatically, and
   `switchTab(ACTIVE_TABS[0])` opens the first one on load.

## Two shared-code bugs this project's second lesson exposed

Both were latent because `abed-jaffa-speech` was the only lesson ever loaded
through this code, so nothing had exercised the "a *different* lesson's data"
path. Fixed in `app/js/app.js` — already committed, not something to
rediscover per lesson, but worth knowing about if either symptom recurs:

- **`buildReader()` crashes if `voiceover.chunks` doesn't have one entry per
  `chunks[]` entry** (`Cannot read properties of undefined (reading 'label')`)
  — it unconditionally reads `VOICEOVER_CHUNKS[ci].label` for the chunk time
  badge, even before any real TTS audio/karaoke exists. **If a lesson's Reader
  chunks are ready before its voiceover is generated, still populate
  `voiceover.chunks` with one placeholder `{start:0, end:0, label:'§N'}` per
  chunk** (real start/end/label get filled in once the TTS pass runs) — don't
  leave it `[]`.
- **The Reader's visible title/location text (`#lesson-title-ar`/
  `#lesson-location-ar`) was hardcoded per-lesson markup in the shared
  `lesson.html`**, captured once into a JS constant at parse time and never
  re-synced — every lesson silently showed Abed's title until this was fixed.
  Now `initLesson()` overwrites both the DOM text and the captured original
  from `bundle.headerGloss.title.ar` / `.location.ar` when a lesson provides
  one — **always populate `headerGloss.title`/`.location` (all three
  languages) for a new lesson**, not just the tap-to-gloss use it was
  originally built for.
- Similarly, **tab *labels* are global** (`TAB_LABELS`, keyed only by tab
  name, e.g. `watch` → "Home" for every lesson) — a lesson needing a different
  label for a shared tab id (e.g. an audio-only lesson calling `watch`
  "Listen" instead of "Home") sets `meta.tabLabels: {en:{watch:'Listen'},
  he:{watch:'האזנה'}}`, which `applyAppLang()` checks before falling back to
  the global label. Don't hand-edit the global `TAB_LABELS` for one lesson's
  wording — it would silently change every other lesson sharing that tab.

## Audio-only "Listen" lessons (no video)

The Watch tab hard-assumed a real `<video>` picture (theater mode, black
video box, play overlay, mobile caption burn-in) — none of that exists for a
podcast-only lesson, but the underlying timing/karaoke/cue logic
(`buildWatchTranscript`, `updateWatchLiveWord`, `findActiveTimedIndex`, drag
-select) is entirely media-agnostic, since `HTMLVideoElement` and
`HTMLAudioElement` share `currentTime`/`duration`/`play`/`pause`/events.

- Give the lesson `meta.audioPath` instead of `meta.videoPath`/`captionsPath`.
  `initLesson()` points the same `<video>` element's `<source>` at the mp3
  (setting `type="audio/mpeg"`, not the markup's hardcoded `video/mp4"`) and
  adds an `.audio-only` class to `.watch-video-wrap`.
- CSS (`.watch-video-wrap.audio-only { display:none }`) hides the whole
  video-picture box — the two `.watch-transcript` panels are already
  `flex:1`, so they expand to fill the freed width with no other CSS changes.
- **Don't actually try to autoplay/decode the audio through a headless
  browser automation session to "verify" it** — this project hit a real
  environment limitation where even the *pre-existing, known-working* Abed
  lesson's audio failed to reach `readyState` past 0 in a browser-automation
  tab (confirmed via a direct `curl -H "Range: ..."` check that the server
  itself was serving it correctly, and via testing in a fresh tab). Verify the
  data/rendering visually, then ask the user to confirm actual playback in
  their own real browser rather than chasing what turns out to be a sandbox
  quirk, not a lesson bug.

## Reader tab: what needs to exist before it can render

`chunks[].text[]` word tokens (`w, he, en, pos, root, punct, sep`, optional
`t`/`sentT`/`sharedRoot` — see the schema notes below) are the content;
`voiceover.src`/`wordTimes` are what drive real karaoke, and don't exist until
a **TTS voiceover is generated and aligned** — a separate step
(`lesson-voice-karaoke`'s architecture 1) that needs the user's own terminal
and `OPENAI_API_KEY` (never run/pasted in an agent session). A Reader tab
renders and is fully tap-to-translate-able with `voiceover` left as
`{src:'', chunks:[<placeholders>], wordTimes:[]}` — karaoke highlighting
simply won't animate until the real voiceover pass lands later.

## Verifying the result

Screenshot the rendered page (both scripts/languages if the lesson is new
enough to matter) rather than trusting the JSON alone — this project caught
its Reader tab silently showing the *wrong lesson's* title this way, something
no amount of re-reading the data.json would have surfaced.
