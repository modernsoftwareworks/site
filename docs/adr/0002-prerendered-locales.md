# Prerendered locale routes

English, Italian, French, Japanese, and Arabic are real documents at `/`, `/it/`, `/fr/`, `/ja/`, and `/ar/` with `hreflang`, not one URL whose copy is swapped in the browser. Crawlers and link previews otherwise only ever see English. The Claude Design source for the Landing did exactly that — a `?lang=` query param plus a `componentDidMount` that rewrote `<head>` — and we did not carry it over. Last Locale is remembered in `localStorage` so a return visit to `/` can restore a prefixed route; we do not inspect `Accept-Language` on the edge, which would require a Worker. Arabic sets `dir="rtl"` on `<html>`; layout uses logical properties so no mirrored stylesheet exists.

**Status:** accepted
