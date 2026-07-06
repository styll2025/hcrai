# hcrai.com

Static homepage for HCRAI. No build step — plain HTML/CSS with self-hosted fonts and images.

## Structure

```
index.html
assets/
  images/   photos + favicon
  fonts/    self-hosted Baloo 2 + Inter (woff2)
```

## Deploy to GitHub Pages

1. Push this folder's contents to a repo (e.g. `hcrai-site`), or to the repo root if this is a dedicated site repo.
2. In the repo: **Settings → Pages → Source** → select the branch (e.g. `main`) and folder (`/root`).
3. Point your `hcrai.com` DNS (A/ALIAS or CNAME per GitHub's docs) at GitHub Pages, and add a `CNAME` file containing `hcrai.com` to the repo root once you're ready to go live on the custom domain.

## Known gaps / placeholder links

The homepage now links out to several pages that don't exist yet in this repo. Nothing will 404 until these are actually deployed as separate files, but they need to be built before launch:

- `about.html`
- `research-and-insights.html`
- `behavioural-risk.html` (also used for the "Take the Assessment" CTA)
- `contact.html`
- `terms.html`
- `privacy-policy.html`

Also still unresolved:

- `#report` ("View Report") — no report page/PDF linked yet
- `#linkedin` (footer icon) — not pointing to an actual LinkedIn profile/page URL

The case study link (`Read the Case Study`) already points to a live absolute URL on hcrai.com, so no change needed there unless that page doesn't exist yet either.

## Notes

- Original file had 2 images embedded as uncompressed PNG (11MB total); converted to JPEG (quality 85–88) for an ~11MB → ~530KB reduction with no visible quality loss.
- Fonts (Baloo 2, Inter) are self-hosted as woff2 rather than pulled from Google Fonts at runtime — no external font requests on page load.
- Your latest upload added responsive/mobile behavior (a hamburger menu, resizing layouts) built on the design tool's internal preview runtime, which only works inside that tool's own bundler — not on a plain static host. I reimplemented the same responsive behavior using standard CSS custom properties + media queries (breakpoints at 860px and 1200px, matching your original logic) and a small vanilla-JS snippet for the mobile menu toggle. No framework or build step required; it's plain HTML/CSS/JS.
