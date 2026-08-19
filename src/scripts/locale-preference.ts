import { isLocale } from '../i18n/locales';

const LOCALE_STORAGE_KEY = 'msw-lang';

export function persistLocaleOnSwitch(): void {
  document.querySelectorAll('[data-lang]').forEach((el) => {
    el.addEventListener('click', () => {
      const lang = el.getAttribute('data-lang');
      if (lang && isLocale(lang)) {
        try {
          localStorage.setItem(LOCALE_STORAGE_KEY, lang);
        } catch {
          // Private mode or blocked storage.
        }
      }
    });
  });
}
