import type { Locale } from "@/i18n";
import { ui } from "@/i18n";

const baseResources = [
  ["Microsoft Learn", "认证指南", "AZ-104", "compute", "AZ-104 study guide", "管理员考试官方学习指南；目标自 2026-04-17 起生效。", "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104"],
  ["Microsoft Learn", "认证指南", "AZ-305", "architecture", "AZ-305 study guide", "解决方案架构考试官方学习指南；目标自 2026-04-17 起生效。", "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-305"],
  ["Microsoft Learn", "认证指南", "AZ-700", "network", "AZ-700 study guide", "网络工程师考试官方学习指南；目标自 2026-07-27 起生效。", "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-700"],
  ["Azure Docs", "文档", "AZ-104", "compute", "Azure Virtual Machines", "虚拟机、可用性、磁盘与运维责任的基础入口。", "https://learn.microsoft.com/zh-cn/azure/virtual-machines/"],
  ["Azure Docs", "文档", "AZ-305", "compute", "Azure Container Apps", "托管容器应用、修订、伸缩与微服务模式入口。", "https://learn.microsoft.com/zh-cn/azure/container-apps/"],
  ["Azure Docs", "文档", "AZ-104", "compute", "Azure App Service", "托管 Web 应用、部署槽与平台运维边界。", "https://learn.microsoft.com/zh-cn/azure/app-service/"],
  ["Azure Docs", "文档", "扩展学习", "compute", "Azure Functions", "事件驱动函数、触发器、绑定与消费模型概览。", "https://learn.microsoft.com/zh-cn/azure/azure-functions/"],
  ["Azure Docs", "文档", "AZ-104", "storage", "Azure Storage", "存储账户、冗余、安全与数据服务总入口。", "https://learn.microsoft.com/zh-cn/azure/storage/"],
  ["Azure Docs", "文档", "AZ-104", "storage", "Blob Storage", "对象存储、层级命名空间、生命周期与访问控制。", "https://learn.microsoft.com/zh-cn/azure/storage/blobs/"],
  ["Azure Docs", "文档", "AZ-104", "storage", "Azure Files", "托管文件共享、SMB/NFS、身份与混合访问入口。", "https://learn.microsoft.com/zh-cn/azure/storage/files/"],
  ["Azure Docs", "文档", "AZ-700", "network", "Azure Virtual Network", "VNet、子网、路由、安全组与私有地址空间基础。", "https://learn.microsoft.com/zh-cn/azure/virtual-network/"],
  ["Azure Docs", "文档", "AZ-700", "network", "Azure DNS", "公共 DNS 区域与记录管理；私有解析需结合专门文档。", "https://learn.microsoft.com/zh-cn/azure/dns/"],
  ["Azure Docs", "文档", "AZ-700", "network", "Azure Private Link", "私有终结点与 PaaS 私有访问的设计入口。", "https://learn.microsoft.com/zh-cn/azure/private-link/"],
  ["Azure Docs", "文档", "AZ-700", "network", "ExpressRoute", "专线连接、路由域与混合网络可靠性学习入口。", "https://learn.microsoft.com/zh-cn/azure/expressroute/"],
  ["Azure Docs", "文档", "AZ-700", "network", "Azure Front Door", "全球入口、WAF、加速与多区域 Web 分发入口。", "https://learn.microsoft.com/zh-cn/azure/frontdoor/"],
  ["Azure Docs", "文档", "AZ-305", "database", "Azure SQL", "关系数据库托管选项、性能、安全与迁移入口。", "https://learn.microsoft.com/zh-cn/azure/azure-sql/"],
  ["Azure Docs", "文档", "AZ-305", "database", "Azure Cosmos DB", "全球分布式 NoSQL、分区、吞吐与一致性入口。", "https://learn.microsoft.com/zh-cn/azure/cosmos-db/"],
  ["Azure Docs", "文档", "扩展学习", "database", "Azure AI Search", "全文检索、向量检索与 RAG 数据面基础入口。", "https://learn.microsoft.com/zh-cn/azure/search/"],
  ["Azure Docs", "文档", "扩展学习", "ai", "Microsoft Foundry", "模型、智能体与企业 AI 应用的官方文档入口。", "https://learn.microsoft.com/zh-cn/azure/foundry/"],
  ["Azure Docs", "文档", "扩展学习", "ml", "Azure Machine Learning", "训练、注册、部署和 MLOps 的 Azure 补充学习入口。", "https://learn.microsoft.com/zh-cn/azure/machine-learning/"],
  ["Azure Docs", "框架", "AZ-305", "architecture", "Azure Well-Architected", "可靠性、安全、成本、运营与性能权衡框架。", "https://learn.microsoft.com/zh-cn/azure/well-architected/"],
  ["Azure Docs", "框架", "AZ-305", "governance", "Cloud Adoption Framework", "云采用、治理、管理与迁移组织方法。", "https://learn.microsoft.com/zh-cn/azure/cloud-adoption-framework/"],
  ["Microsoft Entra", "文档", "AZ-104", "identity", "Microsoft Entra identity", "身份、访问、条件访问与权限边界入口。", "https://learn.microsoft.com/zh-cn/entra/identity/"],
  ["Azure Docs", "文档", "AZ-104", "governance", "Azure Policy", "策略定义、分配、合规状态与治理自动化入口。", "https://learn.microsoft.com/zh-cn/azure/governance/policy/"],
  ["Azure Docs", "文档", "AZ-104", "observability", "Azure Monitor", "指标、日志、警报与可观测性基础入口。", "https://learn.microsoft.com/zh-cn/azure/azure-monitor/"],
  ["Azure Docs", "文档", "AZ-104", "continuity", "Azure Backup", "备份策略、恢复保管库与工作负载保护入口。", "https://learn.microsoft.com/zh-cn/azure/backup/"],
  ["Azure Docs", "文档", "AZ-305", "continuity", "Azure Site Recovery", "灾难恢复、复制和故障转移规划入口。", "https://learn.microsoft.com/zh-cn/azure/site-recovery/"],
  ["Microsoft Learn", "训练", "通用", "all", "Training browse", "按产品、角色和级别浏览官方学习路径。", "https://learn.microsoft.com/zh-cn/training/browse/"],
  ["Hugging Face", "课程", "扩展学习", "ai", "Hugging Face Learn", "通用平台学习入口；非用户个人主页确认链接。", "https://huggingface.co/learn"],
  ["scikit-learn", "文档", "扩展学习", "ml", "scikit-learn User Guide", "传统机器学习、评估与模型选择的开源参考。", "https://scikit-learn.org/stable/user_guide.html"],
  ["PyTorch", "教程", "扩展学习", "ml", "PyTorch Tutorials", "深度学习张量、训练循环与模型示例入口。", "https://docs.pytorch.org/tutorials/"],
  ["OpenAI", "文档", "扩展学习", "ai", "OpenAI API docs", "API 能力与模型使用方式的官方开发者入口。", "https://developers.openai.com/api/docs"]
];

const englishDescriptions = [
  "Official administrator exam study guide; objectives are effective from 2026-04-17.",
  "Official solutions architect exam study guide; objectives are effective from 2026-04-17.",
  "Official network engineer exam study guide; objectives are effective from 2026-07-27.",
  "Entry point for virtual machines, availability, disks, and operations responsibility.",
  "Entry point for managed container apps, revisions, scaling, and microservice patterns.",
  "Managed web apps, deployment slots, and platform operations boundaries.",
  "Overview of event-driven functions, triggers, bindings, and consumption models.",
  "Main entry for storage accounts, redundancy, security, and data services.",
  "Object storage, hierarchical namespace, lifecycle, and access control.",
  "Managed file shares, SMB/NFS, identity, and hybrid access.",
  "VNet, subnet, routing, security groups, and private address-space basics.",
  "Public DNS zones and record management; pair private resolution with dedicated docs.",
  "Design entry for private endpoints and private access to PaaS services.",
  "Dedicated connectivity, routing domains, and hybrid network reliability.",
  "Global entry, WAF, acceleration, and multi-region web delivery.",
  "Managed relational database choices, performance, security, and migration.",
  "Globally distributed NoSQL, partitioning, throughput, and consistency.",
  "Full-text search, vector search, and RAG data-plane basics.",
  "Official documentation for models, agents, and enterprise AI applications.",
  "Supplementary Azure learning for training, registering, deploying, and MLOps.",
  "Reliability, security, cost, operations, and performance tradeoff framework.",
  "Cloud adoption, governance, management, and migration operating model.",
  "Identity, access, conditional access, and permission boundary entry point.",
  "Policy definitions, assignments, compliance state, and governance automation.",
  "Metrics, logs, alerts, and observability fundamentals.",
  "Backup policies, Recovery Services vaults, and workload protection.",
  "Disaster recovery, replication, and failover planning.",
  "Browse official learning paths by product, role, and level.",
  "General platform learning entry, not a confirmed personal profile link.",
  "Open-source reference for classical machine learning, evaluation, and model selection.",
  "Deep-learning tensor, training loop, and model examples.",
  "Official developer entry for API capabilities and model usage."
] as const;

function localizeLearnUrl(url: string, locale: Locale) {
  if (!url.includes("learn.microsoft.com/")) return url;
  return locale === "en" ? url.replace("/zh-cn/", "/en-us/") : url.replace("/en-us/", "/zh-cn/");
}

export function getResources(locale: Locale = "zh") {
  return baseResources.map(([provider, type, certification, topic, title, description, url], index) => ({
  provider,
  type: locale === "en" ? (ui.en.resourceTypes[type as keyof typeof ui.en.resourceTypes] ?? type) : type,
  canonicalType: type,
  certification: locale === "en" ? (ui.en.cert[certification as keyof typeof ui.en.cert] ?? certification) : certification,
  canonicalCertification: certification,
  topic,
  title,
  description: locale === "en" ? englishDescriptions[index] : description,
  url: localizeLearnUrl(url, locale),
  reviewedAt: "2026-10-10"
}));
}

export const resources = getResources("zh");
