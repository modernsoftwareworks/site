# Modern Software Works

Studio site for [modernsoftware.works](https://modernsoftware.works). Astro generates static HTML; Cloudflare Workers serves the files. No Worker script runs on a request.

## Develop

```bash
bun install
bun run dev
```

```bash
bun run test
bun run lint
bun run check
bun run deadcode
bun run audit
bun run verify
```

Toolchain is native binaries, one job each:

- **Bun** — package manager and runtime (`bun run audit` checks the tree against the advisory database; the lockfile is Bun 1.4's `lockfileVersion: 2`)
- **Biome** — lint + format for `.astro`, TypeScript, CSS, JSON (replaces ESLint + Prettier)
- **Fallow** — unused code, deps, cycles (`bun run deadcode`; `bunx fallow` also reports dupes and health)
- **Lefthook** — git hooks (replaces husky / simple-git-hooks + lint-staged)
- **Lightning CSS** — minify
- **Vitest** — tests

`bun run verify` is the full gate: types, lint, dead code, tests, production build. Commits run Biome on staged files and Fallow dead-code in parallel.

Push to `main` deploys through Workers Builds. The Worker name is `site`. Configure the dashboard Build command as `bun run build` and Deploy as `bunx wrangler deploy`.

## Fonts

Clash Display, Satoshi, and the Noto JP/Arabic faces are declared in `astro.config.ts` and downloaded at build time into `/_astro/fonts/`. They are served from our own origin, so `public/_headers` can keep `font-src 'self'`. **A build needs network access to Fontshare and Google Fonts**; results are cached in `node_modules/.astro/fonts`.

`bun run og` regenerates `public/og.png` and `public/apple-touch-icon.png`. It pulls the brand TrueType files into `node_modules/.cache/og-fonts` so the card is set in the real faces without committing binaries.

## Layout

```
src/
  assets/brand/     Monogram SVG (also the source for the OG card)
  components/
    brand/          Monogram
    i18n/           Locale pills
    seo/            Head: meta, hreflang, JSON-LD, font tags
    site/           The Landing's bands
  content/          Future collections (work, writing)
  i18n/             Locales, message schema, five translations
  layouts/
  lib/              Composer logic (pure, unit-tested)
  pages/            `/`, `/it/`, `/fr/`, `/ja/`, `/ar/`, `404`
  scripts/          Composer wiring, logo tilt, locale preference
  styles/           Tokens, base, keyframes
docs/
  adr/              Hard-to-reverse decisions
```

Add a locale by extending `src/i18n/locales.ts`, adding `src/i18n/messages/<code>.ts`, adding `src/pages/<code>/index.astro`, and listing it under `i18n` and `sitemap` in `astro.config.ts`.
