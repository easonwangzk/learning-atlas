import { parseProgress, type ProgressState } from "@/lib/progress";
import { matchesQuery } from "@/lib/search";

const progressKey = "learning-atlas-progress-v1";
const themeKey = "learning-atlas-theme";
let progress: ProgressState = {};
let progressWarning = "";
let storage: Storage | null = null;

try {
  storage = window.localStorage;
  progress = parseProgress(storage.getItem(progressKey));
} catch (error) {
  progressWarning = "无法读取本地进度：存储不可用或数据格式错误。原记录未删除；内容仍可阅读。";
  console.warn("Learning Atlas could not read progress.", error);
}

function reportStorageFailure(error: unknown) {
  progressWarning = "进度未能保存到本浏览器，仅在当前页面暂存，刷新后可能丢失。";
  console.warn("Learning Atlas could not save progress.", error);
}

function renderProgress() {
  document.querySelectorAll<HTMLElement>("[data-progress-warning]").forEach((el) => {
    el.textContent = progressWarning;
  });
  document.querySelectorAll<HTMLElement>("[data-progress-count]").forEach((el) => {
    const ids = (el.dataset.progressCount || "").split(",").filter(Boolean);
    el.textContent = `${ids.filter((id) => progress[id]).length}/${ids.length}`;
  });
  document.querySelectorAll<HTMLButtonElement>("[data-complete-id]").forEach((button) => {
    const done = Boolean(progress[button.dataset.completeId || ""]);
    button.dataset.complete = String(done);
    button.setAttribute("aria-pressed", String(done));
    button.textContent = done ? "已完成：点击取消" : "标记本课完成";
  });
}

function setupProgress() {
  document.querySelectorAll<HTMLButtonElement>("[data-complete-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.completeId;
      if (!id) throw new Error("Lesson completion control is missing its lesson ID");
      if (progress[id]) delete progress[id];
      else progress[id] = true;
      try {
        if (!storage) throw new Error("Local storage is unavailable");
        storage.setItem(progressKey, JSON.stringify(progress));
        progressWarning = "";
      } catch (error) {
        reportStorageFailure(error);
      }
      renderProgress();
    });
  });
  document.querySelectorAll<HTMLButtonElement>("[data-progress-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!window.confirm("确定清空本浏览器的 Learning Atlas 完成进度？")) return;
      try {
        if (!storage) throw new Error("Local storage is unavailable");
        storage.removeItem(progressKey);
        progress = {};
        progressWarning = "";
      } catch (error) {
        reportStorageFailure(error);
      }
      renderProgress();
    });
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== progressKey && event.key !== null) return;
    try {
      progress = parseProgress(event.key === null ? null : event.newValue);
      progressWarning = "";
    } catch (error) {
      progressWarning = "另一页面的进度数据格式错误，当前进度未被覆盖。";
      console.warn("Learning Atlas could not synchronize local progress.", error);
    }
    renderProgress();
  });
  renderProgress();
}

function setupTheme() {
  const button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  button?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      if (!storage) throw new Error("Local storage is unavailable");
      storage.setItem(themeKey, next);
    } catch (error) {
      progressWarning = "主题已切换，但浏览器未允许保存偏好。";
      console.warn("Learning Atlas could not save the theme.", error);
      renderProgress();
    }
  });
}

function setupMenu() {
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const links = document.querySelector<HTMLElement>("#nav-links");
  if (!toggle || !links) return;
  const setOpen = (open: boolean) => {
    links.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setOpen(links.dataset.open !== "true"));
  links.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && links.dataset.open === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (event.target instanceof Node && !links.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });
}

function setupMotion() {
  const button = document.querySelector<HTMLButtonElement>("[data-motion-toggle]");
  if (!button) return;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const applyPreference = () => {
    document.documentElement.dataset.motion = preference.matches ? "paused" : "running";
    button.disabled = preference.matches;
    button.setAttribute("aria-pressed", String(preference.matches));
    button.textContent = preference.matches ? "已减少动画" : "暂停动画";
  };
  preference.addEventListener("change", applyPreference);
  applyPreference();
  button.addEventListener("click", () => {
    const paused = document.documentElement.dataset.motion !== "paused";
    document.documentElement.dataset.motion = paused ? "paused" : "running";
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused ? "播放动画" : "暂停动画";
  });
}

function setupFilters() {
  document.querySelectorAll<HTMLElement>("[data-filter-scope]").forEach((scope) => {
    const buttons = scope.querySelectorAll<HTMLButtonElement>("[data-filter]");
    const selects = scope.querySelectorAll<HTMLSelectElement>("[data-filter-select]");
    const items = scope.querySelectorAll<HTMLElement>("[data-filter-item]");
    const search = scope.querySelector<HTMLInputElement>("[data-local-search]");
    const empty = scope.querySelector<HTMLElement>("[data-empty]");
    const count = scope.querySelector<HTMLElement>("[data-filter-count]");
    const filters = new Map<string, string>();
    const apply = () => {
      let visible = 0;
      items.forEach((item) => {
        const matchesFilters = [...filters].every(([field, value]) => {
          if (value === "all") return true;
          const values = item.getAttribute(`data-${field}`);
          return values ? values.split("|").includes(value) : (item.dataset.filterItem || "").split(" ").includes(value);
        });
        const show = matchesFilters && matchesQuery(item.textContent || "", search?.value || "");
        item.classList.toggle("hidden", !show);
        if (show) visible += 1;
      });
      empty?.classList.toggle("hidden", visible !== 0);
      if (count) count.textContent = `${visible} / ${items.length} 项`;
    };
    buttons.forEach((button) => button.addEventListener("click", () => {
      const field = button.dataset.filterGroup || "topic";
      filters.set(field, button.dataset.filter || "all");
      buttons.forEach((other) => {
        if ((other.dataset.filterGroup || "topic") === field) {
          other.setAttribute("aria-pressed", String(other === button));
        }
      });
      apply();
    }));
    selects.forEach((select) => select.addEventListener("change", () => {
      filters.set(select.dataset.filterSelect || "topic", select.value);
      apply();
    }));
    scope.querySelector<HTMLButtonElement>("[data-filter-reset]")?.addEventListener("click", () => {
      filters.clear();
      if (search) search.value = "";
      selects.forEach((select) => { select.value = "all"; });
      buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === "all")));
      apply();
    });
    search?.addEventListener("input", apply);
    apply();
  });
}

function setupGlobalSearch() {
  const input = document.querySelector<HTMLInputElement>("[data-global-search]");
  if (!input) return;
  const items = document.querySelectorAll<HTMLElement>("[data-search-item]");
  const count = document.querySelector<HTMLElement>("[data-search-count]");
  const empty = document.querySelector<HTMLElement>("[data-search-empty]");
  const apply = () => {
    let visible = 0;
    items.forEach((item) => {
      const show = matchesQuery(item.dataset.searchItem || "", input.value);
      item.classList.toggle("hidden", !show);
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} 条结果`;
    empty?.classList.toggle("hidden", visible !== 0);
  };
  input.addEventListener("input", apply);
  apply();
}

setupTheme();
setupMenu();
setupMotion();
setupProgress();
setupFilters();
setupGlobalSearch();
