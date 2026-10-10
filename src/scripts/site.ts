import { parseProgress, type ProgressState } from "@/lib/progress";
import { matchesQuery } from "@/lib/search";

const progressKey = "learning-atlas-progress-v1";
const themeKey = "learning-atlas-theme";
const motionKey = "learning-atlas-motion";
const isEnglish = document.documentElement.lang.startsWith("en");
const labels = {
  readError: isEnglish ? "Local progress could not be read because storage is unavailable or malformed. Existing records were not deleted; content remains readable." : "无法读取本地进度：存储不可用或数据格式错误。原记录未删除；内容仍可阅读。",
  saveError: isEnglish ? "Progress could not be saved in this browser and is only temporary until refresh." : "进度未能保存到本浏览器，仅在当前页面暂存，刷新后可能丢失。",
  syncError: isEnglish ? "Progress from another page was malformed, so the current state was not overwritten." : "另一页面的进度数据格式错误，当前进度未被覆盖。",
  done: isEnglish ? "Completed: click to undo" : "已完成：点击取消",
  todo: isEnglish ? "Mark this lesson complete" : "标记本课完成",
  reset: isEnglish ? "Clear all Learning Atlas completion progress in this browser?" : "确定清空本浏览器的 Learning Atlas 完成进度？",
  themeError: isEnglish ? "Theme changed, but this browser did not allow saving the preference." : "主题已切换，但浏览器未允许保存偏好。",
  items: (visible: number, total: number) => isEnglish ? `${visible} / ${total} items` : `${visible} / ${total} 项`,
  results: (visible: number) => isEnglish ? `${visible} results` : `${visible} 条结果`,
  open: isEnglish ? "Open" : "打开",
  drag: isEnglish ? "Drag" : "拖动"
};
let progress: ProgressState = {};
let progressWarning = "";
let storage: Storage | null = null;

try {
  storage = window.localStorage;
  progress = parseProgress(storage.getItem(progressKey));
} catch (error) {
  progressWarning = labels.readError;
  console.warn("Learning Atlas could not read progress.", error);
}

function reportStorageFailure(error: unknown) {
  progressWarning = labels.saveError;
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
    button.textContent = done ? labels.done : labels.todo;
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
      if (!window.confirm(labels.reset)) return;
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
      progressWarning = labels.syncError;
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
      progressWarning = labels.themeError;
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
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-motion-toggle]");
  if (!buttons.length) return;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const setButtons = (paused: boolean, reduced = false) => {
    buttons.forEach((button) => {
      button.disabled = reduced;
      button.setAttribute("aria-pressed", String(paused || reduced));
      button.textContent = reduced ? (button.dataset.labelReduced || "") : paused ? (button.dataset.labelPlay || "") : (button.dataset.labelPause || "");
    });
  };
  const applyPreference = () => {
    const stored = storage?.getItem(motionKey);
    const paused = preference.matches || stored === "paused";
    document.documentElement.dataset.motion = paused ? "paused" : "running";
    setButtons(paused, preference.matches);
  };
  preference.addEventListener("change", applyPreference);
  applyPreference();
  buttons.forEach((button) => button.addEventListener("click", () => {
    const paused = document.documentElement.dataset.motion !== "paused";
    document.documentElement.dataset.motion = paused ? "paused" : "running";
    try { storage?.setItem(motionKey, paused ? "paused" : "running"); } catch {}
    setButtons(paused);
  }));
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
      if (count) count.textContent = labels.items(visible, items.length);
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
    if (count) count.textContent = labels.results(visible);
    empty?.classList.toggle("hidden", visible !== 0);
  };
  input.addEventListener("input", apply);
  apply();
}

function setupSearchQuery() {
  const input = document.querySelector<HTMLInputElement>("[data-global-search]");
  if (!input) return;
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) {
    input.value = q;
    input.dispatchEvent(new Event("input"));
  }
  input.addEventListener("input", () => {
    const next = new URL(window.location.href);
    if (input.value.trim()) next.searchParams.set("q", input.value.trim());
    else next.searchParams.delete("q");
    history.replaceState(null, "", next);
  });
}

function setupLanguageSwitch() {
  document.querySelectorAll<HTMLAnchorElement>("[data-lang-switch]").forEach((link) => {
    link.addEventListener("click", () => {
      try {
        const target = new URL(link.href);
        target.search = window.location.search;
        target.hash = window.location.hash;
        link.href = target.toString();
      } catch {}
    });
  });
}

function setupReveal() {
  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!elements.length || !("IntersectionObserver" in window) || document.documentElement.dataset.motion === "paused") return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      (entry.target as HTMLElement).dataset.revealed = "true";
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  elements.forEach((element) => observer.observe(element));
}

function setupGallery() {
  document.querySelectorAll<HTMLElement>("[data-gallery]").forEach((gallery) => {
    const track = gallery.querySelector<HTMLElement>("[data-gallery-track]");
    const prev = gallery.querySelector<HTMLButtonElement>("[data-gallery-prev]");
    const next = gallery.querySelector<HTMLButtonElement>("[data-gallery-next]");
    const index = gallery.querySelector<HTMLElement>("[data-gallery-index]");
    if (!track) return;
    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let dragging = false;
    let didDrag = false;
    const cards = [...track.querySelectorAll<HTMLElement>("[data-gallery-card]")];
    const updateIndex = () => {
      if (!index || !cards.length) return;
      const current = cards.reduce((best, card, idx) => {
        const delta = Math.abs(card.offsetLeft - track.scrollLeft);
        return delta < best.delta ? { idx, delta } : best;
      }, { idx: 0, delta: Number.POSITIVE_INFINITY }).idx;
      index.textContent = `${current + 1}/${cards.length}`;
    };
    const scrollByCard = (direction: number) => {
      const amount = cards[0]?.getBoundingClientRect().width ?? track.clientWidth * 0.8;
      track.scrollBy({ left: direction * amount, behavior: document.documentElement.dataset.motion === "paused" ? "auto" : "smooth" });
    };
    prev?.addEventListener("click", () => scrollByCard(-1));
    next?.addEventListener("click", () => scrollByCard(1));
    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") scrollByCard(-1);
      if (event.key === "ArrowRight") scrollByCard(1);
    });
    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      startX = event.clientX;
      startY = event.clientY;
      startScroll = track.scrollLeft;
      dragging = true;
      didDrag = false;
      track.setPointerCapture(event.pointerId);
      document.documentElement.dataset.cursorLabel = labels.drag;
    });
    track.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) return;
      if (Math.abs(dx) > 8) didDrag = true;
      if (didDrag) {
        event.preventDefault();
        track.scrollLeft = startScroll - dx;
      }
    });
    track.addEventListener("pointerup", (event) => {
      dragging = false;
      track.releasePointerCapture(event.pointerId);
      window.setTimeout(() => { didDrag = false; }, 0);
      document.documentElement.dataset.cursorLabel = labels.open;
    });
    track.addEventListener("click", (event) => {
      if (didDrag) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    track.addEventListener("scroll", updateIndex, { passive: true });
    updateIndex();
  });
}

function setupViewToggle() {
  document.querySelectorAll<HTMLElement>("[data-filter-scope]").forEach((scope) => {
    const buttons = scope.querySelectorAll<HTMLButtonElement>("[data-view]");
    if (!buttons.length) return;
    const setView = (view: string) => {
      scope.dataset.viewMode = view;
      buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === view)));
    };
    buttons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view || "gallery")));
    setView("gallery");
  });
}

function setupTilt() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (document.documentElement.dataset.motion === "paused") return;
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}

function setupSmoothCursor() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || reduce.matches) return;
  const cursor = document.createElement("div");
  cursor.className = "smooth-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = `<span></span>`;
  document.body.append(cursor);
  let targetX = -100;
  let targetY = -100;
  let x = targetX;
  let y = targetY;
  let vx = 0;
  let vy = 0;
  let raf = 0;
  let last = performance.now();
  const step = (now: number) => {
    if (document.hidden || document.documentElement.dataset.motion === "paused") {
      raf = 0;
      cursor.classList.remove("active");
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.032);
    last = now;
    const stiffness = 400;
    const damping = 45;
    const ax = (targetX - x) * stiffness - vx * damping;
    const ay = (targetY - y) * stiffness - vy * damping;
    vx += ax * dt;
    vy += ay * dt;
    x += vx * dt;
    y += vy * dt;
    const angle = Math.atan2(vy, vx) * 180 / Math.PI;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${Number.isFinite(angle) ? angle : 0}deg)`;
    raf = requestAnimationFrame(step);
  };
  const start = () => {
    if (!raf && document.documentElement.dataset.motion !== "paused") {
      last = performance.now();
      raf = requestAnimationFrame(step);
    }
  };
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const target = event.target instanceof Element ? event.target : null;
    const interactive = target?.closest("a,button,[data-gallery-track]") ? document.documentElement.dataset.cursorLabel || labels.open : "";
    cursor.dataset.label = interactive;
    cursor.classList.toggle("has-label", Boolean(interactive));
    cursor.classList.add("active");
    targetX = event.clientX;
    targetY = event.clientY;
    start();
  }, { passive: true });
  window.addEventListener("blur", () => cursor.classList.remove("active"));
  document.addEventListener("visibilitychange", () => { if (document.hidden && raf) cancelAnimationFrame(raf); raf = 0; });
  reduce.addEventListener("change", () => { if (reduce.matches) cursor.remove(); });
}

setupTheme();
setupMenu();
setupMotion();
setupProgress();
setupFilters();
setupGlobalSearch();
setupSearchQuery();
setupLanguageSwitch();
setupReveal();
setupGallery();
setupViewToggle();
setupTilt();
setupSmoothCursor();
