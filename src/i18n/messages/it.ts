import type { Messages } from '../schema';

export const it = {
  htmlLang: 'it',
  title: 'Modern Software Works',
  description: 'Modern Software Works. Un piccolo studio che costruisce software fatto per durare.',
  brandName: 'Modern Software Works',
  brandAria: 'Modern Software Works',
  headline: 'Costruiamo il software che intendete lanciare',
  deck: 'Pochi incarichi. Dal primo schizzo a un prodotto che si usa, poi i sistemi che restano dopo il lancio.',
  cta: 'Ho un prodotto da costruire',
  ctaNote: 'hello@modernsoftware.works',
  langLabel: 'Lingua',
  skip: 'Vai alla mail',
  langSpoken: 'Italiano',
  mailSubject: 'Ho un prodotto da costruire',
  mailBody: 'Cosa volete costruire, per chi, e quando volete vederlo nel mondo.',
  notFoundTitle: 'Pagina non trovata — Modern Software Works',
  notFoundHeadline: 'Questa pagina non c’è.',
  notFoundHome: 'Torna a Modern Software Works',
} as const satisfies Messages;
