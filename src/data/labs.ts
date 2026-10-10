import { getTrack, trackText, type TrackSlug } from "@/data/tracks";
import type { Locale } from "@/i18n";

export type LabSlug = "compute-capacity" | "storage-recovery" | "network-subnet" | "database-partition" | "ai-retrieval" | "ml-confusion-matrix";
export type LabKind = "compute" | "storage" | "network" | "database" | "ai" | "ml";
type Localized = Readonly<Record<Locale, string>>;

export type Lab = Readonly<{
  slug: LabSlug;
  track: TrackSlug;
  kind: LabKind;
  title: Localized;
  summary: Localized;
  lesson: string;
  cert: Localized;
  source: Localized;
  provenance: Localized;
  sourceUrls: readonly Readonly<{ label: Localized; href: string }>[];
  inputs: readonly Readonly<{ name: string; label: Localized; value: number; min: number; max: number; step: number; unit: Localized }>[]; 
  steps: readonly Localized[];
  limitation: Localized;
}>;

export const labs: readonly Lab[] = [
  {
    slug: "compute-capacity",
    track: "compute",
    kind: "compute",
    lesson: "/learn/compute/container-apps/",
    cert: { zh: "AZ-104 / AZ-305", en: "AZ-104 / AZ-305" },
    source: {
      zh: "原创合成输入；公式：基础核心 = RPS × CPU ms ÷ 1000，规划核心 = 基础核心 × 余量，副本数 = ceil(规划核心 ÷ 每副本核心)。",
      en: "Original synthetic inputs; formula: base cores = RPS × CPU ms ÷ 1000, planning cores = base cores × headroom, replicas = ceil(planning cores ÷ cores per replica)."
    },
    provenance: {
      zh: "数据为 2026-10-10 的教学默认值，不是 Azure 测量结果；图表显示理想 CPU 与请求容量比例。",
      en: "Data uses 2026-10-10 teaching defaults, not Azure measurements; the chart shows ideal CPU and requested capacity ratio."
    },
    sourceUrls: [
      { label: { zh: "Azure 架构良好框架：性能效率", en: "Azure Well-Architected Framework: performance efficiency" }, href: "https://learn.microsoft.com/azure/well-architected/performance-efficiency/" },
      { label: { zh: "Azure Container Apps 缩放", en: "Azure Container Apps scaling" }, href: "https://learn.microsoft.com/azure/container-apps/scale-app" }
    ],
    title: { zh: "计算工作负载容量工作表", en: "Compute workload capacity worksheet" },
    summary: { zh: "用合成 RPS、服务时间、核心数与余量估算规划核心和副本数；不声称 Azure 性能。", en: "Estimate planning cores and replicas from synthetic RPS, service time, cores, and headroom; no Azure performance claim." },
    inputs: [
      { name: "rps", label: { zh: "请求/秒", en: "Requests per second" }, value: 120, min: 1, max: 5000, step: 1, unit: { zh: "req/s", en: "req/s" } },
      { name: "cpuMs", label: { zh: "每请求 CPU 服务时间", en: "CPU service time per request" }, value: 45, min: 1, max: 1000, step: 1, unit: { zh: "ms", en: "ms" } },
      { name: "cores", label: { zh: "每副本核心", en: "Cores per replica" }, value: 2, min: 0.25, max: 16, step: 0.25, unit: { zh: "cores", en: "cores" } },
      { name: "headroom", label: { zh: "余量倍数", en: "Headroom multiplier" }, value: 1.3, min: 1, max: 3, step: 0.1, unit: { zh: "×", en: "×" } }
    ],
    steps: [
      { zh: "输入合成流量与每请求 CPU 服务时间。", en: "Enter synthetic traffic and CPU service time per request." },
      { zh: "比较不同副本数下的理想 CPU 利用率与加入余量后的请求容量比例。", en: "Compare ideal CPU utilization and headroom-adjusted requested capacity ratio by replica count." },
      { zh: "把结果作为架构评审讨论材料，而不是真实压测或 SKU 建议。", en: "Use the result for architecture review, not as a load test or SKU recommendation." }
    ],
    limitation: { zh: "没有真实负载、冷启动、网络、I/O、限流或 Azure SKU 数据。", en: "No real load, cold start, network, I/O, throttling, or Azure SKU data is used." }
  },
  {
    slug: "storage-recovery",
    track: "storage",
    kind: "storage",
    lesson: "/learn/storage/backup-continuity/",
    cert: { zh: "AZ-104 / AZ-305", en: "AZ-104 / AZ-305" },
    source: {
      zh: "原创示例恢复时间线；总阶段时间 = 复制 + 还原 + 验证。RPO 比较事故时最近备份年龄与目标。",
      en: "Original illustrative recovery timeline; total phase time = copy + restore + validate. RPO compares latest backup age at incident with the target."
    },
    provenance: {
      zh: "这是 2026-10-10 的教学样例，不是 Azure Backup 或存储复制基准；不包含检测和启动延迟。",
      en: "This is a 2026-10-10 teaching sample, not an Azure Backup or storage replication benchmark; detection and start delay are excluded."
    },
    sourceUrls: [
      { label: { zh: "Azure 架构良好框架：可靠性", en: "Azure Well-Architected Framework: reliability" }, href: "https://learn.microsoft.com/azure/well-architected/reliability/" },
      { label: { zh: "Azure Backup 文档", en: "Azure Backup documentation" }, href: "https://learn.microsoft.com/azure/backup/" }
    ],
    title: { zh: "存储恢复时间线检查器", en: "Storage recovery timeline checker" },
    summary: { zh: "比较 RPO/RTO 目标、事故时备份年龄和示例恢复阶段；强调复制不是备份。", en: "Compare RPO/RTO targets, backup age at incident, and illustrative recovery phases; reinforces that replication is not backup." },
    inputs: [
      { name: "rpo", label: { zh: "RPO 目标", en: "RPO target" }, value: 60, min: 1, max: 1440, step: 1, unit: { zh: "min", en: "min" } },
      { name: "backupAge", label: { zh: "事故时最近备份年龄", en: "Latest backup age at incident" }, value: 42, min: 0, max: 2880, step: 1, unit: { zh: "min", en: "min" } },
      { name: "rto", label: { zh: "RTO 目标", en: "RTO target" }, value: 120, min: 1, max: 2880, step: 1, unit: { zh: "min", en: "min" } },
      { name: "copy", label: { zh: "复制阶段", en: "Copy phase" }, value: 30, min: 0, max: 720, step: 1, unit: { zh: "min", en: "min" } },
      { name: "restore", label: { zh: "还原阶段", en: "Restore phase" }, value: 45, min: 0, max: 720, step: 1, unit: { zh: "min", en: "min" } },
      { name: "validate", label: { zh: "验证阶段", en: "Validation phase" }, value: 20, min: 0, max: 720, step: 1, unit: { zh: "min", en: "min" } }
    ],
    steps: [
      { zh: "设置目标、事故时备份年龄和示例阶段耗时。", en: "Set objectives, backup age at incident, and illustrative phase durations." },
      { zh: "检查 RPO 是否满足，并比较复制 + 还原 + 验证与 RTO。", en: "Check whether RPO passes, and compare copy + restore + validate with RTO." },
      { zh: "记录验证阶段；不要把文件复制完成等同于业务恢复完成。", en: "Record validation; do not equate file copy completion with business recovery." }
    ],
    limitation: { zh: "只做教学时间线，无法认证端到端灾难恢复，也不代表 Azure 实测性能。", en: "Teaching timeline only; it cannot certify end-to-end disaster recovery and does not represent measured Azure performance." }
  },
  {
    slug: "network-subnet",
    track: "network",
    kind: "network",
    lesson: "/learn/network/vnet-segmentation/",
    cert: { zh: "AZ-700 / AZ-305", en: "AZ-700 / AZ-305" },
    source: {
      zh: "Azure IPv4 子网通用规则：总地址 = 2^(32-prefix)，Azure 每个子网预留 5 个地址；本实验限定 /16 到 /29。",
      en: "Azure IPv4 subnet general rule: total addresses = 2^(32-prefix), and Azure reserves five addresses per subnet; this exercise limits prefixes to /16 through /29."
    },
    provenance: {
      zh: "网络标签始终使用 10.0.0.0/prefix；IPv6 与服务专用最小子网大小不在公式内。",
      en: "The network label is always 10.0.0.0/prefix; IPv6 and service-specific minimum subnet sizes are outside the formula."
    },
    sourceUrls: [
      { label: { zh: "Azure 虚拟网络常见问题", en: "Azure Virtual Network FAQ" }, href: "https://learn.microsoft.com/azure/virtual-network/virtual-networks-faq" },
      { label: { zh: "Azure 架构良好框架：网络", en: "Azure Well-Architected Framework: networking" }, href: "https://learn.microsoft.com/azure/well-architected/security/networking" }
    ],
    title: { zh: "Azure IPv4 子网容量实验", en: "Azure IPv4 subnet capacity lab" },
    summary: { zh: "验证前缀、总地址、Azure 预留 5 个地址和可用地址；只适用于 Azure IPv4。", en: "Validate prefix, total addresses, five Azure-reserved addresses, and usable addresses; Azure IPv4 only." },
    inputs: [{ name: "prefix", label: { zh: "IPv4 前缀长度", en: "IPv4 prefix length" }, value: 24, min: 16, max: 29, step: 1, unit: { zh: "/ prefix", en: "/ prefix" } }],
    steps: [
      { zh: "选择一个精确整数前缀 /16 到 /29。", en: "Choose an exact integer prefix from /16 through /29." },
      { zh: "运行后比较总地址、Azure 预留地址与可用地址。", en: "Run and compare total, Azure-reserved, and usable addresses." },
      { zh: "再查服务文档，因为某些服务要求比通用规则更大的子网。", en: "Check service documentation because some services require larger subnets than the general rule." }
    ],
    limitation: { zh: "不生成网络命令；不覆盖 IPv6、路由、NSG 或服务委派限制。", en: "Runs no network command; does not cover IPv6, routing, NSGs, or service delegation limits." }
  },
  {
    slug: "database-partition",
    track: "database",
    kind: "database",
    lesson: "/learn/database/cosmos-design/",
    cert: { zh: "AZ-305", en: "AZ-305" },
    source: {
      zh: "原创确定性玩具哈希与合成记录；比较常量键与分散键的每桶计数和最大桶占比。",
      en: "Original deterministic toy hash with synthetic records; compares per-bucket counts and maximum bucket share for a constant key versus spread keys."
    },
    provenance: {
      zh: "不使用 Cosmos DB 物理分区、RU、延迟或真实租户数据；只用于解释倾斜。",
      en: "Does not use Cosmos DB physical partitions, RU, latency, or real tenant data; only explains skew."
    },
    sourceUrls: [
      { label: { zh: "Azure Cosmos DB 分区", en: "Azure Cosmos DB partitioning" }, href: "https://learn.microsoft.com/azure/cosmos-db/partitioning-overview" },
      { label: { zh: "Azure 架构良好框架：数据分区", en: "Azure Well-Architected Framework: partitioning data" }, href: "https://learn.microsoft.com/azure/well-architected/performance-efficiency/partition-data" }
    ],
    title: { zh: "数据库分区倾斜模拟", en: "Database partition-skew simulation" },
    summary: { zh: "生成原创合成记录，同时显示常量键与分散键的实际桶计数。", en: "Generate original synthetic records and show actual bucket counts for both constant and spread keys." },
    inputs: [
      { name: "records", label: { zh: "合成记录数", en: "Synthetic records" }, value: 120, min: 10, max: 1000, step: 10, unit: { zh: "rows", en: "rows" } },
      { name: "buckets", label: { zh: "逻辑桶数", en: "Logical buckets" }, value: 6, min: 2, max: 12, step: 1, unit: { zh: "buckets", en: "buckets" } }
    ],
    steps: [
      { zh: "选择整数记录数和桶数。", en: "Choose integer record and bucket counts." },
      { zh: "比较常量键与分散键每个桶的计数和最大占比。", en: "Compare constant-key and spread-key counts per bucket plus max share." },
      { zh: "把结果与查询模式、跨分区读取和事务边界一起评审。", en: "Review the result with query patterns, cross-partition reads, and transaction boundaries." }
    ],
    limitation: { zh: "玩具哈希不代表 Cosmos DB 放置、延迟、RU 成本或分区键最佳实践的完整答案。", en: "The toy hash does not represent Cosmos DB placement, latency, RU cost, or a complete partition-key recommendation." }
  },
  {
    slug: "ai-retrieval",
    track: "ai",
    kind: "ai",
    lesson: "/learn/ai/rag-grounding/",
    cert: { zh: "扩展学习", en: "Extended learning" },
    source: {
      zh: "原创英文合成语料、固定查询和已知相关 ID；本地计算 Recall@k、MRR@k 与完整排序 MRR。",
      en: "Original English synthetic corpus, fixed queries, and known relevant IDs; computes Recall@k, MRR@k, and full-ranking MRR locally."
    },
    provenance: {
      zh: "中英文页面使用相同英文语料以便复现；没有嵌入、模型、网络调用或有效人工标注基准。",
      en: "Both language pages use the same English corpus for reproduction; no embeddings, models, network calls, or validated human benchmark are used."
    },
    sourceUrls: [
      { label: { zh: "Azure AI Search：相关性", en: "Azure AI Search relevance" }, href: "https://learn.microsoft.com/azure/search/index-similarity-and-scoring" },
      { label: { zh: "Azure 架构良好框架：AI 工作负载", en: "Azure Well-Architected Framework: AI workloads" }, href: "https://learn.microsoft.com/azure/well-architected/ai/" }
    ],
    title: { zh: "AI 检索指标玩具实验", en: "AI retrieval metric toy lab" },
    summary: { zh: "用小型原创英文语料展示 Recall@k 会随 k 变化；不是 Azure AI Search、向量或 LLM 质量基准。", en: "Use a tiny original English corpus to show Recall@k changes with k; not an Azure AI Search, vector, or LLM-quality benchmark." },
    inputs: [{ name: "k", label: { zh: "Recall@k 截断", en: "Recall@k cutoff" }, value: 3, min: 1, max: 5, step: 1, unit: { zh: "docs", en: "docs" } }],
    steps: [
      { zh: "使用固定的五篇短文档、五条查询和已知相关 ID。", en: "Use five fixed short documents, five queries, and known relevant IDs." },
      { zh: "查看每条查询的相关 ID、返回排序、分数、Recall@k 与倒数排名。", en: "Inspect known relevant IDs, returned ranking, scores, Recall@k, and reciprocal rank for each query." },
      { zh: "区分检索命中、答案生成质量、引用和权限过滤。", en: "Separate retrieval hits from answer generation quality, citations, and authorization filtering." }
    ],
    limitation: { zh: "词面检索和小语料不能证明 RAG 可靠、接地、安全或生产质量。", en: "Lexical retrieval on a tiny corpus does not prove RAG reliability, grounding, safety, or production quality." }
  },
  {
    slug: "ml-confusion-matrix",
    track: "ml",
    kind: "ml",
    lesson: "/learn/ml/classification-evaluation/",
    cert: { zh: "扩展学习", en: "Extended learning" },
    source: {
      zh: "原创合成整数计数；Precision = TP/(TP+FP)，Recall = TP/(TP+FN)，F1 = 2TP/(2TP+FP+FN)，Accuracy = (TP+TN)/总数。",
      en: "Original synthetic integer counts; Precision = TP/(TP+FP), Recall = TP/(TP+FN), F1 = 2TP/(2TP+FP+FN), Accuracy = (TP+TN)/total."
    },
    provenance: {
      zh: "不来自训练模型、测试集或线上遥测；分母为 0 的指标显示为不适用。",
      en: "Not from a trained model, test set, or online telemetry; metrics with zero denominators display as N/A."
    },
    sourceUrls: [
      { label: { zh: "Azure Machine Learning：模型评估", en: "Azure Machine Learning model evaluation" }, href: "https://learn.microsoft.com/azure/machine-learning/how-to-understand-automated-ml#classification" },
      { label: { zh: "负责任 AI 仪表板", en: "Responsible AI dashboard" }, href: "https://learn.microsoft.com/azure/machine-learning/how-to-responsible-ai-dashboard" }
    ],
    title: { zh: "ML 混淆矩阵计算器", en: "ML confusion-matrix calculator" },
    summary: { zh: "用 TP/FP/FN/TN 整数计数计算命名指标，并显示计数图表。", en: "Compute named metrics from integer TP/FP/FN/TN counts and show the count chart." },
    inputs: [
      { name: "tp", label: { zh: "TP 真阳性", en: "TP true positives" }, value: 42, min: 0, max: 10000, step: 1, unit: { zh: "count", en: "count" } },
      { name: "fp", label: { zh: "FP 假阳性", en: "FP false positives" }, value: 8, min: 0, max: 10000, step: 1, unit: { zh: "count", en: "count" } },
      { name: "fn", label: { zh: "FN 假阴性", en: "FN false negatives" }, value: 12, min: 0, max: 10000, step: 1, unit: { zh: "count", en: "count" } },
      { name: "tn", label: { zh: "TN 真阴性", en: "TN true negatives" }, value: 138, min: 0, max: 10000, step: 1, unit: { zh: "count", en: "count" } }
    ],
    steps: [
      { zh: "输入非负整数计数；不接受小数或非有限数值。", en: "Enter non-negative integer counts; decimals and non-finite values are rejected." },
      { zh: "读取 Precision、Recall、F1、Accuracy 和 TP/FP/FN/TN 计数图表。", en: "Read Precision, Recall, F1, Accuracy, and the TP/FP/FN/TN count chart." },
      { zh: "把离线指标与业务结果、安全阈值和数据代表性分开讨论。", en: "Discuss offline metrics separately from business outcome, safety thresholds, and data representativeness." }
    ],
    limitation: { zh: "合成计数不代表真实模型、数据集、线上风险或业务价值。", en: "Synthetic counts do not represent a real model, dataset, online risk, or business value." }
  }
];

export function getLab(slug: string): Lab | undefined {
  return labs.find((lab) => lab.slug === slug);
}

export function labText(lab: Lab, locale: Locale) {
  const track = getTrack(lab.track);
  const localizedTrack = track ? trackText(track, locale).title : lab.track;
  return {
    ...lab,
    title: lab.title[locale],
    summary: lab.summary[locale],
    cert: lab.cert[locale],
    source: lab.source[locale],
    provenance: lab.provenance[locale],
    limitation: lab.limitation[locale],
    trackLabel: localizedTrack,
    sourceUrls: lab.sourceUrls.map((source) => ({ label: source.label[locale], href: source.href })),
    steps: lab.steps.map((step) => step[locale]),
    inputs: lab.inputs.map((input) => ({ ...input, label: input.label[locale], unit: input.unit[locale] }))
  };
}
