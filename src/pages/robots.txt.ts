import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /learning-atlas/\nSitemap: https://easonwangzk.github.io/learning-atlas/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
