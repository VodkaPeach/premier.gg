/** Returns [filledLen, gapLen] for an SVG circle stroke-dasharray given ratio 0..1 and radius. */
export function dashArray(ratio: number, radius: number): [number, number] {
  const c = 2 * Math.PI * radius;
  const filled = Math.max(0, Math.min(1, ratio)) * c;
  return [filled, c - filled];
}
