import { describe, expect, it } from 'vitest';
import { defaultLocale, localePath, locales } from './locales';
import { messages } from './messages';
import { mailHref } from './schema';

describe('messages', () => {
  it('keeps the same keys in every locale', () => {
    const keys = Object.keys(messages.en).sort();

    for (const locale of locales) {
      expect(Object.keys(messages[locale]).sort()).toEqual(keys);
    }
  });

  it('gives every locale a title, description, and headline', () => {
    for (const locale of locales) {
      const copy = messages[locale];
      expect(copy.title.length).toBeGreaterThan(0);
      expect(copy.description.length).toBeGreaterThan(0);
      expect(copy.headline.length).toBeGreaterThan(0);
    }
  });
});

describe('localePath', () => {
  it('leaves the default locale unprefixed', () => {
    expect(localePath(defaultLocale)).toBe('/');
    expect(localePath('en', '/work')).toBe('/work/');
  });

  it('prefixes Italian and Japanese', () => {
    expect(localePath('it')).toBe('/it/');
    expect(localePath('ja', '/work')).toBe('/ja/work/');
  });
});

describe('mailHref', () => {
  it('builds a mailto to the studio inbox with encoded subject and body', () => {
    const href = mailHref(messages.en);
    expect(href.startsWith('mailto:hello@modernsoftware.works?')).toBe(true);
    expect(href).toContain(encodeURIComponent(messages.en.mailSubject));
    expect(href).toContain(encodeURIComponent(messages.en.mailBody));
  });
});
