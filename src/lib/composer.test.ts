import { describe, expect, it } from 'vitest';
import { messages } from '../i18n/messages';
import { composeInquiry, emptyState } from './composer';

const en = messages.en;

describe('composeInquiry', () => {
  it('fills every blank with an ellipsis when nothing is entered', () => {
    const result = composeInquiry(en, emptyState);

    expect(result.sentence).toBe(
      'Hello, my name is …. I run a … & I need help with …. You can email me at ….',
    );
    expect(result.complete).toBe(false);
    expect(result.sendLabel).toBe(en.sendAny);
  });

  it('subjects the mail with only the parts that are filled in', () => {
    expect(composeInquiry(en, emptyState).subject).toBe('Project inquiry');
    expect(composeInquiry(en, { ...emptyState, name: 'Ada' }).subject).toBe(
      'Project inquiry · Ada',
    );
    expect(composeInquiry(en, { ...emptyState, name: 'Ada', need: 'AI automation' }).subject).toBe(
      'Project inquiry · Ada · AI automation',
    );
  });

  it('switches the send label once name, business type and need are all set', () => {
    const partial = composeInquiry(en, { ...emptyState, name: 'Ada', org: 'startup' });
    expect(partial.complete).toBe(false);
    expect(partial.sendLabel).toBe(en.sendAny);

    const full = composeInquiry(en, {
      ...emptyState,
      name: 'Ada',
      org: 'startup',
      need: 'custom software',
    });
    expect(full.complete).toBe(true);
    expect(full.sendLabel).toBe(en.sendDone);
  });

  it('appends the free-text message under its label and signs off', () => {
    const withMessage = composeInquiry(en, {
      ...emptyState,
      message: 'Two clinics, one calendar.',
    });
    expect(withMessage.body).toContain(`\n\n${en.helpLabel}\nTwo clinics, one calendar.`);
    expect(withMessage.body.endsWith('\n\n— modernsoftware.works')).toBe(true);

    const withoutMessage = composeInquiry(en, emptyState);
    expect(withoutMessage.body).not.toContain(en.helpLabel);
    expect(withoutMessage.body.endsWith('\n\n— modernsoftware.works')).toBe(true);
  });

  it('trims whitespace-only input rather than writing it into the sentence', () => {
    const result = composeInquiry(en, { ...emptyState, name: '   ', message: '  \n ' });
    expect(result.sentence).toContain('my name is ….');
    expect(result.body).not.toContain(en.helpLabel);
    expect(result.complete).toBe(false);
  });

  it('produces a mailto whose encoded body round-trips', () => {
    const state = {
      name: 'Ada Lovelace',
      org: 'clinic or salon',
      need: 'scheduling software',
      email: 'ada@example.com',
      message: 'We double-book every Friday.',
    };
    const result = composeInquiry(en, state);
    const params = new URL(result.mailto).searchParams;

    expect(result.mailto.startsWith('mailto:hello@modernsoftware.works?')).toBe(true);
    expect(params.get('subject')).toBe(result.subject);
    expect(params.get('body')).toBe(result.body);
  });

  it('composes in the locale it is given', () => {
    const ja = composeInquiry(messages.ja, { ...emptyState, name: '田中' });
    expect(ja.sentence.startsWith('こんにちは、田中 と申します。')).toBe(true);
    expect(ja.subject).toBe('プロジェクトのご相談 · 田中');
  });
});
