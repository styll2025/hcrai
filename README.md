# hcrai.com

Static multi-page site for HCRAI. No build step — plain HTML/CSS/JS with self-hosted fonts and images, shared across pages.

## Structure

```
index.html          Homepage
about.html           About / Team page
assets/
  images/            photos + favicon
  fonts/             self-hosted Baloo 2 + Inter (woff2)
  css/
    fonts.css        @font-face declarations (shared by every page)
    site.css         layout variables, responsive breakpoints, mobile nav, shared section classes
  js/
    site.js          mobile menu toggle (vanilla JS, no dependencies)
```

Every page links the same `assets/css/fonts.css`, `assets/css/site.css`, and `assets/js/site.js` — add new pages the same way rather than copy-pasting styles inline, so the nav/footer/responsive behavior stays consistent site-wide.

## Deploy to GitHub Pages

1. Push this folder's contents to a repo (e.g. `hcrai-site`), or to the repo root if this is a dedicated site repo.
2. In the repo: **Settings → Pages → Source** → select the branch (e.g. `main`) and folder (`/root`).
3. Point your `hcrai.com` DNS (A/ALIAS or CNAME per GitHub's docs) at GitHub Pages, and add a `CNAME` file containing `hcrai.com` to the repo root once you're ready to go live on the custom domain.

## Known gaps / placeholder links

Both pages link out to several pages that don't exist yet in this repo. Nothing will 404 until these are actually deployed as separate files, but they need to be built before launch:

- `research-and-insights.html`
- `behavioural-risk.html` (also used for the homepage's "Take the Assessment" CTA)
- `contact.html`
- `terms.html`
- `privacy-policy.html`

Also still unresolved:

- `#report` (homepage "View Report") — no report page/PDF linked yet
- `#linkedin` (footer icon, both pages) — not pointing to an actual LinkedIn profile/page URL
- `#consult` is used as an in-page anchor on both the homepage and About page (each has its own "Ready to see where your AI stands?" section with that id) — that's intentional per-page behavior, not a bug, but worth knowing if you ever merge sections.

The case study link on the homepage ("Read the Case Study") already points to a live absolute URL on hcrai.com, so no change needed there unless that page doesn't exist yet either.

## Notes

- Images are converted from the original uncompressed PNGs to JPEG (quality 85–90) to cut file size drastically with no visible quality loss:
  - Homepage: ~11MB → ~530KB (2 images)
  - About page: ~2.4MB → ~97KB (2 of 3 images; the third was already a JPEG)
- Fonts (Baloo 2, Inter) are self-hosted as woff2 rather than pulled from Google Fonts at runtime — no external font requests on page load.
- The homepage's mobile/responsive behavior (hamburger menu, resizing layouts) was originally built using the design tool's internal preview runtime (a React-like engine with template bindings), which only works inside that tool's own bundler — not on a plain static host. I reimplemented the same behavior using standard CSS custom properties + media queries (breakpoints at 860px and 1200px matching the original logic) and a small vanilla-JS snippet for the mobile menu, now shared in `assets/css/site.css` / `assets/js/site.js`.
- The uploaded About page didn't originally include this responsive/mobile-menu behavior (it was a fixed desktop layout only). I extended it to match the homepage's mobile treatment for consistency — nav collapses into the same hamburger menu, and the two team bio sections (Sara Portell, Yasmina El-Fassi) stack to a single column on narrow screens instead of staying frozen in a 2-column grid. If you'd rather the About page behave differently on mobile, flag it and I'll adjust.
