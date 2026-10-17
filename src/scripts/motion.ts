import { computeMagneticOffset } from '../lib/fractal';

function canTrackMouse(
  event: PointerEvent,
  finePointer: MediaQueryList,
  reducedMotion?: MediaQueryList,
): boolean {
  if (reducedMotion?.matches) {
    return false;
  }
  return finePointer.matches && event.pointerType === 'mouse';
}

function bindMagneticElement(
  el: HTMLElement,
  reducedMotion: MediaQueryList,
  finePointer: MediaQueryList,
): void {
  const strength = Number(el.dataset.magnetic) || 0.26;

  el.addEventListener('pointermove', (event) => {
    if (!canTrackMouse(event, finePointer, reducedMotion)) {
      return;
    }
    const { x, y } = computeMagneticOffset(
      event.clientX,
      event.clientY,
      el.getBoundingClientRect(),
      strength,
      14,
    );
    el.style.setProperty('--mag-x', `${x}px`);
    el.style.setProperty('--mag-y', `${y}px`);
  });

  el.addEventListener('pointerleave', () => {
    el.style.setProperty('--mag-x', '0px');
    el.style.setProperty('--mag-y', '0px');
  });
}

function bindSpotlightElement(card: HTMLElement, finePointer: MediaQueryList): void {
  card.addEventListener(
    'pointermove',
    (event) => {
      if (!canTrackMouse(event, finePointer)) {
        return;
      }
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${(event.clientX - rect.left).toFixed(1)}px`);
      card.style.setProperty('--my', `${(event.clientY - rect.top).toFixed(1)}px`);
    },
    { passive: true },
  );
}

function buildSectionLinkMap(
  navLinks: NodeListOf<HTMLAnchorElement>,
): Map<string, HTMLAnchorElement> {
  const map = new Map<string, HTMLAnchorElement>();
  for (const link of navLinks) {
    const hashIndex = link.href.indexOf('#');
    if (hashIndex !== -1) {
      map.set(link.href.slice(hashIndex + 1), link);
    }
  }
  return map;
}

function highlightActiveSection(
  activeId: string,
  linkByHash: Map<string, HTMLAnchorElement>,
): void {
  for (const [id, link] of linkByHash.entries()) {
    link.classList.toggle('is-active', id === activeId);
  }
}

function observeTargetIds(observer: IntersectionObserver, ids: Iterable<string>): void {
  for (const id of ids) {
    const target = document.getElementById(id);
    if (target) {
      observer.observe(target);
    }
  }
}

function mountNavObserver(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav .section-link');
  if (navLinks.length === 0 || !('IntersectionObserver' in window)) {
    return;
  }

  const linkByHash = buildSectionLinkMap(navLinks);
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          highlightActiveSection(entry.target.id, linkByHash);
        }
      }
    },
    { rootMargin: '-35% 0px -50% 0px', threshold: 0 },
  );

  observeTargetIds(observer, linkByHash.keys());
}

export function mountMotion(): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  for (const el of document.querySelectorAll<HTMLElement>('[data-magnetic]')) {
    bindMagneticElement(el, reducedMotion, finePointer);
  }

  for (const card of document.querySelectorAll<HTMLElement>('[data-spotlight]')) {
    bindSpotlightElement(card, finePointer);
  }

  mountNavObserver();
}
