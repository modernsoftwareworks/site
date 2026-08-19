import type { Messages } from '../schema';

export const ja = {
  htmlLang: 'ja',
  title: 'Modern Software Works',
  description: 'Modern Software Works. 長く使えるソフトウェアをつくる、小さなスタジオ。',
  brandName: 'Modern Software Works',
  brandAria: 'Modern Software Works',
  headline: 'つくろうとしているソフトウェアを、かたちにします',
  deck: '同時に少数のみ。最初のスケッチから使えるプロダクトまで。公開のあとも動く仕組みを残します。',
  cta: 'このプロダクトをつくってほしい',
  ctaNote: 'hello@modernsoftware.works',
  langLabel: '言語',
  skip: 'メールへ',
  langSpoken: '日本語',
  mailSubject: 'このプロダクトをつくってほしい',
  mailBody:
    'つくろうとしているもの、誰のためのものか、いつ世に出したいのかを、短く書いてください。',
  notFoundTitle: 'ページが見つかりません — Modern Software Works',
  notFoundHeadline: 'このページはありません。',
  notFoundHome: 'Modern Software Works へ戻る',
} as const satisfies Messages;
