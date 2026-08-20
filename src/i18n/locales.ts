export const locales = ['en', 'it', 'fr', 'ja', 'ar'] as const;

export type Locale = (typeof locales)[number];

export type Direction = 'ltr' | 'rtl';

export const defaultLocale: Locale = 'en';

export const localeOg: Record<Locale, string> = {
  en: 'en_US',
  it: 'it_IT',
  fr: 'fr_FR',
  ja: 'ja_JP',
  ar: 'ar_SA',
};

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  it: 'IT',
  fr: 'FR',
  ja: '日本語',
  ar: 'عربي',
};

export const localeDir: Record<Locale, Direction> = {
  en: 'ltr',
  it: 'ltr',
  fr: 'ltr',
  ja: 'ltr',
  ar: 'rtl',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localePath(locale: Locale, path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`;

  if (locale === defaultLocale) {
    return withSlash;
  }

  if (withSlash === '/') {
    return `/${locale}/`;
  }

  return `/${locale}${withSlash}`;
}
