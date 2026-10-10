import test from "node:test";
import assert from "node:assert/strict";
import { advanceSpring, springSettled } from "../src/lib/motion.ts";

test("cursor spring converges and lets the animation loop stop", () => {
  let state = { x: 0, y: 0, vx: 0, vy: 0 };
  const target = { x: 500, y: 300 };
  for (let frame = 0; frame < 240 && !springSettled(state, target); frame++) {
    state = advanceSpring(state, target, 1 / 60);
  }
  assert.equal(springSettled(state, target), true);
});

test("spring remains finite after a long background tab delay", () => {
  const state = advanceSpring({ x: 0, y: 0, vx: 0, vy: 0 }, { x: 100, y: 100 }, 3600);
  assert.ok(Object.values(state).every(Number.isFinite));
  assert.ok(state.x > 0 && state.x < 100);
  assert.throws(() => advanceSpring(state, { x: 0, y: 0 }, -1));
});
