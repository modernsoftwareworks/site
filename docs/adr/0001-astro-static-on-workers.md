# Astro, static, on Workers assets

The Studio site is a content page, not an app. We generate HTML at build time with Astro and deploy the `dist` folder as Cloudflare Workers static assets — no Worker script, so a request does not run isolate compute. Next.js, Nuxt, and SPA shells were rejected as extra JavaScript and (if SSR is left on) extra compute for no gain. Vite-only or raw HTML would ship the Launch faster and then fight locale URLs, sitemaps, and a second page.

**Status:** accepted
