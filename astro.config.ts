import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://modernsoftware.works',
  trailingSlash: 'always',
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
      sourcemap: false,
      modulePreload: { polyfill: false },
      target: 'es2023',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/og-card'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          it: 'it',
          ja: 'ja',
        },
      },
    }),
  ],
});
