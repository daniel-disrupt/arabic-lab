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
