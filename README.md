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

These `<a>` links point to sections or pages that don't exist yet — decide whether they need real destinations before launch:

- `#assessment` (nav CTA "Take the Assessment") — no assessment tool/page built yet
- `#report` ("View Report") — no report page/PDF linked yet
- `#terms`, `#privacy` (footer) — no Terms & Conditions or Privacy Policy pages yet
- `#linkedin` (footer icon) — not pointing to an actual LinkedIn profile/page URL
- Nav item "Behavioural Risk" links to `#risk`, an in-page anchor — fine if that's intentional, but confirm it shouldn't be a separate page

The case study link (`Read the Case Study`) already points to a live absolute URL on hcrai.com, so no change needed there unless that page doesn't exist yet either.

## Notes

- Original file had 2 images embedded as uncompressed PNG (11MB total); converted to JPEG (quality 85–88) for an ~11MB → ~530KB reduction with no visible quality loss.
- Fonts (Baloo 2, Inter) are self-hosted as woff2 rather than pulled from Google Fonts at runtime — no external font requests on page load.
