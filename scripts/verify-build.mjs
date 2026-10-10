import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import assert from "node:assert/strict";

const dist = resolve("dist");
const site = "https://easonwangzk.github.io";
const base = "/learning-atlas/";

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(dist).filter((file) => file.endsWith(".html"));
assert.ok(htmlFiles.length >= 70, `expected bilingual generated pages, got ${htmlFiles.length}`);
const pages = new Map(htmlFiles.map((file) => [file, readFileSync(file, "utf8")]));

function targetFile(url) {
  assert.ok(url.pathname.startsWith(base), `Base path missing: ${url.href}`);
  const path = decodeURIComponent(url.pathname.slice(base.length));
  const file = resolve(dist, path, ...(url.pathname.endsWith("/") ? ["index.html"] : []));
  assert.ok(file.startsWith(`${dist}${sep}`), `Path outside output: ${url.href}`);
  assert.ok(existsSync(file), `Missing local link/asset: ${url.href}`);
  return file;
}

let references = 0;
for (const [file, html] of pages) {
  const outputPath = relative(dist, file).split(sep).join("/");
  const route = outputPath === "index.html" ? "" : outputPath.replace(/index\.html$/, "");
  const pageUrl = new URL(`${base}${route}`, site);
  const isEnglish = outputPath.startsWith("en/");
  assert.match(html, isEnglish ? /<html lang="en"/ : /<html lang="zh-CN"/, `${file}: language`);
  assert.match(html, /<link rel="canonical" href="https:\/\/easonwangzk\.github\.io\/learning-atlas\//);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical, pageUrl.href, `${file}: canonical must match the actual page`);
  assert.match(html, /hreflang="zh-CN"/, `${file}: zh alternate`);
  assert.match(html, /hreflang="en"/, `${file}: en alternate`);
  assert.match(html, /<script>\s*\(\(\) => \{/, `${file}: early inline theme detection`);
  if (isEnglish) {
    const counterpart = outputPath === "en/404/index.html" ? join(dist, "404.html") : join(dist, outputPath.slice(3));
    assert.ok(existsSync(counterpart), `${file}: missing Chinese counterpart`);
    const visibleText = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, "")
      .replaceAll("中文", "");
    assert.doesNotMatch(visibleText, /\p{Script=Han}/u, `${file}: untranslated Chinese text`);
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: duplicate element IDs`);

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll("&amp;", "&");
    if (/^(?:mailto:|tel:|data:)/.test(value)) continue;
    const url = new URL(value, pageUrl);
    if (url.origin !== site) continue;
    const target = targetFile(url);
    if (url.hash && pages.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1));
      const targetIds = [...pages.get(target).matchAll(/\bid="([^"]+)"/g)].map((entry) => entry[1]);
      assert.ok(targetIds.includes(id), `${file}: missing fragment ${url.href}`);
    }
    references += 1;
  }
}

const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(locations.length, htmlFiles.length - 2, "All pages except localized 404 pages belong in sitemap");
locations.forEach((location) => targetFile(new URL(location)));
assert.match(readFileSync(join(dist, "robots.txt"), "utf8"), /learning-atlas\/sitemap\.xml/);
assert.match(readFileSync(join(dist, "index.html"), "utf8"), /data-gallery-track/);
assert.match(readFileSync(join(dist, "en", "index.html"), "utf8"), /data-gallery-track/);
console.log(`Verified ${htmlFiles.length} pages and ${references} local links/assets.`);
