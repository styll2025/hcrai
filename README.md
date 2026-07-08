# hcrai.com

Static multi-page site for HCRAI. No build step, no framework, no dependencies — plain HTML/CSS/JS with self-hosted fonts and images, shared across every page.

## Structure

```
index.html                    Homepage
about.html                    About / Team
research-and-insights.html    Research & Insights (article grid)
behavioural-risk.html         Behavioural Risk Assessment (live embedded form)
contact.html                  Contact
terms.html                    Terms and Conditions
privacy-policy.html           Privacy Policy
assets/
  images/                     photos, illustrations, favicon
  fonts/                      self-hosted Baloo 2 + Inter (woff2)
  css/
    fonts.css                 @font-face declarations (shared by every page)
    site.css                  layout variables, responsive breakpoints, mobile nav, shared section classes
  js/
    site.js                   mobile menu toggle + contact form UI (vanilla JS, no dependencies)
```

Every page links the same `assets/css/fonts.css`, `assets/css/site.css`, and `assets/js/site.js`. Add new pages the same way rather than copy-pasting styles inline, so the nav/footer/responsive behavior stays consistent site-wide.

## Deploy to GitHub Pages

1. Push this folder's contents to a repo (e.g. `hcrai-site`), or to the repo root if this is a dedicated site repo.
2. In the repo: **Settings → Pages → Source** → select the branch (e.g. `main`) and folder (`/root`).
3. Point your `hcrai.com` DNS (A/ALIAS or CNAME per GitHub's docs) at GitHub Pages, and add a `CNAME` file containing `hcrai.com` to the repo root once you're ready to go live on the custom domain.

## Known gaps

**Contact form has no backend.** `contact.html`'s form currently only swaps the on-page UI (shows a "Thanks for reaching out" message) when submitted — it does not send the message anywhere. The original design file has the same limitation (it only toggled local UI state in the design tool's own preview, with no server call). To make it actually deliver messages, wire the `<form>` in `contact.html` to a service like Formspree, Netlify Forms, Getform, or your own endpoint, or change `handleContactSubmit` in `assets/js/site.js` to POST somewhere. Flagging this because it would otherwise look like it works while silently dropping every submission.

**Research & Insights article cards don't link anywhere.** All 9 cards on `research-and-insights.html` link to `#article`, a placeholder. Each needs a real article page (or an external URL) once that content exists.

**"View Report" has no destination.** The `#report` link (homepage and Behavioural Risk page, in "The Human Factor" section) isn't pointing to an actual report page or PDF yet.

**LinkedIn icon isn't wired up.** The `#linkedin` icon link (in every page's footer, plus the About page's two team bios) isn't pointing to a real LinkedIn profile/company URL.

Everything else — About, Research & Insights, Behavioural Risk (including its live embedded Google Apps Script assessment form), Contact, Terms, and Privacy Policy — is fully built out and cross-linked; the nav and footer are consistent across all 7 pages.

## Notes

- Images were converted from the original uploads (several were uncompressed PNG screenshots/photos) to JPEG at quality 85–90 where there was no transparency to preserve, cutting file size by roughly 90% with no visible quality loss. Two Research & Insights illustrations have real transparency and were kept as PNG. Total site size is about 3.5MB.
- Fonts (Baloo 2, Inter) are self-hosted as woff2 rather than pulled from Google Fonts at runtime — no external font requests on page load.
- The responsive/mobile behavior (hamburger menu, resizing layouts) in the original design files was built using the design tool's own internal preview runtime (a React-like engine with template bindings: `{{ responsive.xxx }}`), which only works inside that tool's bundler — not on a plain static host. Every page here has that reimplemented using standard CSS custom properties + media queries (breakpoints generally at 860px and 1200px, matching the original logic; the Research grid has its own narrow breakpoint at 1100px) and a small vanilla-JS snippet for the mobile menu, shared via `assets/css/site.css` / `assets/js/site.js`.
- The Behavioural Risk page embeds a real, already-functioning Google Apps Script form (the BAIRA assessment) via `<iframe>` — that one works as-is, no conversion needed.
- CTA copy was made consistent across the site in this update: every "Schedule a Consultation" button is now "Request a Discovery Call".
