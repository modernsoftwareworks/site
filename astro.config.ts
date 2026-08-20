import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

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
    locales: ['en', 'it', 'fr', 'ja', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Downloaded and fingerprinted at build time into /_astro/fonts/, so the
  // strict `font-src 'self'` CSP in public/_headers needs no exception.
  // `fallbacks: []` keeps each cssVariable to the family alone: site.css composes
  // the Latin -> CJK/Arabic -> generic cascade per locale, and a generic family
  // baked in here would terminate that chain early.
  fonts: [
    {
      provider: fontProviders.fontshare(),
      name: 'Clash Display',
      cssVariable: '--font-display',
      weights: [500, 600],
      fallbacks: [],
    },
    {
      provider: fontProviders.fontshare(),
      name: 'Satoshi',
      cssVariable: '--font-body',
      weights: [400, 700],
      fallbacks: [],
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Serif JP',
      cssVariable: '--font-jp-serif',
      weights: [500],
      subsets: ['japanese'],
      fallbacks: [],
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Sans JP',
      cssVariable: '--font-jp-sans',
      weights: [400, 700],
      subsets: ['japanese'],
      fallbacks: [],
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Naskh Arabic',
      cssVariable: '--font-ar',
      weights: [400, 500, 700],
      subsets: ['arabic'],
      fallbacks: [],
    },
  ],
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/og-card'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          it: 'it',
          fr: 'fr',
          ja: 'ja',
          ar: 'ar',
        },
      },
    }),
  ],
});
