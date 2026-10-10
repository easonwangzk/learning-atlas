export type SpringPosition = { x: number; y: number; vx: number; vy: number };

export function advanceSpring(state: SpringPosition, target: { x: number; y: number }, elapsed: number): SpringPosition {
  if (!Number.isFinite(elapsed) || elapsed < 0) throw new RangeError("Invalid animation timestep");
  const next = { ...state };
  let remaining = Math.min(elapsed, 1 / 30);
  while (remaining > 0) {
    const step = Math.min(remaining, 1 / 120);
    next.vx += ((target.x - next.x) * 400 - next.vx * 45) * step;
    next.vy += ((target.y - next.y) * 400 - next.vy * 45) * step;
    next.x += next.vx * step;
    next.y += next.vy * step;
    remaining -= step;
  }
  return next;
}

export function springSettled(state: SpringPosition, target: { x: number; y: number }): boolean {
  return Math.hypot(target.x - state.x, target.y - state.y) < 0.15 && Math.hypot(state.vx, state.vy) < 0.5;
}
