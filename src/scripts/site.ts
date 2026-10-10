import { searchIndex } from "@/data/searchIndex";
import { parseProgress, type ProgressState } from "@/lib/progress";

const storageKey = "learning-atlas-progress-v1";

function safeStorage() {
  try {
    const test = "__la_test__";
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return window.localStorage;
  } catch {
    return null;
  }
}

function readProgress() {
  const storage = safeStorage();
  if (!storage) return { storage, progress: {} as ProgressState, warning: "本浏览器阻止本地存储，完成状态不会保存。" };
  try {
    return { storage, progress: parseProgress(storage.getItem(storageKey)), warning: "" };
  } catch {
    storage.removeItem(storageKey);
    return { storage, progress: {} as ProgressState, warning: "本地进度数据损坏，已重置为空。" };
  }
}

function writeProgress(storage: Storage | null, progress: Record<string, true>) {
  if (!storage) return;
  storage.setItem(storageKey, JSON.stringify(progress));
}

function syncProgress() {
  const { storage, progress, warning } = readProgress();
  document.querySelectorAll<HTMLElement>("[data-progress-warning]").forEach((el) => {
    el.textContent = warning;
  });
  document.querySelectorAll<HTMLElement>("[data-progress-count]").forEach((el) => {
    const ids = (el.dataset.progressCount || "").split(",").filter(Boolean);
    el.textContent = `${ids.filter((id) => progress[id]).length}/${ids.length}`;
  });
  document.querySelectorAll<HTMLButtonElement>("[data-complete-id]").forEach((button) => {
    const id = button.dataset.completeId || "";
    const done = Boolean(progress[id]);
    button.dataset.complete = String(done);
    button.textContent = done ? "已完成：点击取消" : "标记本课完成";
    button.addEventListener("click", () => {
      if (progress[id]) delete progress[id];
      else progress[id] = true;
      writeProgress(storage, progress);
      syncProgress();
    }, { once: true });
  });
  document.querySelectorAll<HTMLButtonElement>("[data-progress-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!storage) return;
      const ok = window.confirm("确定清空本浏览器的 Learning Atlas 完成进度？");
      if (!ok) return;
      storage.removeItem(storageKey);
      syncProgress();
    }, { once: true });
  });
}

function setupTheme() {
  const button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  const saved = safeStorage()?.getItem("learning-atlas-theme");
  const param = new URLSearchParams(window.location.search).get("scoutTheme");
  if (!param && saved) document.documentElement.setAttribute("data-theme", saved);
  button?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    safeStorage()?.setItem("learning-atlas-theme", next);
  });
}

function setupMenu() {
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const links = document.querySelector<HTMLElement>("#nav-links");
  toggle?.addEventListener("click", () => {
    const open = links?.dataset.open !== "true";
    if (links) links.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  });
}

function setupFilters() {
  document.querySelectorAll<HTMLElement>("[data-filter-scope]").forEach((scope) => {
    const buttons = scope.querySelectorAll<HTMLButtonElement>("[data-filter]");
    const items = scope.querySelectorAll<HTMLElement>("[data-filter-item]");
    const search = scope.querySelector<HTMLInputElement>("[data-local-search]");
    const empty = scope.querySelector<HTMLElement>("[data-empty]");
    let active = "all";
    function apply() {
      const term = (search?.value || "").trim().toLowerCase();
      let visible = 0;
      items.forEach((item) => {
        const matchesFilter = active === "all" || (item.dataset.filterItem || "").split(" ").includes(active);
        const matchesTerm = !term || (item.textContent || "").toLowerCase().includes(term);
        const show = matchesFilter && matchesTerm;
        item.classList.toggle("hidden", !show);
        if (show) visible += 1;
      });
      if (empty) empty.classList.toggle("hidden", visible !== 0);
    }
    buttons.forEach((button) => button.addEventListener("click", () => {
      active = button.dataset.filter || "all";
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      apply();
    }));
    search?.addEventListener("input", apply);
    apply();
  });
}

function setupGlobalSearch() {
  const input = document.querySelector<HTMLInputElement>("[data-global-search]");
  const list = document.querySelector<HTMLElement>("[data-search-results]");
  const empty = document.querySelector<HTMLElement>("[data-search-empty]");
  if (!input || !list) return;
  const render = () => {
    const term = input.value.trim().toLowerCase();
    list.replaceChildren();
    const results = searchIndex.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.kind} ${item.tags.join(" ")}`.toLowerCase();
      return !term || haystack.includes(term);
    }).slice(0, 60);
    results.forEach((item) => {
      const li = document.createElement("li");
      li.className = "resource-card";
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.title;
      const p = document.createElement("p");
      p.className = "muted";
      p.textContent = `${item.kind} · ${item.summary}`;
      li.append(a, p);
      list.append(li);
    });
    empty?.classList.toggle("hidden", results.length !== 0);
  };
  input.addEventListener("input", render);
  render();
}

setupTheme();
setupMenu();
syncProgress();
setupFilters();
setupGlobalSearch();
