import { computeTiltAngles } from '../lib/fractal';

/**
 * Interactive 3D parallax tilt + recursive fractal orbit counter-rotation on
 * the hero monogram stage.
 */
export function mountTilt(): void {
  const stages = document.querySelectorAll<HTMLElement>('[data-tilt]');

  for (const stage of stages) {
    const target = stage.querySelector<HTMLElement>('[data-tilt-target]');
    const orbits = stage.querySelector<HTMLElement>('[data-tilt-orbits]');
    if (!target) {
      continue;
    }

    stage.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') {
        return;
      }
      const bounds = stage.getBoundingClientRect();
      const { rotateX, rotateY, orbitX, orbitY } = computeTiltAngles(
        event.clientX,
        event.clientY,
        bounds,
        26,
      );
      target.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.06)`;
      if (orbits) {
        orbits.style.transform = `rotateY(${orbitY}deg) rotateX(${orbitX}deg) scale(1.03)`;
      }
    });

    stage.addEventListener('pointerleave', () => {
      target.style.transform = '';
      if (orbits) {
        orbits.style.transform = '';
      }
    });
  }
}
