import { type ComposerCopy, type ComposerState, composeInquiry, emptyState } from '../lib/composer';

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function getDisplayValue(field: FormControl): string {
  return field.value ? field.value : (field.getAttribute('placeholder') ?? '');
}

function updateSlotText(slot: HTMLElement | null, field: FormControl, hasValue: boolean): void {
  if (!slot) {
    return;
  }
  slot.classList.toggle('is-filled', hasValue);
  const sizer = slot.querySelector<HTMLElement>('.sizer');
  if (sizer) {
    sizer.textContent = getDisplayValue(field);
  }
}

function syncFieldPresentation(field: FormControl, hasValue: boolean): void {
  if (field instanceof HTMLSelectElement) {
    field.classList.toggle('is-set', hasValue);
  }
  updateSlotText(field.closest<HTMLElement>('.slot'), field, hasValue);
}

function bindComposerField(
  field: FormControl,
  state: ComposerState,
  onStateChange: () => void,
): void {
  const key = field.dataset.field as keyof ComposerState | undefined;
  if (!key || !(key in state)) {
    return;
  }

  const syncField = () => {
    state[key] = field.value;
    syncFieldPresentation(field, field.value.trim() !== '');
    onStateChange();
  };

  if (field.value) {
    syncField();
  }

  field.addEventListener('input', syncField);
  field.addEventListener('change', syncField);
}

function applyComposedInquiry(root: HTMLElement, copy: ComposerCopy, state: ComposerState): void {
  const composed = composeInquiry(copy, state);
  const send = root.querySelector<HTMLAnchorElement>('[data-send]');
  if (send) {
    send.href = composed.mailto;
    send.textContent = composed.sendLabel;
    send.classList.toggle('is-complete', composed.complete);
  }
  const sendWa = root.querySelector<HTMLAnchorElement>('[data-send-wa]');
  if (sendWa) {
    sendWa.href = composed.whatsapp;
  }
  const count = root.querySelector<HTMLElement>('[data-count]');
  if (count) {
    count.textContent = String(state.message.length).padStart(2, '0');
  }
}

function mountComposerRoot(root: HTMLElement): void {
  const raw = root.dataset.composer;
  if (!raw) {
    return;
  }

  const copy = JSON.parse(raw) as ComposerCopy;
  const state: ComposerState = { ...emptyState };
  const update = () => applyComposedInquiry(root, copy, state);

  for (const field of root.querySelectorAll<FormControl>('[data-field]')) {
    bindComposerField(field, state, update);
  }

  update();
}

/** Wires the contact composer's inputs to the pure builder in lib/composer.ts. */
export function mountComposer(): void {
  for (const root of document.querySelectorAll<HTMLElement>('[data-composer]')) {
    mountComposerRoot(root);
  }
}
