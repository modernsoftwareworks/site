import type { Locale } from '../locales';
import type { Messages } from '../schema';
import { ar } from './ar';
import { en } from './en';
import { fr } from './fr';
import { it } from './it';
import { ja } from './ja';

export const messages: Record<Locale, Messages> = {
  en,
  it,
  fr,
  ja,
  ar,
};
