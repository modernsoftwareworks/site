import type { Messages } from '../schema';

export const en = {
  htmlLang: 'en',
  title: 'Modern Software Works',
  description: 'Modern Software Works. A small studio that builds software meant to last.',
  brandName: 'Modern Software Works',
  brandAria: 'Modern Software Works',
  headline: 'We build the software you intend to ship',
  deck: 'Few commissions. From first sketch to a product people use, then systems that keep it running.',
  cta: 'I have a product to build',
  ctaNote: 'hello@modernsoftware.works',
  langLabel: 'Language',
  skip: 'Skip to mail',
  langSpoken: 'English',
  mailSubject: 'I have a product to build',
  mailBody: 'What you want to build, who it is for, and when you want it in the world.',
  notFoundTitle: 'Page not found — Modern Software Works',
  notFoundHeadline: 'This page isn’t here.',
  notFoundHome: 'Back to Modern Software Works',
} as const satisfies Messages;
