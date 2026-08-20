import { describe, expect, it } from 'vitest';
import { defaultLocale, isLocale, localeDir, localePath, locales } from './locales';
import { messages } from './messages';
import { mailHref } from './schema';

/** Recursive key shape, so nested service/step/reason objects are compared too. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(shape);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((key) => [key, shape((value as Record<string, unknown>)[key])]),
    );
  }
  return typeof value;
}

describe('messages', () => {
  it('keeps the same key shape in every locale', () => {
    const reference = shape(messages.en);

    for (const locale of locales) {
      expect(shape(messages[locale]), locale).toEqual(reference);
    }
  });

  it('declares its own locale as htmlLang', () => {
    for (const locale of locales) {
      expect(messages[locale].htmlLang).toBe(locale);
    }
  });

  it('fills every string the page renders', () => {
    for (const locale of locales) {
      const copy = messages[locale];
      const blank = Object.entries(copy)
        .filter(([, value]) => typeof value === 'string' && value.trim().length === 0)
        .map(([key]) => key);

      expect(blank, locale).toEqual([]);
    }
  });

  it('carries six services, four steps, three reasons and the composer options', () => {
    for (const locale of locales) {
      const copy = messages[locale];
      expect(copy.services, locale).toHaveLength(6);
      expect(copy.steps, locale).toHaveLength(4);
      expect(copy.reasons, locale).toHaveLength(3);
      expect(copy.orgs, locale).toHaveLength(5);
      expect(copy.needs, locale).toHaveLength(6);
    }
  });
});

describe('locales', () => {
  it('covers the five shipped languages', () => {
    expect([...locales]).toEqual(['en', 'it', 'fr', 'ja', 'ar']);
    expect(isLocale('fr')).toBe(true);
    expect(isLocale('de')).toBe(false);
  });

  it('marks Arabic as the only right-to-left locale', () => {
    const rtl = locales.filter((locale) => localeDir[locale] === 'rtl');
    expect(rtl).toEqual(['ar']);
  });
});

describe('localePath', () => {
  it('leaves the default locale unprefixed', () => {
    expect(localePath(defaultLocale)).toBe('/');
    expect(localePath('en', '/work')).toBe('/work/');
  });

  it('prefixes every other locale', () => {
    expect(localePath('it')).toBe('/it/');
    expect(localePath('fr')).toBe('/fr/');
    expect(localePath('ar')).toBe('/ar/');
    expect(localePath('ja', '/work')).toBe('/ja/work/');
  });
});

describe('mailHref', () => {
  it('returns a bare mailto when nothing is prefilled', () => {
    expect(mailHref()).toBe('mailto:hello@modernsoftware.works');
  });

  it('percent-encodes the subject, spaces included', () => {
    expect(mailHref('Project inquiry')).toBe(
      'mailto:hello@modernsoftware.works?subject=Project%20inquiry',
    );
  });

  it('carries a body alongside the subject', () => {
    const href = mailHref('Subject', 'Line one\nLine two');
    expect(href).toContain('subject=Subject');
    expect(href).toContain('body=Line%20one%0ALine%20two');
  });
});
