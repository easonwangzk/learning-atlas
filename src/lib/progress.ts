export type ProgressState = Record<string, true>;

export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return {};
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new TypeError("Expected a lesson completion map");
  }
  return Object.fromEntries(
    Object.entries(parsed).filter(([id, value]) => /^[a-z-]+\/[a-z-]+$/.test(id) && value === true)
  ) as ProgressState;
}

export function countCompleted(ids: string[], progress: ProgressState): number {
  return ids.filter((id) => progress[id]).length;
}
