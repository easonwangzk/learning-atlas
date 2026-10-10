export const tracks = [
  {
    slug: "compute",
    title: "Compute 计算",
    kicker: "从虚拟机到无服务器",
    summary: "比较 VM、容器、App Service、Functions 的责任边界、伸缩模型与运维成本。",
    certs: ["AZ-104", "AZ-305"],
    motif: "orbits"
  },
  {
    slug: "storage",
    title: "Storage 存储",
    kicker: "对象、文件与恢复",
    summary: "理解 Blob、Files、生命周期、加密、备份与成本层级，服务应用状态与数据治理。",
    certs: ["AZ-104", "AZ-305"],
    motif: "layers"
  },
  {
    slug: "network",
    title: "Network 网络",
    kicker: "分段、私有连接与边缘",
    summary: "从 VNet、DNS、Private Link 到 ExpressRoute 与 Front Door，建立可观察的安全路径。",
    certs: ["AZ-700", "AZ-305"],
    motif: "mesh"
  },
  {
    slug: "database",
    title: "Database 数据库",
    kicker: "关系、文档与检索",
    summary: "选择 Azure SQL、Cosmos DB、Azure AI Search，并设计备份、索引、权限和可用性。",
    certs: ["AZ-104", "AZ-305"],
    motif: "grid"
  },
  {
    slug: "ai",
    title: "AI 人工智能",
    kicker: "RAG、Agent 与多模态",
    summary: "把检索、引用、函数工具、人工接管与多模态输入放进负责任的应用架构。",
    certs: ["扩展学习", "AZ-305"],
    motif: "graph"
  },
  {
    slug: "ml",
    title: "ML 机器学习",
    kicker: "数据、评估与 MLOps",
    summary: "区分回归、分类、评估、漂移与部署流水线；Azure ML 是补充，不等同三门 AZ 考试。",
    certs: ["扩展学习"],
    motif: "curve"
  }
] as const;

export type TrackSlug = (typeof tracks)[number]["slug"];

export function getTrack(slug: string) {
  return tracks.find((track) => track.slug === slug);
}
