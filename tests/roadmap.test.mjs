import test from "node:test";
import assert from "node:assert/strict";
import { nextLessonId } from "../src/lib/roadmap.ts";
test("roadmap selects one unfinished lesson and stops recycling after completion", () => {
  const ids = ["compute/vm-basics", "compute/container-apps"];
  assert.equal(nextLessonId(ids, {}), ids[0]);
  assert.equal(nextLessonId(ids, { [ids[0]]: true }), ids[1]);
  assert.equal(nextLessonId(ids, { [ids[0]]: true, [ids[1]]: true }), null);
  assert.equal(nextLessonId([], {}), null);
});
