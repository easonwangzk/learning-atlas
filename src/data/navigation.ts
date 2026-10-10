import type { Locale } from "@/i18n";

export type PrimaryNavKey = "KnowledgeMap" | "Learn" | "Certifications" | "Projects" | "Labs" | "Notes" | "Roadmap" | "About";
export type SecondaryNavKey = "Resources" | "Search";
export type NavKey = "Home" | PrimaryNavKey | SecondaryNavKey | "Knowledge";

type Localized = Readonly<Record<Locale, string>>;
export type NavigationChild = Readonly<{ key: string; label: Localized; path: string; purpose: Localized }>;
export type NavigationEntry = Readonly<{ key: PrimaryNavKey | SecondaryNavKey; label: Localized; path: string; purpose: Localized; children: readonly NavigationChild[] }>;

const trackChildren: readonly NavigationChild[] = [
  { key: "compute", label: { zh: "计算", en: "Compute" }, path: "/learn/compute/", purpose: { zh: "VM、容器与无服务器取舍", en: "VM, container, and serverless tradeoffs" } },
  { key: "storage", label: { zh: "存储", en: "Storage" }, path: "/learn/storage/", purpose: { zh: "对象、文件、备份与恢复", en: "Objects, files, backup, and recovery" } },
  { key: "network", label: { zh: "网络", en: "Network" }, path: "/learn/network/", purpose: { zh: "分段、私有连接与边缘入口", en: "Segmentation, private access, and edge entry" } },
  { key: "database", label: { zh: "数据库", en: "Database" }, path: "/learn/database/", purpose: { zh: "关系、文档与检索设计", en: "Relational, document, and search design" } },
  { key: "ai", label: { zh: "人工智能", en: "AI" }, path: "/learn/ai/", purpose: { zh: "RAG、Agent 与多模态应用", en: "RAG, agents, and multimodal applications" } },
  { key: "ml", label: { zh: "机器学习", en: "ML" }, path: "/learn/ml/", purpose: { zh: "数据、评估与 MLOps", en: "Data, evaluation, and MLOps" } }
];

export const primaryNavigation: readonly NavigationEntry[] = [
  { key: "KnowledgeMap", label: { zh: "知识地图", en: "Knowledge Map" }, path: "/knowledge-map/", purpose: { zh: "先看六条知识线如何连接", en: "See how the six learning lines connect" }, children: [] },
  { key: "Learn", label: { zh: "系统学习", en: "Learn" }, path: "/learn/", purpose: { zh: "再按云基础与 AI / ML 路径读课程", en: "Follow cloud foundations and AI / ML courses" }, children: trackChildren },
  { key: "Certifications", label: { zh: "认证路线", en: "Certifications" }, path: "/certifications/", purpose: { zh: "对照官方大纲与本站覆盖缺口", en: "Compare official objectives and site coverage gaps" }, children: [
    { key: "az-104", label: { zh: "AZ-104：部署与管理", en: "AZ-104: Deploy and manage" }, path: "/certifications/az-104/", purpose: { zh: "管理员视角的身份、存储、计算、网络与监控", en: "Administrator view of identity, storage, compute, network, and monitoring" } },
    { key: "az-700", label: { zh: "AZ-700：网络专项", en: "AZ-700: Network specialty" }, path: "/certifications/az-700/", purpose: { zh: "核心网络、连接、交付、私有访问与安全", en: "Core networking, connectivity, delivery, private access, and security" } },
    { key: "az-305", label: { zh: "AZ-305：架构设计与权衡", en: "AZ-305: Architecture design and tradeoffs" }, path: "/certifications/az-305/", purpose: { zh: "治理、数据、连续性与基础设施决策", en: "Governance, data, continuity, and infrastructure decisions" } }
  ] },
  { key: "Projects", label: { zh: "项目案例", en: "Projects" }, path: "/projects/", purpose: { zh: "从公开代码理解实际设计取舍", en: "Read design tradeoffs in public code" }, children: [] },
  { key: "Labs", label: { zh: "实践实验", en: "Labs" }, path: "/labs/", purpose: { zh: "本地运行教学实验，查看结果与图表", en: "Run teaching exercises locally and inspect results" }, children: [
    { key: "compute-capacity", label: { zh: "计算容量", en: "Compute capacity" }, path: "/labs/compute-capacity/", purpose: { zh: "RPS 与 CPU 工作量估算副本数", en: "Estimate replicas from RPS and CPU work" } },
    { key: "storage-recovery", label: { zh: "恢复时间线", en: "Recovery timeline" }, path: "/labs/storage-recovery/", purpose: { zh: "RPO/RTO 与备份恢复阶段", en: "RPO/RTO and recovery phases" } },
    { key: "network-subnet", label: { zh: "子网容量", en: "Subnet capacity" }, path: "/labs/network-subnet/", purpose: { zh: "Azure IPv4 子网可用地址", en: "Azure IPv4 subnet usable addresses" } },
    { key: "database-partition", label: { zh: "分区倾斜", en: "Partition skew" }, path: "/labs/database-partition/", purpose: { zh: "合成键分布与最大分区占比", en: "Synthetic key distribution and max share" } },
    { key: "ai-retrieval", label: { zh: "检索指标", en: "Retrieval metrics" }, path: "/labs/ai-retrieval/", purpose: { zh: "Recall@k 与 MRR 的玩具评估", en: "Toy Recall@k and MRR evaluation" } },
    { key: "ml-confusion-matrix", label: { zh: "混淆矩阵", en: "Confusion matrix" }, path: "/labs/ml-confusion-matrix/", purpose: { zh: "Precision、Recall、F1、Accuracy", en: "Precision, recall, F1, and accuracy" } }
  ] },
  { key: "Notes", label: { zh: "知识笔记", en: "Notes" }, path: "/notes/", purpose: { zh: "查术语、读短笔记、避开常见误区", en: "Look up terms, short notes, and common pitfalls" }, children: [] },
  { key: "Roadmap", label: { zh: "学习路线图", en: "Roadmap" }, path: "/roadmap/", purpose: { zh: "查看自己的进度，明确下一课", en: "Check your progress and choose the next lesson" }, children: [] },
  { key: "About", label: { zh: "关于作者", en: "About" }, path: "/about/", purpose: { zh: "个人介绍、公开账号与本站边界", en: "Author, public profiles, and site boundaries" }, children: [] }
];

export const secondaryNavigation: readonly NavigationEntry[] = [
  { key: "Resources", label: { zh: "资料索引", en: "Resources" }, path: "/resources/", purpose: { zh: "官方文档与开源课程", en: "Official documentation and open courses" }, children: [] },
  { key: "Search", label: { zh: "全站搜索", en: "Search" }, path: "/search/", purpose: { zh: "搜索课程、项目、实验和笔记", en: "Search lessons, projects, labs, and notes" }, children: [] }
];

export const allNavigation = [...primaryNavigation, ...secondaryNavigation] as const;

export function navLabel(key: NavKey, locale: Locale): string {
  if (key === "Home") return locale === "en" ? "Home" : "首页";
  if (key === "Knowledge") return locale === "en" ? "Learn" : "系统学习";
  const entry = allNavigation.find((item) => item.key === key);
  return entry ? entry.label[locale] : key;
}

export function localizeNavPath(path: string, locale: Locale): string {
  if (locale === "zh") return path;
  return path === "/" ? "/en/" : `/en${path}`;
}
