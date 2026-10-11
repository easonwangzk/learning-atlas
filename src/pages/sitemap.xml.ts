import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { tracks } from "@/data/tracks";
import { getProjects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import { labs } from "@/data/labs";
import { canonical } from "@/lib/paths";
import { lessonLocale, lessonRoute } from "@/lib/lessons";

export const GET: APIRoute = async () => {
  const lessons = await getCollection("lessons");
  const projects = getProjects("zh");
  const zhLessons = lessons.filter((lesson) => lessonLocale(lesson) === "zh");
  const enLessons = lessons.filter((lesson) => lessonLocale(lesson) === "en");
  const shared = ["/knowledge-map/", "/learn/", "/certifications/", "/projects/", "/projects/showcase/", "/labs/", "/notes/", "/roadmap/", "/resources/", "/about/", "/search/"];
  const zhPaths = ["/", ...shared, ...tracks.map((track) => `/learn/${track.slug}/`), ...zhLessons.map((lesson) => lessonRoute(lesson, "zh")), ...certifications.map((cert) => `/certifications/${cert.slug}/`), ...projects.map((project) => `/projects/${project.slug}/`), ...labs.map((lab) => `/labs/${lab.slug}/`)];
  const enPaths = ["/en/", ...shared.map((path) => `/en${path}`), ...tracks.map((track) => `/en/learn/${track.slug}/`), ...enLessons.map((lesson) => lessonRoute(lesson, "en")), ...certifications.map((cert) => `/en/certifications/${cert.slug}/`), ...projects.map((project) => `/en/projects/${project.slug}/`), ...labs.map((lab) => `/en/labs/${lab.slug}/`)];
  const paths = [...zhPaths, ...enPaths];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${canonical(path)}</loc></url>`).join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
