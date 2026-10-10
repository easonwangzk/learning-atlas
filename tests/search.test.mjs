import test from "node:test";
import assert from "node:assert/strict";
import { matchesQuery } from "../src/lib/search.ts";
import { lessonRoute, lessonProgressId } from "../src/lib/lessons.ts";

test("search handles case, whitespace, Chinese and multiple terms", () => {
  assert.equal(matchesQuery("Azure Blob 存储 AZ-104", "  blob   存储 "), true);
  assert.equal(matchesQuery("Azure Blob", "blob network"), false);
  assert.equal(matchesQuery("Azure", ""), true);
  assert.equal(matchesQuery("AZ-104", "ＡＺ-１０４"), true);
});

test("lesson metadata drives page routes and stable progress IDs", () => {
  const lesson = { id: "draft-file-name", data: { track: "compute", slug: "vm-basics" } };
  assert.equal(lessonRoute(lesson), "/learn/compute/vm-basics/");
  assert.equal(lessonProgressId(lesson), "compute/vm-basics");
});
