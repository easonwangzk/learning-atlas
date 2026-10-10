type LessonReference = {
  id: string;
  data: { track: string; slug?: string };
};

export function lessonSlug(lesson: LessonReference): string {
  return lesson.data.slug ?? lesson.id.replace(`${lesson.data.track}-`, "");
}

export function lessonRoute(lesson: LessonReference): string {
  return `/learn/${lesson.data.track}/${lessonSlug(lesson)}/`;
}

export function lessonProgressId(lesson: LessonReference): string {
  return `${lesson.data.track}/${lessonSlug(lesson)}`;
}
