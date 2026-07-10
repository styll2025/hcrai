# hcrai.com

Static multi-page site for HCRAI. No build step, no framework, no dependencies — plain HTML/CSS/JS with self-hosted fonts and images, shared across every page.

## Structure

```
index.html                                    Homepage (/)
about/index.html                              About (/about/)
contact/index.html                            Contact (/contact/)
behavioural-risk/index.html                   Behavioural Risk Assessment (/behavioural-risk/)
insights/index.html                           Research & Insights (/insights/)
insights/behavioural-risk-ai-systems/         Article: The Human Layer
insights/responsible-ai-child-edtech/         Article: Responsible AI in Child-Focused EdTech
insights/bridging-ai-ethics-practice/         Article: Bridging the Gap
insights/yes-machine-ai-agency/               Article: The Yes Machine
insights/design-system-operational-layer/     Article: Design System as Operational Layer
insights/ai-agents-mental-health/             Article: AI Agents for Mental Health
insights/ai-edtech-learning-process/          Article: When AI Enters the Learning Process
insights/mental-health-wellbeing-tools/       Article: AI Mental Health and Wellbeing Tools
insights/child-centred-ai-framework/          Article: Child-Centred AI Framework
terms/index.html                              Terms and Conditions (/terms/)
privacy-policy/index.html                     Privacy Policy (/privacy-policy/)
_redirects                                    301 redirects from legacy .html URLs to canonical URLs
sitemap.xml                                   Canonical URL sitemap
robots.txt                                    Sitemap discovery for crawlers
assets/
  images/                        photos, illustrations, favicon
  fonts/                         self-hosted Baloo 2 + Inter (woff2)
  css/
    fonts.css                    @font-face declarations (shared by every page)
    site.css                     layout variables, responsive breakpoints, mobile nav, shared section classes
  js/
    site.js                      mobile menu, contact form, article share/notify-signup (vanilla JS, no dependencies)
```


Every page links the same root-relative `/assets/css/fonts.css`, `/assets/css/site.css`, and `/assets/js/site.js`. Add new pages the same way rather than copy-pasting styles inline, so the nav/footer/responsive behavior stays consistent site-wide.

## Deploy to GitHub Pages

1. Push this folder's contents to a repo (e.g. `hcrai-site`), or to the repo root if this is a dedicated site repo.
2. In the repo: **Settings → Pages → Source** → select the branch (e.g. `main`) and folder (`/root`).
3. Point your `hcrai.com` DNS (A/ALIAS or CNAME per GitHub's docs) at GitHub Pages, and add a `CNAME` file containing `hcrai.com` to the repo root once you're ready to go live on the custom domain.

## Known gaps

**Contact form submissions go to Google Sheets.** `/contact/` posts name, email, organisation, message, submission time and page URL to the Google Apps Script endpoint configured in `assets/js/site.js`.

**"Notify Me" on the Behavioural Risk article goes to Google Sheets.** The signup form at the bottom of `/insights/behavioural-risk-ai-systems/` posts name, email, submission time, page URL and source to the Apps Script endpoint configured in `assets/js/site.js`.

**"View Report" opens the white paper PDF.** The homepage and Behavioural Risk page CTAs point to `assets/documents/hcrai-behavioural-ai-risk-white-paper-june-2026.pdf` and open it in a new tab.

Everything else is fully built out and cross-linked, with a consistent nav and footer across all 16 pages. All 9 Research & Insights cards now link to real article pages, and every LinkedIn icon and byline across the site points to a real profile or the HCRAI company page.

## Notes

- Images were converted from the original uploads (many were uncompressed PNG screenshots/photos) to JPEG at quality 85–90 where there was no transparency to preserve, cutting file size substantially with no visible quality loss. A handful of illustrations and portrait photos with real transparency were kept as PNG or WebP.
- Fonts (Baloo 2, Inter) are self-hosted as woff2 rather than pulled from Google Fonts at runtime — no external font requests on page load.
- The responsive/mobile behavior (hamburger menu, resizing layouts) in the original design files was built using the design tool's own internal preview runtime (a React-like engine with template bindings: `{{ responsive.xxx }}`), which only works inside that tool's bundler — not on a plain static host. Every page here has that reimplemented using standard CSS custom properties + media queries and a small vanilla-JS snippet for the mobile menu, shared via `assets/css/site.css` / `assets/js/site.js`. Each page's layout variables are namespaced (e.g. `--raHeroPad` for the Behavioural Risk article, `--uaTwoCol` for Unomundi, `--bgQaCols` for Bridging the Gap, `--ymEffectCols` for The Yes Machine, `--dsoChecklistCols` for The Design System, `--aamhEffectCols` for AI Agents For Mental Health, `--edtechCaseCols` for the EdTech article, `--mhwtPatternsGridCols` for the Mental Health Wellbeing Tools article, `--ccafPatternCols` for the Child-Centred AI Framework article) so one page's numbers never leak into another's.
- The Behavioural Risk page embeds a real, already-functioning Google Apps Script form (the BAIRA assessment) via `<iframe>` — that one works as-is, no conversion needed.
- All eight articles' "Share" buttons use the native Web Share API where available, falling back to copy-link-to-clipboard (with a "Link copied" confirmation on the Behavioural Risk article) — this part is fully functional, no backend needed.
- "Bridging the Gap" embeds a real YouTube video (the full roundtable recording) via `<iframe>` — works as-is.
- CTA copy was made consistent across the site: every "Schedule a Consultation" button is now "Request a Discovery Call".
- Several articles' body links (citations, external sources) use a shared `.body-link` style defined once in `assets/css/site.css` rather than per-page.
- "The Yes Machine" article and its Research & Insights card thumbnail both use the `research-teens-phones.jpg` illustration with the same inline CSS hue-rotate/saturation filter, matching the source design.
- "Building AI Responsibly for Children" (the Child-Centred AI Framework article) renders two lists of interaction patterns (9 "patterns to avoid", 10 "safer patterns") that were defined as data in the source file's script rather than as static markup — these were expanded into the page directly from that data, so the copy matches the source exactly.
- Mark Reynolds' headshot (Design System article) was initially missing because the source file referenced it through the design tool's own live drag-and-drop image component rather than an embedded file. Once the full project folder (not just the standalone export) was available, the actual photo was found and added in.
- The connected project folder is also where several illustrations turned out to have real colour updates beyond what the first exports showed: `research-brain-lightbulbs.png`, `research-anxious-vs-mindful.jpg`, `research-students-discussing.jpg`, and `research-robot-and-child.jpg` (re-saved from PNG to JPEG, and re-cropped to full size) were all refreshed to match. A few other images compared as visually identical to what was already self-hosted, so those were left as-is.
- Every `#linkedin` placeholder across the site (footer icon on all 16 pages, the About page's two team bios, and the Unomundi article's author byline) now points to a real profile: the HCRAI company page for the footer icon, and personal profiles for Sara Portell and Yasmina El-Fassi where named.
