# hcrai.com

Static multi-page site for HCRAI. No build step, no framework, no dependencies — plain HTML/CSS/JS with self-hosted fonts and images, shared across every page.

## Structure

```
index.html                       Homepage
about.html                       About / Team
research-and-insights.html       Research & Insights (article grid)
behavioural-risk.html            Behavioural Risk Assessment (live embedded form)
behavioural-risk-article.html    Article: The Human Layer (Behavioural Risk findings)
unomundi-article.html            Article: Responsible AI in Child-Focused EdTech (Unomundi case study)
contact.html                     Contact
terms.html                       Terms and Conditions
privacy-policy.html              Privacy Policy
assets/
  images/                        photos, illustrations, favicon
  fonts/                         self-hosted Baloo 2 + Inter (woff2)
  css/
    fonts.css                    @font-face declarations (shared by every page)
    site.css                     layout variables, responsive breakpoints, mobile nav, shared section classes
  js/
    site.js                      mobile menu, contact form UI, article share/notify-signup (vanilla JS, no dependencies)
```

Every page links the same `assets/css/fonts.css`, `assets/css/site.css`, and `assets/js/site.js`. Add new pages the same way rather than copy-pasting styles inline, so the nav/footer/responsive behavior stays consistent site-wide.

## Deploy to GitHub Pages

1. Push this folder's contents to a repo (e.g. `hcrai-site`), or to the repo root if this is a dedicated site repo.
2. In the repo: **Settings → Pages → Source** → select the branch (e.g. `main`) and folder (`/root`).
3. Point your `hcrai.com` DNS (A/ALIAS or CNAME per GitHub's docs) at GitHub Pages, and add a `CNAME` file containing `hcrai.com` to the repo root once you're ready to go live on the custom domain.

## Known gaps

**Contact form has no backend.** `contact.html`'s form currently only swaps the on-page UI (shows a "Thanks for reaching out" message) when submitted — it does not send the message anywhere. The original design file has the same limitation. To make it actually deliver messages, wire the `<form>` to a service like Formspree, Netlify Forms, Getform, or your own endpoint, or change `handleContactSubmit` in `assets/js/site.js` to POST somewhere.

**"Notify Me" on the Behavioural Risk article has the same limitation.** The email signup at the bottom of `behavioural-risk-article.html` shows a "Thanks!" confirmation but doesn't actually collect or send the email anywhere — same as in the original design file. Needs a real mailing-list backend (Mailchimp, Buttondown, etc.) if you want it to work.

**7 of the 9 Research & Insights article cards don't link anywhere yet.** Only "Responsible AI in Child-Focused EdTech: Lessons from Unomundi" and "The Human Layer: Behavioural Risk in AI Systems" now link to real article pages. The other 7 cards still link to `#article`, a placeholder, until those articles are built.

**"View Report" has no destination.** The `#report` link (homepage and Behavioural Risk page) and the "View Report" buttons on the Behavioural Risk article aren't pointing to an actual report page or PDF yet.

**LinkedIn icon isn't wired up.** The `#linkedin` icon link (in every page's footer, the About page's two team bios, and the article author/quote bylines) isn't pointing to a real LinkedIn profile/company URL.

Everything else is fully built out and cross-linked, with a consistent nav and footer across all 9 pages.

## Notes

- Images were converted from the original uploads (many were uncompressed PNG screenshots/photos) to JPEG at quality 85–90 where there was no transparency to preserve, cutting file size by roughly 90% with no visible quality loss in each case. A handful of illustrations and portrait photos with real transparency were kept as PNG or WebP (as originally supplied). Total site size is about 4.5MB across all 9 pages and their images/fonts.
- Fonts (Baloo 2, Inter) are self-hosted as woff2 rather than pulled from Google Fonts at runtime — no external font requests on page load.
- The responsive/mobile behavior (hamburger menu, resizing layouts) in the original design files was built using the design tool's own internal preview runtime (a React-like engine with template bindings: `{{ responsive.xxx }}`), which only works inside that tool's bundler — not on a plain static host. Every page here has that reimplemented using standard CSS custom properties + media queries and a small vanilla-JS snippet for the mobile menu, shared via `assets/css/site.css` / `assets/js/site.js`. Each page's layout variables are namespaced (e.g. `--raHeroPad` for the Behavioural Risk article, `--uaTwoCol` for the Unomundi article) so one page's numbers never leak into another's.
- The Behavioural Risk page embeds a real, already-functioning Google Apps Script form (the BAIRA assessment) via `<iframe>` — that one works as-is, no conversion needed.
- Both articles' "Share" buttons use the native Web Share API where available, falling back to copy-link-to-clipboard (with a "Link copied" confirmation on the Behavioural Risk article) — this part is fully functional, no backend needed.
- CTA copy was made consistent across the site: every "Schedule a Consultation" button is now "Request a Discovery Call".
- The Unomundi article's body links (citations, external sources) use a shared `.body-link` style now defined once in `assets/css/site.css` rather than per-page.
