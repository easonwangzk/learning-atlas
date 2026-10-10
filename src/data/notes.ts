import type { Locale } from "@/i18n";

type Localized = Readonly<Record<Locale, string>>;
export type GlossaryTerm = Readonly<{ id: string; term: string; full: string; zh: string; en: string }>;
export type Pitfall = Readonly<{ id: string; title: Localized; body: Localized }>;
export type DecisionNote = Readonly<{ id: string; title: Localized; body: Localized }>;

export const glossary: readonly GlossaryTerm[] = [
  { id: "vm", term: "VM", full: "Virtual Machine", zh: "虚拟机；IaaS 责任边界更靠近操作系统。", en: "Virtual machine; an IaaS boundary closer to operating-system ownership." },
  { id: "iaas", term: "IaaS", full: "Infrastructure as a Service", zh: "基础设施即服务；用户管理更多运行时与补丁责任。", en: "Infrastructure as a Service; the user owns more runtime and patching responsibility." },
  { id: "paas", term: "PaaS", full: "Platform as a Service", zh: "平台即服务；平台托管更多运行环境但仍需配置身份、网络和数据。", en: "Platform as a Service; more runtime is managed, but identity, network, and data still need design." },
  { id: "rbac", term: "RBAC", full: "Role-Based Access Control", zh: "基于角色的访问控制；用于最小权限授权。", en: "Role-Based Access Control for least-privilege authorization." },
  { id: "nsg", term: "NSG", full: "Network Security Group", zh: "网络安全组；控制子网或网卡层入站/出站规则。", en: "Network Security Group controlling inbound/outbound rules at subnet or NIC scope." },
  { id: "dns", term: "DNS", full: "Domain Name System", zh: "域名系统；Private Endpoint 成功通常依赖正确私有解析。", en: "Domain Name System; Private Endpoint success often depends on correct private resolution." },
  { id: "rpo", term: "RPO", full: "Recovery Point Objective", zh: "恢复点目标；故障后可接受的数据丢失时间窗口，不是恢复所需时长。", en: "Recovery Point Objective; the acceptable data-loss window measured in time, not the time needed to restore service." },
  { id: "rto", term: "RTO", full: "Recovery Time Objective", zh: "恢复时间目标；服务恢复到可用状态的目标时长。", en: "Recovery Time Objective; target time to restore a usable service." },
  { id: "ru", term: "RU", full: "Request Unit", zh: "请求单位；Azure Cosmos DB 操作的归一化资源消耗。预配吞吐通常用 RU/s 表示，具体计费取决于容量模式。", en: "Request Unit; normalized resource cost for Azure Cosmos DB operations. Provisioned throughput is expressed in RU/s; billing depends on the capacity mode." },
  { id: "rag", term: "RAG", full: "Retrieval-Augmented Generation", zh: "检索增强生成；检索命中不等于授权或答案正确。", en: "Retrieval-Augmented Generation; retrieval hits do not equal authorization or answer correctness." },
  { id: "stt", term: "STT", full: "Speech to Text", zh: "语音转文本；需关注语言、噪声和隐私边界。", en: "Speech to Text; language, noise, and privacy boundaries matter." },
  { id: "tts", term: "TTS", full: "Text to Speech", zh: "文本转语音；输出体验也需要安全与版权审查。", en: "Text to Speech; output experience still needs safety and rights review." },
  { id: "mlops", term: "MLOps", full: "Machine Learning Operations", zh: "机器学习运维；覆盖数据、评估、部署、监控和回滚。", en: "Machine Learning Operations across data, evaluation, deployment, monitoring, and rollback." },
  { id: "waf", term: "WAF", full: "Well-Architected Framework / Web Application Firewall", zh: "缩写有歧义：架构评审中的 Well-Architected Framework 与边缘防护的 Web Application Firewall 不同。", en: "Ambiguous acronym: Well-Architected Framework in reviews differs from Web Application Firewall at the edge." }
];

export const pitfalls: readonly Pitfall[] = [
  { id: "stop-deallocate", title: { zh: "停止不等于解除分配", en: "Stopped is not deallocated" }, body: { zh: "VM 停止状态可能仍保留计费资源；要确认 Deallocate 和关联磁盘、IP、备份成本。", en: "A stopped VM may still keep billable resources; verify deallocation plus disks, IPs, and backup costs." } },
  { id: "budget-cap", title: { zh: "预算不是硬性封顶", en: "Budgets are not hard caps" }, body: { zh: "预算提醒不能替代配额、策略、自动化关闭和成本评审。", en: "Budget alerts do not replace quotas, policies, automated shutdown, and cost review." } },
  { id: "private-endpoint", title: { zh: "Private Endpoint 不是自动关闭公网", en: "Private Endpoint does not automatically close public access" }, body: { zh: "还要检查服务公共网络开关、DNS 解析、授权和客户端路径。", en: "Also check service public-network settings, DNS resolution, authorization, and client paths." } },
  { id: "replication-backup", title: { zh: "复制不是备份", en: "Replication is not backup" }, body: { zh: "复制可同步误删或损坏；备份、保留、恢复演练是另一套能力。", en: "Replication can sync deletion or corruption; backup, retention, and restore drills are separate capabilities." } },
  { id: "vector-db", title: { zh: "向量索引不是事务数据库", en: "Vector indexes are not transactional databases" }, body: { zh: "检索索引服务召回，不能替代事实源、授权系统或审计日志。", en: "Retrieval indexes serve recall; they do not replace systems of record, authorization, or audit logs." } },
  { id: "rag-auth", title: { zh: "RAG 不是授权", en: "RAG is not authorization" }, body: { zh: "检索前后都要执行权限过滤；引用存在也不代表用户有权查看。", en: "Apply permission filters before and after retrieval; a citation does not mean the user may view it." } },
  { id: "confidence-security", title: { zh: "模型自信度不是安全阈值", en: "Model confidence is not a security threshold" }, body: { zh: "安全决策需要可验证策略、审计和人工升级路径，不能只看模型口吻。", en: "Security decisions need verifiable policy, audit, and escalation paths, not model tone." } },
  { id: "offline-f1", title: { zh: "离线 F1 不等于业务结果", en: "Offline F1 is not business outcome" }, body: { zh: "离线指标要和数据漂移、成本、误伤、用户体验及线上实验分开解释。", en: "Explain offline metrics separately from drift, cost, false positives, UX, and online experiments." } }
];

export const decisionNotes: readonly DecisionNote[] = [
  { id: "identity-first", title: { zh: "先画身份边界", en: "Draw identity boundaries first" }, body: { zh: "架构图先标出人、服务主体、托管身份、数据面权限和审计点，再讨论计算形态。", en: "Mark people, service principals, managed identities, data-plane permissions, and audit points before compute choices." } },
  { id: "cost-resilience", title: { zh: "成本与韧性一起评审", en: "Review cost and resilience together" }, body: { zh: "可用区、备份和队列可支持韧性设计，但必须验证故障模式与恢复流程。缓存主要改善性能，也增加失效、刷新和一致性风险，不会自动提高可用性。", en: "Availability zones, backups, and queues can support resilience when failure modes and recovery are validated. Caches primarily improve performance and add invalidation and consistency risks; they do not automatically improve availability." } },
  { id: "ai-data-contract", title: { zh: "AI 需要数据契约", en: "AI needs a data contract" }, body: { zh: "RAG、评估和 Agent 工具都依赖清晰的来源、字段、权限、保留期和失败模式。", en: "RAG, evaluation, and agent tools depend on clear sources, fields, permissions, retention, and failure modes." } }
];

export function noteEntries(locale: Locale) { return [
  ...glossary.map((item) => ({ kind: locale === "en" ? "Glossary" : "术语", title: `${item.term} — ${item.full}`, summary: locale === "en" ? item.en : item.zh, href: `/notes/#${item.id}` })),
  ...pitfalls.map((item) => ({ kind: locale === "en" ? "Pitfall" : "踩坑", title: item.title[locale], summary: item.body[locale], href: `/notes/#${item.id}` })),
  ...decisionNotes.map((item) => ({ kind: locale === "en" ? "Decision note" : "决策笔记", title: item.title[locale], summary: item.body[locale], href: `/notes/#${item.id}` }))
]; }
