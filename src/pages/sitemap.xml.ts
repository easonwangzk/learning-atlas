import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { tracks } from "@/data/tracks";
import { projects } from "@/data/projects";
import { canonical } from "@/lib/paths";
import { lessonRoute } from "@/lib/lessons";

export const GET: APIRoute = async () => {
  const lessons = await getCollection("lessons");
  const paths = [
    "/",
    "/learn/",
    "/projects/",
    "/resources/",
    "/about/",
    "/search/",
    ...tracks.map((track) => `/learn/${track.slug}/`),
    ...lessons.map(lessonRoute),
    ...projects.map((project) => `/projects/${project.slug}/`)
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${canonical(path)}</loc></url>`).join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
