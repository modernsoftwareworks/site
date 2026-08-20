const MAX_DEGREES = 26;

/** Parallax tilt on the hero monogram, matching the design's pointer response. */
export function mountTilt(): void {
  const stages = document.querySelectorAll<HTMLElement>('[data-tilt]');

  for (const stage of stages) {
    const target = stage.querySelector<HTMLElement>('[data-tilt-target]');
    if (!target) {
      continue;
    }

    stage.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') {
        return;
      }
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      target.style.transform = `rotateY(${x * MAX_DEGREES}deg) rotateX(${-y * MAX_DEGREES}deg) scale(1.06)`;
    });

    stage.addEventListener('pointerleave', () => {
      target.style.transform = '';
    });
  }
}
