type LessonReference = {
  id: string;
  data: { track: string; slug?: string; locale?: "zh" | "en" };
};

export function lessonSlug(lesson: LessonReference): string {
  const fileStem = lesson.id.split("/").pop() ?? lesson.id;
  return lesson.data.slug ?? fileStem.replace(`${lesson.data.track}-`, "");
}

export function lessonRoute(lesson: LessonReference, locale = lesson.data.locale ?? "zh"): string {
  const prefix = locale === "en" ? "/en" : "";
  return `${prefix}/learn/${lesson.data.track}/${lessonSlug(lesson)}/`;
}

export function lessonProgressId(lesson: LessonReference): string {
  return `${lesson.data.track}/${lessonSlug(lesson)}`;
}

export function lessonLocale(lesson: LessonReference): "zh" | "en" {
  return lesson.data.locale ?? "zh";
}
