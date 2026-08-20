# The Landing replaces the Launch

The single-screen Launch — WebGL aurora field, one headline, one mail CTA — is gone. In its place is the Landing imported from Claude Design (`MSW Landing.dc.html`): nav, hero, six specialties, method, why-us, international, contact composer, footer. It is a different page, not a restyle, so the aurora canvas, `LaunchPage`, and `launch.css` were deleted rather than adapted.

Three things about the port are worth writing down.

**Fonts are self-hosted through Astro, not linked from a CDN.** The design loaded Clash Display and Satoshi from Fontshare and the Noto faces from Google. `public/_headers` sets `font-src 'self'`, so those requests would have been blocked, and relaxing the CSP to admit two more origins was the wrong trade. Astro 7's `fonts` config downloads every family at build time into `/_astro/fonts/`; the CSP is untouched and no font binaries live in the repo. Each family declares `fallbacks: []` because Astro bakes fallbacks into the `cssVariable` value terminated by a generic family, which would cut the Latin → CJK/Arabic cascade short; `src/styles/site.css` composes those stacks per locale instead.

**The Japanese page carries the cost of CJK subsetting.** Noto Sans JP and Noto Serif JP arrive as ~80 unicode-range slices each, and `inlineStylesheets: 'always'` puts all of it in the HTML — `/ja/` is ~246 KB raw against ~54 KB for the Latin locales, though it brotlis to ~31 KB and the browser only fetches the slices it needs. Trimming to the weights actually used (Sans 400/700, Serif 500) and dropping the redundant `latin` subset halved it. Subsetting to the exact glyph set on the page would remove the rest, at the price of a build-time font toolchain.

**Motion runs through tokens.** `--anim-*` and `--t-*` in `site.css` carry every animation name and transition duration; `prefers-reduced-motion` redefines them. The usual blanket `* { animation-duration: 0.001ms !important }` reset would have fought scoped component styles, and `!important` is not something we reach for.

**Status:** accepted
