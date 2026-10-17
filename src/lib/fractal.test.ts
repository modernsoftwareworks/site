import { describe, expect, it } from 'vitest';
import {
  clamp,
  computeMagneticOffset,
  computeScrollProgress,
  computeTiltAngles,
  ETHER_PALETTE,
  lerp,
} from './fractal';

describe('fractal math primitives', () => {
  it('exposes normalized RGB vectors for the Ether palette', () => {
    for (const channel of Object.values(ETHER_PALETTE)) {
      expect(channel).toHaveLength(3);
      for (const component of channel) {
        expect(component).toBeGreaterThanOrEqual(0);
        expect(component).toBeLessThanOrEqual(1);
      }
    }
  });

  it('clamps numeric values and guards against NaN', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
    expect(clamp(-3, 0, 1)).toBe(0);
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(Number.NaN, 0, 1)).toBe(0);
  });

  it('interpolates linearly with clamped factor', () => {
    expect(lerp(10, 20, 0.5)).toBe(15);
    expect(lerp(10, 20, -1)).toBe(10);
    expect(lerp(10, 20, 2)).toBe(20);
  });

  it('computes normalized scroll progress safely', () => {
    expect(computeScrollProgress(0, 2000, 1000)).toBe(0);
    expect(computeScrollProgress(500, 2000, 1000)).toBe(0.5);
    expect(computeScrollProgress(1500, 2000, 1000)).toBe(1);
    expect(computeScrollProgress(100, 800, 1000)).toBe(0);
  });

  it('computes counter-rotating 3D tilt angles for monogram and fractal orbits', () => {
    const bounds = { left: 100, top: 100, width: 200, height: 200 };
    const center = computeTiltAngles(200, 200, bounds, 24);
    expect(center).toEqual({ rotateX: 0, rotateY: 0, orbitX: 0, orbitY: 0 });

    const topRight = computeTiltAngles(300, 100, bounds, 24);
    expect(topRight.rotateY).toBe(12);
    expect(topRight.rotateX).toBe(12);
    expect(topRight.orbitY).toBe(-7.8);
    expect(topRight.orbitX).toBe(-7.8);

    expect(computeTiltAngles(50, 50, { left: 0, top: 0, width: 0, height: 0 })).toEqual({
      rotateX: 0,
      rotateY: 0,
      orbitX: 0,
      orbitY: 0,
    });
  });

  it('computes bounded magnetic pull offsets', () => {
    const bounds = { left: 0, top: 0, width: 100, height: 40 };
    expect(computeMagneticOffset(50, 20, bounds, 0.25, 14)).toEqual({ x: 0, y: 0 });
    expect(computeMagneticOffset(90, 30, bounds, 0.25, 14)).toEqual({ x: 10, y: 2.5 });
    expect(computeMagneticOffset(500, 500, bounds, 0.5, 12)).toEqual({ x: 12, y: 12 });
  });
});
