export const tracks = [
  {
    slug: "compute",
    title: { zh: "计算", en: "Compute" },
    kicker: { zh: "从虚拟机到无服务器", en: "From virtual machines to serverless" },
    summary: {
      zh: "比较 VM、容器、App Service、Functions 的责任边界、伸缩模型与运维成本。",
      en: "Compare the responsibility boundaries, scaling models, and operations cost of VMs, containers, App Service, and Functions."
    },
    certs: ["AZ-104", "AZ-305"],
    motif: "planes"
  },
  {
    slug: "storage",
    title: { zh: "存储", en: "Storage" },
    kicker: { zh: "对象、文件与恢复", en: "Objects, files, and recovery" },
    summary: {
      zh: "理解 Blob、Files、生命周期、加密、备份与成本层级，服务应用状态与数据治理。",
      en: "Understand Blob, Files, lifecycle rules, encryption, backup, and cost tiers for application state and data governance."
    },
    certs: ["AZ-104", "AZ-305"],
    motif: "layers"
  },
  {
    slug: "network",
    title: { zh: "网络", en: "Network" },
    kicker: { zh: "分段、私有连接与边缘", en: "Segmentation, private access, and edge" },
    summary: {
      zh: "从 VNet、DNS、Private Link 到 ExpressRoute 与 Front Door，建立可观察的安全路径。",
      en: "Build observable secure paths across VNet, DNS, Private Link, ExpressRoute, and Front Door."
    },
    certs: ["AZ-700", "AZ-305"],
    motif: "mesh"
  },
  {
    slug: "database",
    title: { zh: "数据库", en: "Database" },
    kicker: { zh: "关系、文档与检索", en: "Relational, document, and search" },
    summary: {
      zh: "选择 Azure SQL、Cosmos DB、Azure AI Search，并设计备份、索引、权限和可用性。",
      en: "Choose Azure SQL, Cosmos DB, and Azure AI Search while designing backup, indexing, permissions, and availability."
    },
    certs: ["AZ-305", "扩展学习"],
    motif: "grid"
  },
  {
    slug: "ai",
    title: { zh: "人工智能", en: "AI" },
    kicker: { zh: "RAG、Agent 与多模态", en: "RAG, agents, and multimodal input" },
    summary: {
      zh: "把检索、引用、函数工具、人工接管与多模态输入放进负责任的应用架构。",
      en: "Place retrieval, citations, function tools, human handoff, and multimodal input inside responsible application architecture."
    },
    certs: ["扩展学习"],
    motif: "graph"
  },
  {
    slug: "ml",
    title: { zh: "机器学习", en: "ML" },
    kicker: { zh: "数据、评估与 MLOps", en: "Data, evaluation, and MLOps" },
    summary: {
      zh: "区分回归、分类、评估、漂移与部署流水线；Azure ML 是补充，不等同三门 AZ 考试。",
      en: "Separate regression, classification, evaluation, drift, and deployment pipelines; Azure ML is supplementary, not complete AZ exam coverage."
    },
    certs: ["扩展学习"],
    motif: "curve"
  }
] as const;

export type TrackSlug = (typeof tracks)[number]["slug"];

export function getTrack(slug: string) {
  return tracks.find((track) => track.slug === slug);
}

export function trackText(track: (typeof tracks)[number], locale: "zh" | "en") {
  return {
    ...track,
    title: track.title[locale],
    kicker: track.kicker[locale],
    summary: track.summary[locale]
  };
}
