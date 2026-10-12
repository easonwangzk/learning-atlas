import { parseProgress, type ProgressState } from "@/lib/progress";
import { matchesQuery } from "@/lib/search";
import { advanceSpring, springSettled } from "@/lib/motion";
import { basePath, withBase } from "@/lib/paths";
import { localizeFragment, localizePath, stripLocale, ui } from "@/i18n";
import { setupLabs } from "@/scripts/labs";
import { indexFromOffset, normalizedWheelDelta, stageCardMetrics, targetOffsetForIndex, perspectiveGrid } from "@/lib/stageGeometry";
import { allNavigation, localizeNavPath } from "@/data/navigation";
import { nextLessonId } from "@/lib/roadmap";

function setupNotFoundLocale() {
  if (document.documentElement.dataset.notFound !== "true") return;
  const requestPath = location.pathname.slice(basePath.length);
  const locale = requestPath.startsWith("/en/") ? "en" : "zh";
  const t = ui[locale];
  document.documentElement.lang = t.lang;
  const replace = (selector: string, text: string) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) element.textContent = text;
  };
  replace(".skip-link", t.skip);
  const navPaths = { Home: "/", Knowledge: "/learn/", Learn: "/learn/", Projects: "/projects/", Labs: "/labs/", Notes: "/notes/", Roadmap: "/roadmap/", Resources: "/resources/", About: "/about/", Search: "/search/" };
  for (const [key, path] of Object.entries(navPaths)) {
    const label = Object.entries(t.nav).find(([name]) => name === key)?.[1];
    document.querySelectorAll<HTMLAnchorElement>(`[data-nav-key="${key}"]`).forEach((link) => {
      if (!label) throw new Error(`Missing localized navigation label: ${key}`);
      const title = link.querySelector<HTMLElement>("[data-nav-label]");
      if (title) {
        title.textContent = label;
        const entry = allNavigation.find((item) => item.key === key);
        const purpose = link.querySelector<HTMLElement>("[data-nav-purpose]");
        if (entry && purpose) purpose.textContent = entry.purpose[locale];
      } else link.textContent = link.classList.contains("chrome-brand") ? "Learning Atlas" : label;
      link.href = withBase(localizePath(path, locale));
    });
  }
  document.querySelectorAll<HTMLAnchorElement>("[data-nav-child]").forEach((link) => {
    const child = allNavigation.flatMap((entry) => [...entry.children]).find((item) => item.key === link.dataset.navChild);
    if (!child) throw new Error("Unknown navigation child");
    link.textContent = child.label[locale];
    link.href = withBase(localizeNavPath(child.path, locale));
  });
  document.querySelectorAll<HTMLElement>(".navigation-children summary").forEach((el) => { el.textContent = locale === "en" ? "Browse topics" : "展开子栏目"; });
  document.querySelector("[data-site-chrome]")?.setAttribute("aria-label", t.navLabel);
  const brand = document.querySelector<HTMLAnchorElement>(".chrome-brand, .stage-wordmark");
  if (brand) brand.href = withBase(localizePath("/", locale));
  const language = document.querySelector<HTMLAnchorElement>("[data-lang-switch]");
  if (language) {
    language.textContent = t.switchLabel;
    language.href = withBase(locale === "en" ? stripLocale(requestPath) : localizePath(requestPath === "/404.html" ? "/404/" : requestPath, "en"));
    if (requestPath === "/en/404/") language.href = withBase("/404.html");
  }
  const motion = document.querySelector<HTMLButtonElement>("[data-motion-toggle]");
  if (motion) {
    motion.textContent = t.motionPause;
    motion.dataset.labelPause = t.motionPause;
    motion.dataset.labelPlay = t.motionPlay;
    motion.dataset.labelReduced = t.motionReduced;
  }
  document.querySelector("[data-theme-toggle]")?.setAttribute("aria-label", t.theme);
  replace("[data-menu-toggle]", t.menu);
  replace("[data-chrome-menu-toggle]", t.menu);
  replace("[data-chrome-menu-title]", locale === "en" ? "Site index" : "站点索引");
  replace("[data-chrome-privacy]", t.footerOne);
  document.querySelector("[data-chrome-close]")?.setAttribute("aria-label", locale === "en" ? "Close" : "关闭");
  if (locale === "en") {
    replace("[data-notfound-title]", "This path does not have a lesson yet.");
    replace("[data-notfound-description]", "Return to Learn or use site search.");
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Page not found.");
    for (const [kind, label] of [["learn", "Learn"], ["search", "Search"]]) {
      const link = document.querySelector<HTMLAnchorElement>(`[data-notfound-link="${kind}"]`);
      if (link) {
        link.textContent = label;
        link.href = withBase(`/en/${kind}/`);
      }
    }
  }
}

setupNotFoundLocale();

const progressKey = "learning-atlas-progress-v1";
const themeKey = "learning-atlas-theme";
const motionKey = "learning-atlas-motion";
const isEnglish = document.documentElement.lang.startsWith("en");
const t = ui[isEnglish ? "en" : "zh"];
const labels = {
  readError: t.progressReadError,
  saveError: t.progressSaveError,
  syncError: t.progressSyncError,
  done: t.progressDone,
  todo: t.progressTodo,
  reset: t.progressReset,
  themeError: t.themeSaveError,
  motionError: t.motionSaveError,
  motionReadError: t.motionReadError,
  items: t.countItems,
  results: t.countResults,
  open: t.open,
  drag: t.drag
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
  document.querySelectorAll<SVGRectElement>("[data-progress-bar]").forEach((bar) => {
    const ids = (bar.dataset.progressBar || "").split(",").filter(Boolean);
    const ratio = ids.length ? ids.filter((id) => progress[id]).length / ids.length : 0;
    bar.setAttribute("width", String(Math.round(120 * ratio)));
  });
  const next = document.querySelector<HTMLAnchorElement>("[data-roadmap-next]");
  const roadmapLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-roadmap-lesson]")];
  const nextId = nextLessonId(roadmapLinks.map((link) => link.dataset.roadmapLesson || ""), progress);
  const unfinished = roadmapLinks.find((link) => link.dataset.roadmapLesson === nextId);
  if (next && roadmapLinks.length) {
    next.href = unfinished?.href ?? next.dataset.reviewHref ?? next.href;
    next.textContent = unfinished ? `${isEnglish ? "Next: " : "下一步："}${unfinished.textContent}` : (isEnglish ? "Review certification gaps" : "下一步：回看认证覆盖缺口");
    const message = document.querySelector<HTMLElement>("[data-roadmap-message]");
    if (message) message.textContent = unfinished ? "" : (isEnglish ? "All introductory lessons are marked complete. This is not a certification or exam-readiness claim." : "入门课程均已标记完成；这不代表已获认证或考试就绪。");
  }
  roadmapLinks.forEach((link) => link.dataset.complete = String(Boolean(progress[link.dataset.roadmapLesson || ""])));
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
      button.setAttribute("aria-label", button.textContent);
    });
  };
  const applyPreference = () => {
    let stored: string | null = null;
    try {
      stored = storage?.getItem(motionKey) ?? null;
    } catch (error) {
      progressWarning = labels.motionReadError;
      console.warn("Learning Atlas could not read the motion preference.", error);
      renderProgress();
    }
    const paused = preference.matches || stored === "paused";
    document.documentElement.dataset.motion = paused ? "paused" : "running";
    setButtons(paused, preference.matches);
    document.dispatchEvent(new Event("atlas:motion-change"));
  };
  preference.addEventListener("change", applyPreference);
  applyPreference();
  buttons.forEach((button) => button.addEventListener("click", () => {
    const paused = document.documentElement.dataset.motion !== "paused";
    document.documentElement.dataset.motion = paused ? "paused" : "running";
    try {
      if (!storage) throw new Error("Local storage is unavailable");
      storage.setItem(motionKey, paused ? "paused" : "running");
    } catch (error) {
      progressWarning = labels.motionError;
      console.warn("Learning Atlas could not save the motion preference.", error);
      renderProgress();
    }
    setButtons(paused);
    document.dispatchEvent(new Event("atlas:motion-change"));
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
    const update = () => {
      const target = new URL(link.href);
      target.search = window.location.search;
      target.hash = localizeFragment(window.location.hash, isEnglish ? "zh" : "en");
      link.href = target.toString();
    };
    update();
    link.addEventListener("click", update);
    link.addEventListener("pointerdown", update);
    link.addEventListener("focus", update);
    window.addEventListener("hashchange", update);
  });
}

function setupReveal() {
  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!elements.length) return;
  const showAll = () => elements.forEach((element) => { element.dataset.revealed = "true"; });
  if (!("IntersectionObserver" in window)) {
    showAll();
    return;
  }
  if (document.documentElement.dataset.motion === "paused") showAll();
  document.addEventListener("atlas:motion-change", () => {
    if (document.documentElement.dataset.motion === "paused") showAll();
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      (entry.target as HTMLElement).dataset.revealed = "true";
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  elements.forEach((element) => {
    observer.observe(element);
    element.dataset.revealReady = "true";
  });
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
    let activePointer: number | null = null;
    let didDrag = false;
    let dragEndedAt = -1;
    const cards = [...track.querySelectorAll<HTMLElement>("[data-gallery-card]")];
    cards.forEach((card) => {
      card.setAttribute("draggable", "false");
      card.addEventListener("dragstart", (event) => event.preventDefault());
    });
    const cardTarget = (card: HTMLElement) => Math.max(0, Math.min(
      track.scrollWidth - track.clientWidth,
      card.offsetLeft - (cards[0]?.offsetLeft ?? 0) - (track.clientWidth - card.offsetWidth) / 2
    ));
    const currentCard = () => cards.reduce((best, card, idx) => {
      const delta = Math.abs(cardTarget(card) - track.scrollLeft);
      return delta < best.delta ? { idx, delta } : best;
    }, { idx: 0, delta: Number.POSITIVE_INFINITY }).idx;
    const updateIndex = () => {
      if (!index || !cards.length) return;
      const current = currentCard();
      index.textContent = `${current + 1}/${cards.length}`;
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === cards.length - 1;
    };
    const scrollByCard = (direction: number) => {
      const card = cards[Math.max(0, Math.min(cards.length - 1, currentCard() + direction))];
      if (!card) return;
      track.scrollTo({ left: cardTarget(card), behavior: document.documentElement.dataset.motion === "paused" ? "auto" : "smooth" });
    };
    prev?.addEventListener("click", () => scrollByCard(-1));
    next?.addEventListener("click", () => scrollByCard(1));
    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        scrollByCard(event.key === "ArrowLeft" ? -1 : 1);
      }

    });
    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      startX = event.clientX;
      startY = event.clientY;
      startScroll = track.scrollLeft;
      activePointer = event.pointerId;
      didDrag = false;
    });
    track.addEventListener("pointermove", (event) => {
      if (activePointer !== event.pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!didDrag && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) {
        activePointer = null;
        return;
      }
      if (!didDrag && Math.abs(dx) > 8) {
        didDrag = true;
        track.setPointerCapture(event.pointerId);
        track.style.scrollSnapType = "none";
        track.dataset.dragging = "true";
        document.documentElement.dataset.cursorLabel = labels.drag;
      }
      if (didDrag) {
        event.preventDefault();
        track.scrollLeft = startScroll - dx;
      }
    });
    const finishDrag = () => {
      if (didDrag) dragEndedAt = performance.now();
      if (activePointer !== null && track.hasPointerCapture(activePointer)) track.releasePointerCapture(activePointer);
      activePointer = null;
      track.style.removeProperty("scroll-snap-type");
      delete track.dataset.dragging;
      document.documentElement.dataset.cursorLabel = labels.open;
    };
    track.addEventListener("pointerup", finishDrag);
    track.addEventListener("pointercancel", finishDrag);
    window.addEventListener("blur", finishDrag);
    track.addEventListener("click", (event) => {
      if (didDrag && performance.now() - dragEndedAt < 350) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    track.addEventListener("scroll", updateIndex, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(updateIndex).observe(track);
    updateIndex();
  });
}

function setupStageDialogs() {
  let restoreFocus: HTMLElement | null = null;
  document.querySelectorAll<HTMLButtonElement>("[data-dialog-open]").forEach((button) => {
    const dialog = document.getElementById(button.dataset.dialogOpen || "");
    if (!(dialog instanceof HTMLDialogElement)) return;
    button.addEventListener("click", () => {
      restoreFocus = button;
      if (!dialog.open) dialog.showModal();
      button.setAttribute("aria-expanded", "true");
      dialog.querySelector<HTMLElement>("button,a")?.focus();
    });
    dialog.addEventListener("close", () => {
      button.setAttribute("aria-expanded", "false");
      restoreFocus?.focus();
      restoreFocus = null;
    });
    dialog.addEventListener("click", (event) => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) {
        dialog.close();
      }
    });
  });
}

function setupStage() {
  document.querySelectorAll<HTMLElement>("[data-stage]").forEach((stage) => {
    const track = stage.querySelector<HTMLElement>("[data-stage-track]");
    const cards = [...stage.querySelectorAll<HTMLElement>("[data-stage-card]")];
    cards.forEach((card) => {
      card.setAttribute("draggable", "false");
      card.addEventListener("dragstart", (event) => event.preventDefault());
    });
    const prev = stage.querySelector<HTMLButtonElement>("[data-stage-prev]");
    const next = stage.querySelector<HTMLButtonElement>("[data-stage-next]");
    const count = stage.querySelector<HTMLElement>("[data-stage-count]");
    const canvas = stage.querySelector<HTMLCanvasElement>("[data-stage-canvas]");
    const modeButtons = [...stage.querySelectorAll<HTMLButtonElement>("[data-stage-mode]")];
    const indexItems = [...stage.querySelectorAll<HTMLElement>("[data-stage-index-item]")];
    if (!track || !cards.length) return;

    let metrics = stageCardMetrics(stage.clientWidth || window.innerWidth, stage.clientHeight || window.innerHeight);
    let position = 0;
    let target = 0;
    let velocity = 0;
    let activePointer: number | null = null;
    let startX = 0;
    let startY = 0;
    let startTarget = 0;
    let lastX = 0;
    let lastPointerAt = 0;
    let dragged = false;
    let dragEndedAt = -1;
    let raf = 0;
    let lastFrame = performance.now();
    let pointerX = 0;
    let pointerY = 0;
    let cameraX = 0;
    let cameraY = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    const context = canvas?.getContext("2d") ?? null;
    if (canvas && !context) console.warn("Learning Atlas stage canvas is unavailable; CSS perspective floor is used.");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mobile = () => window.matchMedia("(max-width: 719px), (pointer: coarse)").matches;
    const maxOffset = () => targetOffsetForIndex(cards.length - 1, cards.length, metrics);
    const clampOffset = (value: number) => Math.max(0, Math.min(maxOffset(), value));
    const currentIndex = () => indexFromOffset(position, cards.length, metrics);
    const targetIndex = () => indexFromOffset(target, cards.length, metrics);
    const paused = () => document.documentElement.dataset.motion === "paused" || reduced.matches;

    const updateUrl = (idx: number) => {
      const slug = cards[idx]?.dataset.slug;
      if (!slug) return;
      const url = new URL(window.location.href);
      if (url.searchParams.get("work") === slug) return;
      url.searchParams.set("work", slug);
      history.replaceState(null, "", url);
      document.querySelectorAll<HTMLAnchorElement>("[data-lang-switch]").forEach((link) => {
        const destination = new URL(link.href);
        destination.search = url.search;
        link.href = destination.toString();
      });
    };
    const drawFloor = () => {
      if (!canvas || !context) return;
      const box = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(box.width * dpr));
      const height = Math.max(1, Math.floor(box.height * dpr));
      if (canvasWidth !== width || canvasHeight !== height) {
        canvas.width = width;
        canvas.height = height;
        canvasWidth = width;
        canvasHeight = height;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, box.width, box.height);
      const styles = getComputedStyle(stage);
      context.strokeStyle = styles.getPropertyValue("--stage-line").trim() || styles.getPropertyValue("--cp-border").trim();
      for (const segment of perspectiveGrid(box.width, box.height, 15, 9)) {
        context.beginPath();
        context.moveTo(segment.x1 + position * -0.018 + cameraX * 0.2, segment.y1 + cameraY * 0.2);
        context.lineTo(segment.x2 + position * -0.06 + cameraX, segment.y2 + cameraY);
        context.stroke();
      }
      context.strokeStyle = styles.getPropertyValue("--stage-line-strong").trim() || styles.getPropertyValue("--cp-border-strong").trim();
      context.beginPath();
      context.moveTo(box.width * 0.12 + cameraX * 0.2, box.height * 0.48 + cameraY * 0.2);
      context.lineTo(box.width * 0.88 + cameraX * 0.2, box.height * 0.48 + cameraY * 0.2);
      context.stroke();
    };
    const render = () => {
      stage.dataset.stageMobile = String(mobile());
      stage.style.setProperty("--stage-card-w", `${metrics.cardWidth.toFixed(2)}px`);
      stage.style.setProperty("--stage-card-h", `${metrics.cardHeight.toFixed(2)}px`);
      stage.style.setProperty("--stage-gap", `${metrics.gap.toFixed(2)}px`);
      if (!mobile()) {
        cards.forEach((card, idx) => {
          const relative = idx * (metrics.cardWidth + metrics.gap) - position;
          const ratio = relative / Math.max(metrics.cardWidth, 1);
          const abs = Math.abs(ratio);
          card.style.setProperty("--stage-x", `${relative.toFixed(2)}px`);
          card.style.setProperty("--stage-z", `${(-Math.min(abs, 2.4) * 88).toFixed(2)}px`);
          card.style.setProperty("--stage-ry", `${Math.max(-13, Math.min(13, -ratio * 7 - velocity * 0.012)).toFixed(2)}deg`);
          card.style.setProperty("--stage-opacity", `${Math.max(0.24, 1 - abs * 0.22).toFixed(3)}`);
        });
      }
      const idx = currentIndex();
      if (count) count.textContent = `${idx + 1}/${cards.length}`;
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === cards.length - 1;
      indexItems.forEach((item, itemIndex) => {
        if (itemIndex === idx) item.setAttribute("aria-current", "true");
        else item.removeAttribute("aria-current");
      });
      stage.style.setProperty("--stage-camera", `${(position * -0.028 + cameraX).toFixed(2)}px`);
      stage.style.setProperty("--stage-camera-y", `${cameraY.toFixed(2)}px`);
      stage.style.setProperty("--stage-curve", `${(velocity * 0.01).toFixed(2)}deg`);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const frame = (now: number) => {
      if (document.hidden || stage.dataset.stageView === "full") {
        stop();
        return;
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - lastFrame) / 1000));
      lastFrame = now;
      if (paused()) {
        position = target;
        velocity = 0;
        cameraX = 0;
        cameraY = 0;
      } else if (!activePointer) {
        if (Math.abs(velocity) > 0.01) {
          target = clampOffset(target + velocity * dt * 60);
          velocity *= Math.pow(0.86, dt * 60);
        } else {
          target = targetOffsetForIndex(targetIndex(), cards.length, metrics);
        }
        position += (target - position) * Math.min(1, 0.18 * dt * 60);
      } else {
        position += (target - position) * Math.min(1, 0.36 * dt * 60);
      }
      if (!paused()) {
        cameraX += (pointerX - cameraX) * Math.min(1, dt * 10);
        cameraY += (pointerY - cameraY) * Math.min(1, dt * 10);
      }
      render();
      drawFloor();
      updateUrl(currentIndex());
      if (Math.abs(target - position) < 0.08 && Math.abs(velocity) < 0.02 && Math.abs(pointerX - cameraX) < 0.05 && Math.abs(pointerY - cameraY) < 0.05 && !activePointer) {
        position = target;
        render();
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && !mobile() && !document.hidden && stage.dataset.stageView !== "full") {
        lastFrame = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const moveTo = (idx: number) => {
      target = targetOffsetForIndex(idx, cards.length, metrics);
      velocity = 0;
      updateUrl(targetIndex());
      if (mobile()) {
        const card = cards[targetIndex()];
        track.scrollTo({ top: card.offsetTop, behavior: "instant" });
      } else if (paused()) {
        position = target;
        render();
        drawFloor();
      } else start();
    };
    const resize = () => {
      stop();
      const idx = currentIndex();
      metrics = stageCardMetrics(stage.clientWidth || window.innerWidth, stage.clientHeight || window.innerHeight);
      if (mobile()) {
        const width = cards[0]?.offsetWidth ?? metrics.cardWidth;
        const height = cards[0]?.offsetHeight ?? metrics.cardHeight;
        metrics = { ...metrics, cardWidth: width, cardHeight: height };
      }
      target = targetOffsetForIndex(idx, cards.length, metrics);
      position = target;
      render();
      drawFloor();
      if (mobile()) track.scrollTo({ top: cards[idx].offsetTop, behavior: "instant" });
    };

    prev?.addEventListener("click", () => moveTo(targetIndex() - 1));
    next?.addEventListener("click", () => moveTo(targetIndex() + 1));
    indexItems.forEach((item, idx) => item.addEventListener("click", () => moveTo(idx)));
    let keyboardInput = false;
    document.addEventListener("keydown", (event) => {
      if (["Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) keyboardInput = true;
    });
    document.addEventListener("pointerdown", () => { keyboardInput = false; });
    track.addEventListener("focusin", (event) => {
      if (!keyboardInput) return;
      const card = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-stage-card]") : null;
      if (card) moveTo(cards.indexOf(card));
    });
    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        moveTo(targetIndex() + (event.key === "ArrowLeft" ? -1 : 1));
      }
    });
    track.addEventListener("wheel", (event) => {
      if (mobile()) return;
      event.preventDefault();
      const delta = normalizedWheelDelta(event);
      target = clampOffset(target + delta * 1.05);
      velocity += delta * 0.06;
      if (paused()) {
        velocity = 0;
        position = target;
        render();
        drawFloor();
        updateUrl(currentIndex());
      } else start();
    }, { passive: false });
    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0 || mobile()) return;
      activePointer = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      lastX = event.clientX;
      lastPointerAt = performance.now();
      startTarget = target;
      dragged = false;
      track.dataset.dragging = "true";
    });
    track.addEventListener("pointermove", (event) => {
      if (activePointer !== event.pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!dragged && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) {
        activePointer = null;
        return;
      }
      if (!dragged && Math.abs(dx) > 6) {
        dragged = true;
        track.setPointerCapture(event.pointerId);
      }
      if (!dragged) return;
      event.preventDefault();
      const now = performance.now();
      velocity = ((lastX - event.clientX) / Math.max(8, now - lastPointerAt)) * 16;
      lastX = event.clientX;
      lastPointerAt = now;
      target = clampOffset(startTarget - dx);
      start();
    });
    const finishDrag = () => {
      if (dragged) dragEndedAt = performance.now();
      if (activePointer !== null && track.hasPointerCapture(activePointer)) track.releasePointerCapture(activePointer);
      activePointer = null;
      delete track.dataset.dragging;
      start();
    };
    track.addEventListener("pointerup", finishDrag);
    track.addEventListener("pointercancel", finishDrag);
    window.addEventListener("blur", finishDrag);
    track.addEventListener("scroll", () => {
      if (!mobile()) return;
      const index = cards.reduce((best, card, idx) => {
        const distance = Math.abs(card.offsetTop - track.scrollTop);
        return distance < best.distance ? { idx, distance } : best;
      }, { idx: 0, distance: Infinity }).idx;
      position = target = targetOffsetForIndex(index, cards.length, metrics);
      render();
      drawFloor();
      updateUrl(index);
    }, { passive: true });
    stage.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !fine.matches || mobile() || paused()) return;
      const box = stage.getBoundingClientRect();
      pointerX = (event.clientX / box.width - 0.5) * 36;
      pointerY = (event.clientY / box.height - 0.5) * 18;
      start();
    }, { passive: true });
    stage.addEventListener("pointerleave", () => {
      pointerX = pointerY = 0;
      start();
    });
    track.addEventListener("click", (event) => {
      if (dragged && performance.now() - dragEndedAt < 350) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const full = button.dataset.stageMode === "full";
        stage.dataset.stageView = full ? "full" : "featured";
        track.inert = full;
        const gallery = stage.querySelector<HTMLElement>("[data-stage-gallery]");
        if (gallery) gallery.inert = full;
        const indexView = stage.querySelector<HTMLElement>("[data-stage-index]");
        if (indexView) indexView.inert = !full;
        const url = new URL(location.href);
        if (full) url.searchParams.set("view", "full");
        else url.searchParams.delete("view");
        history.replaceState(null, "", url);
        if (full) stop();
        else start();
        modeButtons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
      });
    });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else resize(); });
    document.addEventListener("atlas:motion-change", () => {
      velocity = 0;
      if (paused()) {
        stop();
        pointerX = pointerY = cameraX = cameraY = 0;
        position = target;
        render();
        drawFloor();
      } else start();
    });
    reduced.addEventListener("change", resize);
    const requested = new URLSearchParams(window.location.search).get("work");
    const requestedIndex = requested ? cards.findIndex((card) => card.dataset.slug === requested) : -1;
    const initial = requestedIndex >= 0 ? requestedIndex : (mobile() ? 0 : Math.min(1, cards.length - 1));
    position = target = targetOffsetForIndex(initial, cards.length, metrics);
    resize();
    moveTo(initial);
    const indexView = stage.querySelector<HTMLElement>("[data-stage-index]");
    if (indexView) indexView.inert = true;
    if (new URLSearchParams(location.search).get("view") === "full") {
      modeButtons.find((button) => button.dataset.stageMode === "full")?.click();
    }
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
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cards = document.querySelectorAll<HTMLElement>("[data-tilt]");
  const reset = () => cards.forEach((card) => {
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
  document.addEventListener("atlas:motion-change", reset);
  fine.addEventListener("change", reset);
  reduce.addEventListener("change", reset);
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !fine.matches || reduce.matches || document.documentElement.dataset.motion === "paused") return;
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

function setupMagnetic() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const elements = document.querySelectorAll<HTMLElement>(".magnetic");
  const reset = () => elements.forEach((element) => element.style.removeProperty("transform"));
  document.addEventListener("atlas:motion-change", reset);
  fine.addEventListener("change", reset);
  elements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !fine.matches || document.documentElement.dataset.motion === "paused") return;
      const box = element.getBoundingClientRect();
      const x = Math.max(-4, Math.min(4, (event.clientX - box.left - box.width / 2) * 0.1));
      const y = Math.max(-4, Math.min(4, (event.clientY - box.top - box.height / 2) * 0.1));
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    element.addEventListener("pointerleave", () => element.style.removeProperty("transform"));
  });
}

function setupSmoothCursor() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cursor = document.createElement("div");
  cursor.className = "smooth-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.append(document.createElement("span"));
  document.body.append(cursor);
  let targetX = -100;
  let targetY = -100;
  let state = { x: targetX, y: targetY, vx: 0, vy: 0 };
  let pointerPresent = false;
  let raf = 0;
  let last = performance.now();
  const allowed = () => fine.matches && !reduce.matches && !document.hidden && document.documentElement.dataset.motion !== "paused";
  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    pointerPresent = false;
    cursor.classList.remove("active");
  };
  const step = (now: number) => {
    if (!allowed() || !pointerPresent) {
      stop();
      return;
    }
    state = advanceSpring(state, { x: targetX, y: targetY }, Math.max(0, (now - last) / 1000));
    last = now;
    cursor.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
    if (springSettled(state, { x: targetX, y: targetY })) {
      state = { x: targetX, y: targetY, vx: 0, vy: 0 };
      cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(step);
  };
  const start = () => {
    if (!raf && allowed() && pointerPresent) {
      last = performance.now();
      raf = requestAnimationFrame(step);
    }
  };
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || !allowed()) {
      stop();
      return;
    }
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("input,textarea,select,[contenteditable]")) {
      stop();
      return;
    }
    const interactive = target?.closest("a,button,[data-gallery-track]") ? document.documentElement.dataset.cursorLabel || labels.open : "";
    cursor.dataset.label = interactive;
    cursor.classList.toggle("has-label", Boolean(interactive));
    cursor.classList.add("active");
    targetX = event.clientX;
    targetY = event.clientY;
    if (!pointerPresent) state = { x: targetX, y: targetY, vx: 0, vy: 0 };
    pointerPresent = true;
    start();
  }, { passive: true });
  window.addEventListener("blur", stop);
  document.documentElement.addEventListener("pointerleave", stop);
  document.addEventListener("visibilitychange", stop);
  document.addEventListener("keydown", (event) => { if (event.key === "Tab") stop(); });
  document.addEventListener("atlas:motion-change", stop);
  fine.addEventListener("change", stop);
  reduce.addEventListener("change", stop);
}

function setupPageTransitions() {
  document.querySelectorAll<HTMLElement>("[data-project-cover][data-project-slug]").forEach((cover) => {
    const slug = cover.dataset.projectSlug;
    if (slug && /^[a-z0-9-]+$/.test(slug)) cover.style.viewTransitionName = `project-${slug}`;
  });
  const handledTransitions = new WeakSet<object>();
  const reportTransition = (error: unknown) => {
    if (error instanceof DOMException && (error.name === "AbortError" || error.name === "InvalidStateError")) {
      console.debug("View transition skipped for reduced motion.", error.name);
    } else console.error("View transition failed.", error);
  };
  const skipPausedTransition = (event: Event) => {
    if (document.documentElement.dataset.motion !== "paused") return;
    if ("viewTransition" in event) {
      const transition = event.viewTransition;
      if (transition && typeof transition === "object" && "skipTransition" in transition && typeof transition.skipTransition === "function") {
        if (handledTransitions.has(transition)) return;
        handledTransitions.add(transition);
        if ("ready" in transition && transition.ready instanceof Promise) void transition.ready.catch(reportTransition);
        if ("finished" in transition && transition.finished instanceof Promise) void transition.finished.catch(reportTransition);
        transition.skipTransition();
      }
    }
  };
  window.addEventListener("pageswap", skipPausedTransition);
  window.addEventListener("pagereveal", skipPausedTransition);
}

function setupAmbientBackground() {
  document.querySelectorAll<HTMLElement>("[data-ambient-background]").forEach((ambient) => {
    const canvas = ambient.querySelector<HTMLCanvasElement>("[data-ambient-canvas]");
    const context = canvas?.getContext("2d") ?? null;
    if (!canvas) return;
    if (!context) console.warn("Learning Atlas ambient canvas is unavailable; CSS perspective floor remains active.");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let raf = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;
    let cameraX = 0;
    let cameraY = 0;
    let scroll = window.scrollY;
    const paused = () => document.documentElement.dataset.motion === "paused" || reduced.matches;
    const draw = () => {
      ambient.style.setProperty("--ambient-x", `${cameraX.toFixed(2)}px`);
      ambient.style.setProperty("--ambient-y", `${cameraY.toFixed(2)}px`);
      if (!context) return;
      const box = ambient.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.max(1, Math.floor(box.width * dpr));
      const nextHeight = Math.max(1, Math.floor(box.height * dpr));
      if (nextWidth !== width || nextHeight !== height) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        width = nextWidth;
        height = nextHeight;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, box.width, box.height);
      const styles = getComputedStyle(ambient);
      context.strokeStyle = styles.getPropertyValue("--cp-border").trim();
      context.lineWidth = 1;
      const scrollOffset = paused() ? 0 : (scroll % 240) * 0.06;
      for (const segment of perspectiveGrid(box.width, box.height, 14, 8)) {
        context.beginPath();
        context.moveTo(segment.x1 + cameraX * 0.18, segment.y1 + cameraY * 0.12 + scrollOffset);
        context.lineTo(segment.x2 + cameraX * 0.8, segment.y2 + cameraY * 0.45 + scrollOffset);
        context.stroke();
      }
      context.strokeStyle = styles.getPropertyValue("--cp-border-strong").trim();
      context.beginPath();
      context.moveTo(box.width * 0.1 + cameraX * 0.15, box.height * 0.45 + cameraY * 0.12);
      context.lineTo(box.width * 0.9 + cameraX * 0.15, box.height * 0.45 + cameraY * 0.12);
      context.stroke();
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const frame = () => {
      if (document.hidden) {
        stop();
        return;
      }
      if (paused()) {
        cameraX = 0;
        cameraY = 0;
      } else {
        cameraX += (pointerX - cameraX) * 0.12;
        cameraY += (pointerY - cameraY) * 0.12;
      }
      draw();
      if (Math.abs(pointerX - cameraX) < 0.05 && Math.abs(pointerY - cameraY) < 0.05) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const reset = () => {
      pointerX = pointerY = cameraX = cameraY = 0;
      stop();
      draw();
    };
    window.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !fine.matches || paused()) return;
      pointerX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 42;
      pointerY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 22;
      start();
    }, { passive: true });
    window.addEventListener("scroll", () => {
      scroll = window.scrollY;
      if (!paused()) start();
      else draw();
    }, { passive: true });
    window.addEventListener("resize", draw, { passive: true });
    document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else draw(); });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("pointerleave", () => {
      pointerX = pointerY = 0;
      start();
    });
    document.addEventListener("atlas:motion-change", reset);
    reduced.addEventListener("change", reset);
    fine.addEventListener("change", reset);
    draw();
  });
}

setupTheme();
setupMenu();
setupMotion();
setupProgress();
setupLabs();
setupFilters();
setupGlobalSearch();
setupSearchQuery();
setupLanguageSwitch();
setupReveal();
setupGallery();
setupStageDialogs();
setupStage();
setupViewToggle();
setupTilt();
setupMagnetic();
setupSmoothCursor();
setupPageTransitions();
setupAmbientBackground();
