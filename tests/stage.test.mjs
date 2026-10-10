import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { clampIndex, indexFromOffset, normalizedWheelDelta, perspectiveGrid, stageCardMetrics, targetOffsetForIndex } from "../src/lib/stageGeometry.ts";

test("stage card metrics match the dark portfolio first fold", () => {
  const desktop = stageCardMetrics(1440, 900);
  assert.ok(desktop.cardWidth >= 660 && desktop.cardWidth <= 690);
  assert.ok(desktop.cardHeight >= 385 && desktop.cardHeight <= 400);
  assert.equal(targetOffsetForIndex(2, 6, desktop), 2 * (desktop.cardWidth + desktop.gap));
  assert.equal(indexFromOffset(targetOffsetForIndex(4, 6, desktop) + 10, 6, desktop), 4);
  assert.equal(clampIndex(-1, 6), 0);
  assert.equal(clampIndex(9, 6), 5);

  const mobile = stageCardMetrics(390, 844);
  assert.equal(mobile.cardWidth, 350);
  assert.ok(mobile.cardHeight >= 195 && mobile.cardHeight <= 210);
});

test("wheel deltas and perspective grid are deterministic", () => {
  assert.equal(normalizedWheelDelta({ deltaX: 0, deltaY: 2, deltaMode: 1 }), 36);
  assert.equal(normalizedWheelDelta({ deltaX: 24, deltaY: 3, deltaMode: 0 }), 24);
  const grid = perspectiveGrid(1440, 900, 13, 8);
  assert.equal(grid.length, 21);
  assert.ok(grid[0].y1 < grid[0].y2);
  assert.ok(grid.at(-1).x1 < 720 && grid.at(-1).x2 > 720);
});

test("home stage replaces the old hero and keeps accessible navigation", () => {
  const home = readFileSync("src/pages/index.astro", "utf8");
  const stage = readFileSync("src/components/BilingualStage.astro", "utf8");
  const css = readFileSync("src/styles/global.css", "utf8");
  assert.match(home, /<BilingualStage/);
  assert.doesNotMatch(home, /hero-title|开始学习|搜索全站/);
  assert.match(stage, /data-stage-canvas/);
  assert.match(stage, /data-stage-track/);
  assert.match(stage, /Profile|简介/);
  assert.match(stage, /data-dialog-open="explore-panel"/);
  assert.match(css, /\.scene-body/);
  assert.match(css, /height: 100dvh/);
});
