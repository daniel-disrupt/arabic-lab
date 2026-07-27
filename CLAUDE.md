# Arabic Lab

## Branding

The project's visual identity is the `.brand-mark` component: عربي and ערבי set
letter-by-letter, one script stacked directly on the other so each pair touches (ع/ע,
ر/ר, ب/בּ, ي/י), with **LAB** standing beside it. It's the one piece of UI that reads
the same regardless of which site language (Hebrew/English) is active — never replace
it with a plain "Arabic Lab" text label.

- Defined in `app/css/style.css` (`.brand-mark` and its `.bm-*` children); duplicated
  inline in `app/index.html`'s `<style>` block since that page doesn't link the shared
  stylesheet.
- Currently placed: centered on the homepage (`app/index.html`, `.lib-title.brand-mark`)
  and at the top of the mobile hamburger drawer (`app/lesson.html`, `.side-menu-header`).
- **Requirement:** any new lesson view, menu, or drawer added to the app gets this mark
  at its top/header — not plain text. `app/lesson.html` is the single shared shell for
  every lesson (lessons are `data.json` files under `app/lessons/`, not separate HTML
  pages), so in the common case this is automatic; if a lesson ever gains its own
  standalone menu or header outside that shell, carry `.brand-mark` over to it too.

## Reader mode

A black-background/light-text theme, toggled from the mobile hamburger drawer (below
the site-language and learning-alphabet switches) to cut glare and OLED battery draw
during reading. It is a standing design element of that drawer, not a one-off lesson
feature.

- Implemented entirely via CSS custom properties in `app/css/style.css` (`--black`,
  `--bg`, `--on-accent`/`--on-accent-rgb`, `--tint-rgb`), re-pointed by a single
  `body.reader-mode` class — components read these variables rather than hardcoded
  colors, so no component-level dark-mode rules are needed.
- Toggle + persistence logic lives in `app/js/app.js` (`toggleReaderMode`/
  `applyReaderMode`, `localStorage` key `arabicLabReaderMode`); markup is the
  `.reader-mode-toggle` switch in `app/lesson.html`'s `.side-menu-settings`.
- **Requirement:** same rule as `.brand-mark` above — since `app/lesson.html` is the
  shared shell for every lesson, this toggle is automatic for every lesson (existing and
  new) with no per-lesson work. If a lesson ever gains its own standalone menu/header
  outside that shell, carry the reader-mode toggle over too, and make sure any new
  colored UI in that menu is expressed through the variables above (not literal
  `#fff`/black) so it inherits the theme instead of breaking it.

## Selectable lesson text

`app/css/style.css` defaults `body` to `user-select: none` so taps on buttons/tabs/tiles
fire the intended action instead of a native text selection. Lesson *content* — anything
meant to be read, like proverb cards, flashcards, fill-in-the-blank sentences,
word-scramble answers, vocab entries, and verb conjugation cards — is meant to be
highlightable and copyable, not locked down by that default.

- Content containers opt back into `user-select: text` individually (see the
  "SELECTABLE LESSON TEXT" comment above the `html, body` rule in `style.css` for the
  full list: `.proverb-card`, `.flashcard`, `.fillblank-sentence`, `.scramble-built`,
  `.vocab-item`, `.verb-card`, plus the existing `.lesson-head`/`.watch-head`/
  `.about-wrap`). The rule cascades, so putting it on the card/container is enough —
  don't add it line-by-line to every child span.
- **Requirement:** any new lesson view or tab gets the same treatment — its readable
  content container should carry `user-select: text` (and `-webkit-user-select: text`),
  not just inherit the global `none`.
- **Exception:** don't add this to text that has its own drag/tap gesture, which native
  selection would fight with — the Reader's word-drag phrase-lookup and the Watch
  transcript's word-range selection are deliberately left `user-select: none`.

## Text size controls

A manual A⁻/A⁺ control (`.text-size-ctrl`/`.text-size-btn`, built by
`createFontScaler()` in `app/js/app.js`) only belongs on views with a real block of
continuous running text to resize — at least a paragraph or two. Reader (the transcript)
and Watch (the caption columns) both qualify and keep their own independent scale/
localStorage key via `createFontScaler`.

- **Don't add one** to little-card or single-sentence content — Flashcards, Fill-in-the-
  Blank, Word Scramble, and the Proverbs tab's cards. Flashcards used to have front/back
  text-size controls; they were removed because a one-line proverb or a sentence or two
  of explanation doesn't give a +/- control enough to actually do — there's no reflow to
  speak of. If a lesson view like this needs bigger text, widen the view's container and
  bump the content's own font-size instead (see `.proverbs-inner`/`.proverb-words` in
  `app/css/style.css` for the pattern) rather than handing the learner a knob.
- **Do add one** the same way Reader/Watch do it (`createFontScaler`, its own CSS
  variable + `localStorage` key) for any new view that's substantial running prose.
