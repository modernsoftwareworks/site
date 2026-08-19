import type { Locale } from '../locales';
import type { Messages } from '../schema';
import { en } from './en';
import { it } from './it';
import { ja } from './ja';

export const messages: Record<Locale, Messages> = {
  en,
  it,
  ja,
};
