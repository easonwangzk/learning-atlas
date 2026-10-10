export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export const ui = {
  zh: {
    lang: "zh-CN",
    dir: "ltr",
    localeName: "中文",
    switchLabel: "English",
    skip: "跳到主要内容",
    navLabel: "全站导航",
    menu: "菜单",
    theme: "切换明暗主题",
    motionPause: "暂停动画",
    motionPlay: "播放动画",
    motionReduced: "已减少动画",
    nav: {
      Home: "首页",
      Knowledge: "知识",
      Projects: "项目",
      Resources: "资源",
      About: "关于",
      Search: "搜索"
    },
    footerOne: "静态学习网站。进度只保存在浏览器本地；无后端、无外部模型调用、无跨设备同步。",
    footerTwo: "个人学习笔记与公开项目索引，非 Microsoft、OpenAI 或其他机构的官方课程。",
    aboutSource: "关于与来源",
    read: "阅读",
    open: "打开",
    drag: "拖动",
    countItems: (visible: number, total: number) => `${visible} / ${total} 项`,
    countResults: (visible: number) => `${visible} 条结果`,
    progressReadError: "无法读取本地进度：存储不可用或数据格式错误。原记录未删除；内容仍可阅读。",
    progressSaveError: "进度未能保存到本浏览器，仅在当前页面暂存，刷新后可能丢失。",
    progressSyncError: "另一页面的进度数据格式错误，当前进度未被覆盖。",
    progressDone: "已完成：点击取消",
    progressTodo: "标记本课完成",
    progressReset: "确定清空本浏览器的 Learning Atlas 完成进度？",
    themeSaveError: "主题已切换，但浏览器未允许保存偏好。",
    all: "全部",
    clearFilters: "清空筛选",
    noProject: "没有匹配项目。请重置筛选或换一个关键词。",
    noResource: "没有匹配资源。请清空筛选或换一个关键词。",
    noSearch: "没有匹配结果。试试更短的关键词，或清空搜索。",
    noJsProgress: "开启 JavaScript 后可保存本浏览器的学习进度。",
    noJsSearch: "JavaScript 未开启，以下仍可浏览全部课程、案例和资源。",
    reviewed: "整理于",
    courseKind: "课程",
    projectKind: "项目",
    resourceKind: "资源",
    difficulty: { "入门": "入门", "进阶": "进阶" },
    cert: { "扩展学习": "扩展学习", "通用": "通用" },
    resourceTypes: { "认证指南": "认证指南", "文档": "文档", "框架": "框架", "训练": "训练", "课程": "课程", "教程": "教程" }
  },
  en: {
    lang: "en",
    dir: "ltr",
    localeName: "English",
    switchLabel: "中文",
    skip: "Skip to main content",
    navLabel: "Site navigation",
    menu: "Menu",
    theme: "Toggle color theme",
    motionPause: "Pause motion",
    motionPlay: "Resume motion",
    motionReduced: "Reduced motion",
    nav: {
      Home: "Home",
      Knowledge: "Knowledge",
      Projects: "Projects",
      Resources: "Resources",
      About: "About",
      Search: "Search"
    },
    footerOne: "A static learning site. Progress is stored only in this browser; no backend, model calls, or cross-device sync.",
    footerTwo: "Personal study notes and public project indexes, not official courses from Microsoft, OpenAI, or other organizations.",
    aboutSource: "About and sources",
    read: "Read",
    open: "Open",
    drag: "Drag",
    countItems: (visible: number, total: number) => `${visible} / ${total} items`,
    countResults: (visible: number) => `${visible} results`,
    progressReadError: "Local progress could not be read because storage is unavailable or malformed. Existing records were not deleted; content remains readable.",
    progressSaveError: "Progress could not be saved in this browser and is only temporary until refresh.",
    progressSyncError: "Progress from another page was malformed, so the current state was not overwritten.",
    progressDone: "Completed: click to undo",
    progressTodo: "Mark this lesson complete",
    progressReset: "Clear all Learning Atlas completion progress in this browser?",
    themeSaveError: "Theme changed, but this browser did not allow saving the preference.",
    all: "All",
    clearFilters: "Clear filters",
    noProject: "No matching projects. Reset filters or try another keyword.",
    noResource: "No matching resources. Clear filters or try another keyword.",
    noSearch: "No matches. Try shorter keywords or clear the search.",
    noJsProgress: "Enable JavaScript to save learning progress in this browser.",
    noJsSearch: "JavaScript is disabled; all lessons, cases, and resources are still listed below.",
    reviewed: "Organized on",
    courseKind: "Lesson",
    projectKind: "Project",
    resourceKind: "Resource",
    difficulty: { "入门": "Beginner", "进阶": "Intermediate" },
    cert: { "扩展学习": "Extended learning", "通用": "General" },
    resourceTypes: { "认证指南": "Study guide", "文档": "Docs", "框架": "Framework", "训练": "Training", "课程": "Course", "教程": "Tutorial" }
  }
} as const;

export function localePrefix(locale: Locale): string {
  return locale === "en" ? "/en" : "";
}

export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "zh") return normalized.replace(/^\/en(?=\/|$)/, "") || "/";
  return normalized.startsWith("/en/") || normalized === "/en" ? normalized : `/en${normalized}`;
}

export function alternatePath(path: string, locale: Locale): string {
  return localizePath(path, locale === "zh" ? "en" : "zh");
}

export function stripLocale(path: string): string {
  return path.replace(/^\/en(?=\/|$)/, "") || "/";
}

