import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const lessonDir = join(root, "src", "content", "lessons");
const lessons = readdirSync(lessonDir).filter((file) => file.endsWith(".md"));
const enLessonDir = join(lessonDir, "en");
const enLessons = readdirSync(enLessonDir).filter((file) => file.endsWith(".md"));

test("contains exactly 18 lesson markdown files", () => {
  assert.equal(lessons.length, 18);
});

test("contains 18 English counterparts with stable locale-independent IDs", () => {
  assert.deepEqual(enLessons.sort(), lessons.sort());
  for (const file of enLessons) {
    const text = readFileSync(join(enLessonDir, file), "utf8");
    assert.match(text, /^locale: en$/m, file);
    assert.doesNotMatch(text, /^slug: /m, `${file} should let the collection id stay unique`);
    assert.match(text, /## Completion checklist/, file);
  }
});

test("lessons include required frontmatter and public sources", () => {
  for (const file of lessons) {
    const text = readFileSync(join(lessonDir, file), "utf8");
    assert.match(text, /^slug: /m, file);
    assert.match(text, /^track: (compute|storage|network|database|ai|ml)$/m, file);
    assert.match(text, /^reviewedAt: "2026-10-10"$/m, file);
    assert.match(text, /sourceUrls: \["https:\/\//, file);
    assert.match(text, /## 完成检查/, file);
  }
});

test("published content does not contain credentials or account-specific Azure IDs", () => {
  const sourceFiles = [
    ...lessons.map((file) => join(lessonDir, file)),
    join(root, "src", "pages", "about.astro"),
    join(root, "src", "data", "projects.ts")
  ];
  const corpus = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  assert.doesNotMatch(corpus, /\/subscriptions\/[0-9a-f-]{36}/i);
  assert.doesNotMatch(corpus, /(?:ghp_|gho_|sk-)[A-Za-z0-9]{20,}/);
});
