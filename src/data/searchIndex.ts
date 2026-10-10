import { getCollection } from "astro:content";
import { withBase } from "@/lib/paths";
import { lessonLocale, lessonRoute } from "@/lib/lessons";
import { getProjects } from "@/data/projects";
import { getResources } from "@/data/resources";
import { certificationLabel, ui, type Locale } from "@/i18n";
import { localizePath } from "@/i18n";

export async function getSearchIndex(locale: Locale = "zh") {
  const lessons = (await getCollection("lessons")).filter((lesson) => lessonLocale(lesson) === locale);
  const projects = getProjects(locale);
  const resources = getResources(locale);
  const t = ui[locale];
  return [
    ...lessons.sort((a, b) => a.data.track.localeCompare(b.data.track) || a.data.order - b.data.order)
      .map((lesson) => ({
        kind: t.courseKind,
        title: lesson.data.title,
        summary: lesson.data.summary,
        href: withBase(lessonRoute(lesson, locale)),
        tags: [lesson.data.track, certificationLabel(lesson.data.cert, locale), ...lesson.data.tags],
        searchText: `${lesson.data.title} ${lesson.data.summary} ${lesson.body ?? ""}`
      })),
    ...projects.map((project) => ({
      kind: t.projectKind,
      title: project.title,
      summary: project.summary,
      href: withBase(localizePath(`/projects/${project.slug}/`, locale)),
      tags: [...project.topics],
      searchText: `${project.title} ${project.summary} ${project.learn.join(" ")}`
    })),
    ...resources.map((resource) => ({
      kind: t.resourceKind,
      title: resource.title,
      summary: resource.description,
      href: resource.url,
      tags: [resource.topic, resource.certification, resource.provider],
      searchText: `${resource.title} ${resource.description} ${resource.type}`
    }))
  ];
}
