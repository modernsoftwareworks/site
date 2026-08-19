export const locales = ['en', 'it', 'ja'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeOg: Record<Locale, string> = {
  en: 'en_US',
  it: 'it_IT',
  ja: 'ja_JP',
};

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  it: 'IT',
  ja: '日本語',
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
