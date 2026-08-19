export type Messages = {
  htmlLang: 'en' | 'it' | 'ja';
  title: string;
  description: string;
  brandName: string;
  brandAria: string;
  headline: string;
  deck: string;
  cta: string;
  ctaNote: string;
  langLabel: string;
  skip: string;
  langSpoken: string;
  mailSubject: string;
  mailBody: string;
  notFoundTitle: string;
  notFoundHeadline: string;
  notFoundHome: string;
};

export function mailHref(messages: Pick<Messages, 'mailSubject' | 'mailBody'>): string {
  return `mailto:hello@modernsoftware.works?subject=${encodeURIComponent(messages.mailSubject)}&body=${encodeURIComponent(messages.mailBody)}`;
}
