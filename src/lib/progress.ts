export type ProgressState = Record<string, true>;

export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return {};
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  return Object.fromEntries(
    Object.entries(parsed as Record<string, unknown>).filter(([, value]) => value === true)
  ) as ProgressState;
}

export function countCompleted(ids: string[], progress: ProgressState): number {
  return ids.filter((id) => progress[id]).length;
}
