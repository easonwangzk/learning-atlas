import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
test("global menus contain only top-level destinations, never expandable topics", () => {
  const menu = readFileSync("src/components/NavigationIndex.astro", "utf8");
  assert.match(menu, /primaryNavigation\.map/);
  assert.match(menu, /secondaryNavigation\.map/);
  assert.doesNotMatch(menu, /<details|<summary|entry\.children|data-nav-child/);
  assert.doesNotMatch(menu, /data-nav-purpose/);
  assert.match(readFileSync("src/components/SiteChrome.astro", "utf8"), /cornerNavigation\.map/);
  assert.doesNotMatch(readFileSync("src/components/HomeView.astro", "utf8"), /Knowledge Map|知识地图/);
});
test("home and Projects expose the relocated bilingual showcase", () => {
  const home = readFileSync("src/components/HomeView.astro", "utf8");
  assert.match(home, /primaryNavigation\.map/);
  assert.match(home, /\/projects\/showcase\//);
  for (const file of ["src/pages/projects/showcase/index.astro", "src/pages/en/projects/showcase/index.astro"]) {
    const page = readFileSync(file, "utf8");
    assert.match(page, /pageKind="showcase" scene/);
    assert.match(page, /<ShowcaseView/);
  }
  assert.match(readFileSync("src/components/ProjectIndexView.astro", "utf8"), /\/projects\/showcase\//);
  assert.match(readFileSync("src/components/BilingualStage.astro", "utf8"),
    /const switchPath = withBase\(isEn \? "\/projects\/showcase\/" : "\/en\/projects\/showcase\/"\)/);
});
