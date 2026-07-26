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
