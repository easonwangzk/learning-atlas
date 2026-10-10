export interface StageMetrics {
  viewportWidth: number;
  viewportHeight: number;
  cardWidth: number;
  cardHeight: number;
  gap: number;
}

export interface PerspectiveLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function clampIndex(value: number, count: number): number {
  if (!Number.isInteger(count) || count < 1) throw new RangeError("Stage count must be positive");
  return Math.max(0, Math.min(count - 1, Math.round(value)));
}

export function stageCardMetrics(viewportWidth: number, viewportHeight: number): StageMetrics {
  if (!Number.isFinite(viewportWidth) || !Number.isFinite(viewportHeight) || viewportWidth <= 0 || viewportHeight <= 0) {
    throw new RangeError("Invalid stage viewport");
  }
  const desktop = viewportWidth >= 720;
  const cardWidth = desktop
    ? Math.min(720, Math.max(520, viewportWidth * 0.47))
    : Math.min(350, Math.max(280, viewportWidth - 40));
  const cardHeight = desktop
    ? Math.min(430, Math.max(240, viewportHeight * 0.435))
    : Math.min(210, Math.max(176, cardWidth * 0.57));
  return {
    viewportWidth,
    viewportHeight,
    cardWidth,
    cardHeight,
    gap: desktop ? Math.max(36, viewportWidth * 0.075) : 26
  };
}

export function targetOffsetForIndex(index: number, count: number, metrics: StageMetrics): number {
  const safeIndex = clampIndex(index, count);
  return safeIndex * (metrics.cardWidth + metrics.gap);
}

export function indexFromOffset(offset: number, count: number, metrics: StageMetrics): number {
  if (!Number.isFinite(offset)) throw new RangeError("Invalid stage offset");
  return clampIndex(offset / (metrics.cardWidth + metrics.gap), count);
}

export function normalizedWheelDelta(event: Pick<WheelEvent, "deltaX" | "deltaY" | "deltaMode">): number {
  const unit = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? 640 : 1;
  const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  return raw * unit;
}

export function perspectiveGrid(width: number, height: number, columns = 13, rows = 8): PerspectiveLine[] {
  if (width <= 0 || height <= 0 || columns < 2 || rows < 2) throw new RangeError("Invalid perspective grid");
  const horizon = height * 0.48;
  const bottom = height * 0.98;
  const center = width * 0.5;
  const spread = width * 0.72;
  const lines: PerspectiveLine[] = [];
  for (let column = 0; column < columns; column += 1) {
    const t = column / (columns - 1) - 0.5;
    lines.push({ x1: center + t * width * 0.08, y1: horizon, x2: center + t * spread, y2: bottom });
  }
  for (let row = 1; row <= rows; row += 1) {
    const t = row / rows;
    const y = horizon + (bottom - horizon) * t * t;
    const half = spread * 0.5 * t;
    lines.push({ x1: center - half, y1: y, x2: center + half, y2: y });
  }
  return lines;
}
