import { SITE } from '../lib/site';
import type { Locale } from './locales';

export type Service = {
  title: string;
  detail: string;
  audience: string;
};

export type Step = {
  label: string;
  title: string;
  detail: string;
};

export type Reason = {
  title: string;
  detail: string;
};

export type Messages = {
  htmlLang: Locale;

  title: string;
  description: string;
  overline: string;

  brandName: string;
  brandAria: string;
  langLabel: string;
  skip: string;

  navServices: string;
  navMethod: string;
  navWhy: string;
  navIntl: string;
  navEmail: string;

  h1a: string;
  h1b: string;
  lede: string;
  cta1: string;
  cta2: string;

  servicesH2: string;
  servicesLede: string;
  services: readonly [Service, Service, Service, Service, Service, Service];

  methodH2a: string;
  methodH2b: string;
  methodLede: string;
  steps: readonly [Step, Step, Step, Step];

  whyH2: string;
  reasons: readonly [Reason, Reason, Reason];

  intlH2a: string;
  intlH2b: string;
  intlLede: string;

  c1: string;
  c2: string;
  c3: string;
  c4: string;
  c5: string;
  namePh: string;
  emailPh: string;
  orgPh: string;
  needPh: string;
  helpLabel: string;
  msgPh: string;
  sendDone: string;
  sendAny: string;
  waSend: string;
  waChat: string;
  composerNote: string;
  contactStatus: string;
  orgs: readonly [string, string, string, string, string];
  needs: readonly [string, string, string, string, string, string];

  inquirySubject: string;

  footerTag: string;

  notFoundTitle: string;
  notFoundHeadline: string;
  notFoundHome: string;
};

/**
 * WhatsApp Click to Chat. `wa.me/<username>` resolves as `type=username` and
 * carries `text` through intact — verified against the live endpoint, including
 * newlines and non-ASCII. A phone number would go in the same position, digits
 * only: dashes resolve to `not_found`.
 */
export function waHref(text?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  if (!text) {
    return base;
  }
  const params = new URLSearchParams({ text });
  return `${base}?${params.toString().replace(/\+/g, '%20')}`;
}

export function mailHref(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) {
    params.set('subject', subject);
  }
  if (body) {
    params.set('body', body);
  }
  const query = params.toString().replace(/\+/g, '%20');
  return query ? `mailto:${SITE.email}?${query}` : `mailto:${SITE.email}`;
}
