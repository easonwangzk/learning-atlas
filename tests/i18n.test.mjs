import test from "node:test";
import assert from "node:assert/strict";
import { certificationLabel, localizeFragment, localizePath, stripLocale, ui } from "../src/i18n.ts";

test("UI dictionaries have matching keys and localized certification and difficulty labels", () => {
  const compare = (left, right) => {
    assert.deepEqual(Object.keys(left), Object.keys(right));
    for (const key of Object.keys(left)) {
      if (typeof left[key] === "object") compare(left[key], right[key]);
    }
  };
  compare(ui.zh, ui.en);
  assert.equal(certificationLabel("扩展学习", "en"), "Extended learning");
  assert.equal(certificationLabel("AZ-305", "en"), "AZ-305");
  assert.equal(ui.en.difficulty["进阶"], "Intermediate");
});

test("language switching keeps the corresponding section rather than a broken heading hash", () => {
  const chinese = localizeFragment("#concept-notes", "zh");
  assert.equal(chinese, `#${encodeURIComponent("概念笔记")}`);
  assert.equal(localizeFragment(chinese, "en"), "#concept-notes");
  assert.equal(localizeFragment("#completion-checklist", "zh"), `#${encodeURIComponent("完成检查")}`);
  assert.equal(localizeFragment("#unrelated-section", "en"), "#unrelated-section");
  assert.equal(localizeFragment("#%FF", "en"), "#%FF");
});

test("equivalent page paths preserve the lesson or project and avoid doubled locale prefixes", () => {
  for (const path of ["/", "/learn/compute/vm-basics/", "/projects/medllm/", "/resources/"]) {
    const english = localizePath(path, "en");
    assert.equal(localizePath(english, "en"), english);
    assert.equal(stripLocale(english), path);
    assert.equal(localizePath(english, "zh"), path);
  }
});
