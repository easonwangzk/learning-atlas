import { withBase } from "@/lib/paths";
import { projects } from "@/data/projects";
import { resources } from "@/data/resources";

const lessonItems = [
  ["lesson", "VM 基础：责任边界、身份与观测", "IaaS 运维责任、RBAC、Azure Monitor 与成本边界。", "/learn/compute/vm-basics/", ["compute", "AZ-104"]],
  ["lesson", "Container Apps：修订、伸缩与最小平台面", "托管容器、修订、KEDA、身份和日志。", "/learn/compute/container-apps/", ["compute", "AZ-305"]],
  ["lesson", "Serverless 运维：触发器、冷启动与成本护栏", "Functions 触发器、幂等、重试、冷启动和预算。", "/learn/compute/serverless-operations/", ["compute"]],
  ["lesson", "Blob 生命周期：层级、访问与保留", "对象存储层级、生命周期、SAS、RBAC 和治理。", "/learn/storage/blob-lifecycle/", ["storage", "AZ-104"]],
  ["lesson", "Azure Files：共享文件与身份边界", "SMB/NFS、混合访问、权限模型与迁移盘点。", "/learn/storage/files-identity/", ["storage", "AZ-104"]],
  ["lesson", "备份与连续性：从恢复目标倒推", "RPO/RTO、备份、复制、演练和恢复权限。", "/learn/storage/backup-continuity/", ["storage", "AZ-305"]],
  ["lesson", "VNet 分段：子网、路由与最小暴露", "VNet、NSG、路由和网络观测基础。", "/learn/network/vnet-segmentation/", ["network", "AZ-700"]],
  ["lesson", "Private Link 与 DNS：私有访问不只是一个端点", "私有终结点、专用 DNS、解析路径和 PaaS 保护。", "/learn/network/private-link-dns/", ["network", "AZ-700"]],
  ["lesson", "边缘与混合网络：Front Door、ExpressRoute 与故障域", "全球入口、专线、多区域和混合依赖。", "/learn/network/edge-hybrid/", ["network", "AZ-700"]],
  ["lesson", "Azure SQL：托管关系数据库的日常设计", "关系数据库、身份、备份、审计和性能。", "/learn/database/azure-sql-operations/", ["database", "AZ-305"]],
  ["lesson", "Cosmos DB：分区、一致性与吞吐", "分区键、RU、一致性和全球复制权衡。", "/learn/database/cosmos-design/", ["database", "AZ-305"]],
  ["lesson", "Azure AI Search：索引、向量与引用", "搜索索引、向量检索、RAG 引用和权限裁剪。", "/learn/database/search-indexes/", ["database", "RAG"]],
  ["lesson", "RAG：检索增强生成与可追溯答案", "检索、重排、上下文、引用和拒答策略。", "/learn/ai/rag-grounding/", ["ai", "RAG"]],
  ["lesson", "Agent 与人工接管：工具、记忆和边界", "函数工具、用户偏好、会话状态和 handoff。", "/learn/ai/agent-handoff/", ["ai", "agent"]],
  ["lesson", "多模态应用：文本、图像、语音与异步流程", "多模态输入治理、异步任务和成本控制。", "/learn/ai/multimodal-patterns/", ["ai", "multimodal"]],
  ["lesson", "数据划分与基线：机器学习从问题定义开始", "训练验证测试、数据泄漏和简单基线。", "/learn/ml/data-split-baseline/", ["ml"]],
  ["lesson", "分类评估：准确率之外的取舍", "混淆矩阵、精确率、召回率、阈值和业务成本。", "/learn/ml/classification-evaluation/", ["ml"]],
  ["lesson", "MLOps 监控：从模型文件到可维护系统", "模型注册、漂移、反馈、回滚和人工复核。", "/learn/ml/mlops-monitoring/", ["ml"]]
] as const;

export const searchIndex = [
  ...lessonItems.map(([kind, title, summary, href, tags]) => ({ kind, title, summary, href: withBase(href), tags })),
  ...projects.map((project) => ({
    kind: "project",
    title: project.title,
    summary: project.summary,
    href: withBase(`/projects/${project.slug}/`),
    tags: project.topics
  })),
  ...resources.map((resource) => ({
    kind: "resource",
    title: resource.title,
    summary: resource.description,
    href: withBase("/resources/"),
    tags: [resource.topic, resource.certification, resource.provider]
  }))
];
