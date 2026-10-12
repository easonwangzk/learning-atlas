import test from "node:test";
import assert from "node:assert/strict";
import { cornerNavigation, primaryNavigation, secondaryNavigation, localizeNavPath } from "../src/data/navigation.ts";
import { certifications } from "../src/data/certifications.ts";
test("directory contains learning content while progress and about stay in the corner", () => {
  assert.deepEqual(primaryNavigation.map((entry) => entry.key),
    ["Learn", "Projects", "Labs", "Notes"]);
  assert.equal(primaryNavigation[0].path, "/learn/");
  assert.deepEqual(primaryNavigation[0].children.map((child) => child.key),
    ["compute", "storage", "network", "database", "ai", "ml", "az-104", "az-700", "az-305"]);
  assert.deepEqual(cornerNavigation.map((entry) => entry.key), ["Roadmap", "About"]);
  assert.equal(cornerNavigation[0].label.zh, "学习进度");
  assert.deepEqual(secondaryNavigation.map((entry) => entry.key), ["Resources", "Search"]);
  for (const entry of primaryNavigation) assert.equal(localizeNavPath(entry.path, "en"), `/en${entry.path}`);
});
test("certification mappings exclude unrelated ML lessons from infrastructure exam objectives", () => {
  for (const cert of certifications) {
    assert.equal(cert.domains.length, cert.slug === "az-305" ? 4 : 5);
    for (const domain of cert.domains) assert.equal(domain.mappedLessons.some((lesson) => lesson.startsWith("ml/")), false);
  }
  assert.equal(certifications.find((cert) => cert.slug === "az-700").domains.at(-1).name.en,
    "Design and implement Azure network security services");
});
