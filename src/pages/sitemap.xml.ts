import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { tracks } from "@/data/tracks";
import { getProjects } from "@/data/projects";
import { canonical } from "@/lib/paths";
import { lessonLocale, lessonRoute } from "@/lib/lessons";

export const GET: APIRoute = async () => {
  const lessons = await getCollection("lessons");
  const projects = getProjects("zh");
  const zhLessons = lessons.filter((lesson) => lessonLocale(lesson) === "zh");
  const enLessons = lessons.filter((lesson) => lessonLocale(lesson) === "en");
  const zhPaths = [
    "/",
    "/learn/",
    "/projects/",
    "/resources/",
    "/about/",
    "/search/",
    ...tracks.map((track) => `/learn/${track.slug}/`),
    ...zhLessons.map((lesson) => lessonRoute(lesson, "zh")),
    ...projects.map((project) => `/projects/${project.slug}/`)
  ];
  const enPaths = [
    "/en/",
    "/en/learn/",
    "/en/projects/",
    "/en/resources/",
    "/en/about/",
    "/en/search/",
    ...tracks.map((track) => `/en/learn/${track.slug}/`),
    ...enLessons.map((lesson) => lessonRoute(lesson, "en")),
    ...projects.map((project) => `/en/projects/${project.slug}/`)
  ];
  const paths = [...zhPaths, ...enPaths];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${canonical(path)}</loc></url>`).join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
