import { getCollection } from "astro:content";
import { withBase } from "@/lib/paths";
import { lessonRoute } from "@/lib/lessons";
import { projects } from "@/data/projects";
import { resources } from "@/data/resources";

export async function getSearchIndex() {
  const lessons = await getCollection("lessons");
  return [
    ...lessons.sort((a, b) => a.data.track.localeCompare(b.data.track) || a.data.order - b.data.order)
      .map((lesson) => ({
        kind: "课程",
        title: lesson.data.title,
        summary: lesson.data.summary,
        href: withBase(lessonRoute(lesson)),
        tags: [lesson.data.track, lesson.data.cert, ...lesson.data.tags],
        searchText: `${lesson.data.title} ${lesson.data.summary} ${lesson.body ?? ""}`
      })),
    ...projects.map((project) => ({
      kind: "项目",
      title: project.title,
      summary: project.summary,
      href: withBase(`/projects/${project.slug}/`),
      tags: [...project.topics],
      searchText: `${project.title} ${project.summary} ${project.learn.join(" ")}`
    })),
    ...resources.map((resource) => ({
      kind: "资源",
      title: resource.title,
      summary: resource.description,
      href: resource.url,
      tags: [resource.topic, resource.certification, resource.provider],
      searchText: `${resource.title} ${resource.description} ${resource.type}`
    }))
  ];
}
