import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const resources = readFileSync("src/data/resources.ts", "utf8");

test("resource index contains at least 24 explicit URLs", () => {
  const urls = [...resources.matchAll(/https:\/\/[^"]+/g)].map((match) => match[0]);
  assert.ok(urls.length >= 24);
  assert.ok(urls.includes("https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104"));
  assert.ok(urls.includes("https://huggingface.co/learn"));
});

test("resources use organized date wording rather than verified wording", () => {
  assert.match(readFileSync("src/pages/resources.astro", "utf8"), /整理于/);
  assert.equal(/verified/i.test(readFileSync("src/pages/resources.astro", "utf8")), false);
});
