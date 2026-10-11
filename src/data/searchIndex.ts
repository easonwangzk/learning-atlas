import { getCollection } from "astro:content";
import { withBase } from "@/lib/paths";
import { lessonLocale, lessonRoute } from "@/lib/lessons";
import { getProjects } from "@/data/projects";
import { getResources } from "@/data/resources";
import { labs, labText } from "@/data/labs";
import { certifications, certText } from "@/data/certifications";
import { noteEntries } from "@/data/notes";
import { primaryNavigation, localizeNavPath } from "@/data/navigation";
import { certificationLabel, ui, type Locale } from "@/i18n";
import { localizePath } from "@/i18n";

export async function getSearchIndex(locale: Locale = "zh") {
  const lessons = (await getCollection("lessons")).filter((lesson) => lessonLocale(lesson) === locale);
  const projects = getProjects(locale);
  const resources = getResources(locale);
  const t = ui[locale];
  return [
    ...primaryNavigation.map((entry) => ({ kind: locale === "en" ? "Section" : "栏目", title: entry.label[locale], summary: entry.purpose[locale], href: withBase(localizeNavPath(entry.path, locale)), tags: [entry.key], searchText: `${entry.label[locale]} ${entry.purpose[locale]} ${entry.children.map((child) => child.label[locale]).join(" ")}` })),
    {
      kind: t.projectKind,
      title: locale === "en" ? "Interactive project showcase" : "互动作品展台",
      summary: locale === "en" ? "Browse public projects in the immersive gallery under Projects." : "在项目栏目下，通过互动作品舞台浏览公开案例。",
      href: withBase(localizePath("/projects/showcase/", locale)),
      tags: ["Projects", "showcase"],
      searchText: locale === "en" ? "project showcase gallery portfolio" : "项目 作品 展台 画廊"
    },
    ...lessons.sort((a, b) => a.data.track.localeCompare(b.data.track) || a.data.order - b.data.order).map((lesson) => ({ kind: t.courseKind, title: lesson.data.title, summary: lesson.data.summary, href: withBase(lessonRoute(lesson, locale)), tags: [lesson.data.track, certificationLabel(lesson.data.cert, locale), ...lesson.data.tags], searchText: `${lesson.data.title} ${lesson.data.summary} ${lesson.body ?? ""}` })),
    ...certifications.map((cert) => { const text = certText(cert, locale); return { kind: t.certKind, title: text.title, summary: text.intro, href: withBase(localizePath(`/certifications/${cert.slug}/`, locale)), tags: [cert.code], searchText: `${text.title} ${text.intro} ${text.domains.map((domain) => `${domain.name} ${domain.gaps}`).join(" ")}` }; }),
    ...labs.map((lab) => { const text = labText(lab, locale); return { kind: t.labKind, title: text.title, summary: text.summary, href: withBase(localizePath(`/labs/${lab.slug}/`, locale)), tags: [lab.track, lab.kind], searchText: `${text.title} ${text.summary} ${text.source} ${text.limitation}` }; }),
    ...noteEntries(locale).map((note) => ({ kind: t.noteKind, title: note.title, summary: note.summary, href: `${withBase(localizePath("/notes/", locale))}${note.href.includes("#") ? `#${note.href.split("#")[1]}` : ""}`, tags: [note.kind], searchText: `${note.title} ${note.summary}` })),
    ...projects.map((project) => ({ kind: t.projectKind, title: project.title, summary: project.summary, href: withBase(localizePath(`/projects/${project.slug}/`, locale)), tags: [...project.topics], searchText: `${project.title} ${project.summary} ${project.learn.join(" ")}` })),
    ...resources.map((resource) => ({ kind: t.resourceKind, title: resource.title, summary: resource.description, href: resource.url, tags: [resource.topic, resource.certification, resource.provider], searchText: `${resource.title} ${resource.description} ${resource.type}` }))
  ];
}
