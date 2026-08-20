import { type ComposerCopy, type ComposerState, composeInquiry, emptyState } from '../lib/composer';

/** Wires the contact composer's inputs to the pure builder in lib/composer.ts. */
export function mountComposer(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-composer]');

  for (const root of roots) {
    const raw = root.dataset.composer;
    const send = root.querySelector<HTMLAnchorElement>('[data-send]');
    const count = root.querySelector<HTMLElement>('[data-count]');
    if (!raw || !send || !count) {
      continue;
    }

    const copy = JSON.parse(raw) as ComposerCopy;
    const state: ComposerState = { ...emptyState };
    const fields = root.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >('[data-field]');

    const update = () => {
      const composed = composeInquiry(copy, state);
      send.href = composed.mailto;
      send.textContent = composed.sendLabel;
      count.textContent = String(state.message.length).padStart(2, '0');
    };

    for (const field of fields) {
      const key = field.dataset.field as keyof ComposerState | undefined;
      if (!key || !(key in state)) {
        continue;
      }

      const sizer = field.parentElement?.querySelector<HTMLElement>('.sizer');

      field.addEventListener('input', () => {
        state[key] = field.value;
        if (field instanceof HTMLSelectElement) {
          field.classList.toggle('is-set', field.value !== '');
        }
        if (sizer) {
          sizer.textContent = field.value || field.getAttribute('placeholder') || sizer.textContent;
        }
        update();
      });
    }
  }
}
