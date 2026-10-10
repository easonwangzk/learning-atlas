import test from "node:test";
import assert from "node:assert/strict";
import { primaryNavigation, secondaryNavigation, localizeNavPath } from "../src/data/navigation.ts";
import { certifications } from "../src/data/certifications.ts";
test("primary site hierarchy follows the requested order with distinct map and courses", () => {
  assert.deepEqual(primaryNavigation.map((entry) => entry.key),
    ["KnowledgeMap", "Learn", "Certifications", "Projects", "Labs", "Notes", "Roadmap", "About"]);
  assert.equal(primaryNavigation[0].path, "/knowledge-map/");
  assert.equal(primaryNavigation[1].path, "/learn/");
  assert.deepEqual(primaryNavigation[1].children.map((child) => child.key), ["compute", "storage", "network", "database", "ai", "ml"]);
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
