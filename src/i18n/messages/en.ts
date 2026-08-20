import type { Messages } from '../schema';

export const en = {
  htmlLang: 'en',

  title: 'Modern Software Works — Scheduling, AI Automation & Custom Software',
  description:
    'Scheduling software, business digitization, software modernization, AI automation consulting and custom branded software, including WhatsApp-based booking. Localized in English, Italian, French, Japanese and Arabic.',
  overline: 'Modern solutions for modern problems',

  brandName: 'Modern Software Works',
  brandAria: 'Modern Software Works',
  langLabel: 'Language',
  skip: 'Skip to content',

  navServices: 'Specialties',
  navMethod: 'Method',
  navWhy: 'Why us',
  navIntl: 'International',
  navEmail: 'Email us ↗',

  h1a: 'Manual work is',
  h1b: 'a choice.',
  lede: 'The phone tag, the spreadsheets, the double entry. None of it has to exist. We build scheduling tools, AI automations and custom software that make businesses run themselves.',
  cta1: 'Email us your requirement',
  cta2: 'Our specialties ↓',

  servicesH2: 'What we specialize in',
  servicesLede:
    'Six ways we take manual work off your plate. Every engagement starts with the same free consultation.',
  services: [
    {
      title: 'Scheduling software',
      detail:
        'Online booking, automatic reminders, staff calendars that manage themselves. Your front desk stops being a switchboard and no-shows stop eating your margin.',
      audience: 'Clinics, salons & studios',
    },
    {
      title: 'Digitizing businesses',
      detail:
        'Paper forms, whiteboards and filing cabinets become clean digital workflows your whole team can use, on any device.',
      audience: 'Trades & local teams',
    },
    {
      title: 'Software modernization',
      detail:
        'Legacy systems rebuilt on a modern stack: the same business logic your team relies on, minus the crashes, workarounds and aging servers.',
      audience: 'Established companies',
    },
    {
      title: 'AI automation consulting',
      detail:
        "An honest audit of your day-to-day: which manual tasks AI can genuinely take over, which it can't, and what each is worth. In writing, in plain language.",
      audience: 'Busy owners',
    },
    {
      title: 'Custom & branded software',
      detail:
        'Designed around your exact problem and carrying your brand, inside and out. You own it outright: code, data and accounts.',
      audience: 'Startups & growing companies',
    },
    {
      title: 'Software where your users are',
      detail:
        'Booking over WhatsApp, ordering in chat, mobile-first tools. We build on the platforms your customers already use, not another app to download.',
      audience: 'Customer-facing businesses',
    },
  ],

  methodH2a: 'How a project runs,',
  methodH2b: 'start to finish.',
  methodLede:
    "You'll always know what we're doing, why, and what it costs, before we write a line of code.",
  steps: [
    {
      label: 'STEP 1',
      title: 'Consultation.',
      detail: "Thirty minutes on what's slowing you down. Free, plain English, no obligation.",
    },
    {
      label: 'STEP 2',
      title: 'Audit.',
      detail:
        'We map your manual work and hand you a roadmap with honest costs and payoffs, even if the answer is “you don’t need us.”',
    },
    {
      label: 'STEP 3',
      title: 'Build.',
      detail: 'Short cycles, working software every week. No big-reveal risk.',
    },
    {
      label: 'STEP 4',
      title: 'Support.',
      detail: 'Training, quick fixes and steady improvements. We stay in your corner.',
    },
  ],

  whyH2: 'Why businesses choose us',
  reasons: [
    {
      title: 'Plain English, always',
      detail:
        "We explain everything in the language of your business, not ours. If you can't understand it, we haven't finished explaining it.",
    },
    {
      title: 'Fixed-scope quotes',
      detail:
        'You know the price and the timeline before we start. No surprise invoices, no creeping retainers.',
    },
    {
      title: 'You own everything',
      detail:
        'The software, the data, the accounts: all yours. No lock-in, no ransom pricing, ever.',
    },
  ],

  intlH2a: 'Software that speaks',
  intlH2b: 'your language.',
  intlLede:
    'We build internationalized, localized software (multi-language, multi-currency, RTL-ready) and work with founders and businesses across Europe, Japan and the Gulf. Write to us in your own language.',

  c1: 'Hello, my name is ',
  c2: '. I run a ',
  c3: ' & I need help with ',
  c4: '. You can email me at ',
  c5: '.',
  namePh: 'Name',
  emailPh: 'Email',
  orgPh: 'business type',
  needPh: 'what you need',
  helpLabel: 'I NEED HELP WITH:',
  msgPh: "Let's save something to talk about in person.",
  sendDone: "Send it — the email's already written ↗",
  sendAny: "Send anyway — we'll figure it out ↗",
  composerNote:
    'Opens your email app with the sentence written for you · We reply within one business day',
  contactStatus: 'Taking new projects for Q3 2026 · We reply within one business day',
  orgs: ['clinic or salon', 'trades business', 'startup', 'growing company', 'something else'],
  needs: [
    'scheduling software',
    'digitizing my business',
    'modernizing old software',
    'AI automation',
    'custom software',
    'booking on WhatsApp',
  ],

  inquirySubject: 'Project inquiry',

  footerTag: '© 2026 · Modern solutions for modern problems',

  notFoundTitle: 'Page not found — Modern Software Works',
  notFoundHeadline: 'This page isn’t here.',
  notFoundHome: 'Back to Modern Software Works',
} as const satisfies Messages;
