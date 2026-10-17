type RgbVector = readonly [number, number, number];

export const ETHER_PALETTE = {
  paper: [0.98, 0.984, 0.992] as RgbVector,
  wash: [0.835, 0.886, 0.961] as RgbVector,
  accent: [0.353, 0.498, 0.722] as RgbVector,
  deep: [0.184, 0.294, 0.471] as RgbVector,
} as const;

type BoxBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type TiltAngles = {
  rotateX: number;
  rotateY: number;
  orbitX: number;
  orbitY: number;
};

type MagneticOffset = {
  x: number;
  y: number;
};

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, amount: number): number {
  const t = clamp(amount, 0, 1);
  return start + (end - start) * t;
}

export function computeScrollProgress(
  scrollY: number,
  scrollHeight: number,
  viewportHeight: number,
): number {
  const scrollable = scrollHeight - viewportHeight;
  if (scrollable <= 0) {
    return 0;
  }
  return clamp(scrollY / scrollable, 0, 1);
}

export function computeTiltAngles(
  clientX: number,
  clientY: number,
  bounds: BoxBounds,
  maxDegrees = 24,
): TiltAngles {
  if (bounds.width <= 0 || bounds.height <= 0) {
    return { rotateX: 0, rotateY: 0, orbitX: 0, orbitY: 0 };
  }
  const nx = clamp((clientX - bounds.left) / bounds.width, 0, 1) - 0.5;
  const ny = clamp((clientY - bounds.top) / bounds.height, 0, 1) - 0.5;

  const rotateY = Number((nx * maxDegrees).toFixed(2));
  const rotateX = Number((-ny * maxDegrees).toFixed(2));
  const orbitY = Number((-nx * maxDegrees * 0.65).toFixed(2));
  const orbitX = Number((ny * maxDegrees * 0.65).toFixed(2));

  return { rotateX, rotateY, orbitX, orbitY };
}

export function computeMagneticOffset(
  clientX: number,
  clientY: number,
  bounds: BoxBounds,
  strength = 0.25,
  maxPixels = 14,
): MagneticOffset {
  if (bounds.width <= 0 || bounds.height <= 0) {
    return { x: 0, y: 0 };
  }
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const rawX = (clientX - centerX) * strength;
  const rawY = (clientY - centerY) * strength;

  return {
    x: Number(clamp(rawX, -maxPixels, maxPixels).toFixed(2)),
    y: Number(clamp(rawY, -maxPixels, maxPixels).toFixed(2)),
  };
}
