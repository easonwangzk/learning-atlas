import type { ProgressState } from "./progress";

export function nextLessonId(ids: readonly string[], progress: ProgressState): string | null {
  return ids.find((id) => progress[id] !== true) ?? null;
}
