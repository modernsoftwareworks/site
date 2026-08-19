# Modern Software Works

Studio site for [modernsoftware.works](https://modernsoftware.works). Astro generates static HTML; Cloudflare Workers serves the files. No Worker script runs on a request.

## Develop

```bash
bun install
bun run dev
```

```bash
bun test
bun run lint
bun run check
bun run deadcode
bun run verify
```

Toolchain is native binaries, one job each:

- **Bun** — package manager and runtime
- **Biome** — lint + format for `.astro`, TypeScript, CSS, JSON (replaces ESLint + Prettier)
- **Fallow** — unused code, deps, cycles (`bun run deadcode`; `bunx fallow` also reports dupes and health)
- **Lefthook** — git hooks (replaces husky / simple-git-hooks + lint-staged)
- **Lightning CSS** — minify
- **Vitest** — tests

`bun run verify` is the full gate: types, lint, dead code, tests, production build. Commits run Biome on staged files and Fallow dead-code in parallel.

Push to `main` deploys through Workers Builds (`bun run build` then `bunx wrangler deploy`). In the dashboard, set **Build command** to `bun run build`, **Deploy command** to `bunx wrangler deploy`, and **BUN_VERSION** to `1.3.14` so CI is not stuck on the image default. Match `name` in `wrangler.jsonc` to the Worker already connected to this GitHub repo.

## Layout

```
src/
  assets/brand/     Wordmark SVG
  components/       Brand, launch, locale switcher, SEO
  content/          Future collections (work, writing)
  i18n/             Locales and copy
  layouts/
  pages/            `/`, `/it/`, `/ja/`
  scripts/          Aurora field, locale preference
  styles/
docs/
  adr/              Hard-to-reverse decisions
  design/           OpenDesign handoff
```

Add a page by dropping a file under `src/pages/` (and `src/pages/it/`, `src/pages/ja/` for locales) and extending `src/i18n/messages/`.
