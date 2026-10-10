import test from "node:test";
import assert from "node:assert/strict";
import { parseProgress, countCompleted } from "../src/lib/progress.ts";

test("progress starts empty, accepts only lesson IDs with true values", () => {
  assert.deepEqual(parseProgress(null), {});
  assert.deepEqual(parseProgress('{"compute/vm-basics":true,"ai/rag-grounding":false,"other":true}'),
    { "compute/vm-basics": true });
});

test("invalid progress throws instead of claiming a successful reset", () => {
  for (const raw of ["{broken", "null", "[]", '"text"', "42"]) {
    assert.throws(() => parseProgress(raw));
  }
});

test("count only includes the requested track's completed lessons", () => {
  assert.equal(countCompleted(["compute/vm-basics", "compute/container-apps"],
    { "compute/vm-basics": true, "ai/rag-grounding": true }), 1);
});
