# Prerendered locale routes

English, Italian, and Japanese are real documents at `/`, `/it/`, and `/ja/` with `hreflang`, not one URL whose copy is swapped in the browser. Crawlers and link previews otherwise only ever see English. Last Locale is remembered in `localStorage` so a return visit to `/` can restore `/it/` or `/ja/`; we do not inspect `Accept-Language` on the edge, which would require a Worker.

**Status:** accepted
