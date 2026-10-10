export type LabLocale = "zh" | "en";
export type LabKind = "compute" | "storage" | "network" | "database" | "ai" | "ml";
export type ComputeInput = { rps: number; cpuMs: number; cores: number; headroom: number };
export type RecoveryInput = { rpo: number; backupAge: number; rto: number; copy: number; restore: number; validate: number };
export type SubnetInput = { prefix: number };
export type PartitionInput = { records: number; buckets: number };
export type RetrievalInput = { k: number };
export type ConfusionInput = { tp: number; fp: number; fn: number; tn: number };
export type LabInput = ComputeInput | RecoveryInput | SubnetInput | PartitionInput | RetrievalInput | ConfusionInput;
export type ChartSeries = Readonly<{ name: string; values: readonly number[] }>;
export type ChartModel = Readonly<{ title: string; unit: string; labels: readonly string[]; series: readonly ChartSeries[] }>;
export type ResultRow = Readonly<{ label: string; value: string; unit?: string }>;
export type ResultSection = Readonly<{ title: string; rows: readonly ResultRow[] }>;
export type LabResult = Readonly<{
  summaryRows: readonly ResultRow[];
  detailSections: readonly ResultSection[];
  chart: ChartModel;
  notes: readonly string[];
}>;

type NumericRule = Readonly<{ min: number; max: number; integer?: boolean }>;

const labels = {
  en: {
    pass: "Pass",
    fail: "Review",
    na: "N/A",
    unexpected: "Unexpected lab failure. Please check the console.",
    compute: {
      baseCores: "CPU cores needed before headroom",
      neededCores: "Planning cores after headroom",
      replicas: "Suggested replicas",
      actualUtil: "Actual ideal CPU utilization",
      requestedRatio: "Requested capacity ratio",
      serviceTime: "CPU work per request",
      chart: "Compute planning by replica count",
      actualSeries: "Actual ideal CPU utilization",
      plannedSeries: "Requested capacity ratio",
      note: "Headroom multiplies planning demand; it is not a measured Azure utilization reading."
    },
    recovery: {
      total: "Illustrative copy + restore + validate time",
      rpo: "RPO check",
      rto: "RTO phase check",
      copy: "Copy phase",
      restore: "Restore phase",
      validate: "Validation phase",
      target: "RTO target",
      chart: "Illustrative recovery phases and target",
      definitions: "RPO is the acceptable data-loss window measured in time. RTO is the target time to restore usable service.",
      formula: "RPO compares latest backup age at incident to the target; RTO here checks only copy + restore + validate phases.",
      caveat: "Detection and incident start delay are excluded unless supplied; this cannot certify end-to-end disaster recovery."
    },
    subnet: {
      network: "Network",
      total: "Total IPv4 addresses",
      reserved: "Azure-reserved IPv4 addresses",
      usable: "Usable IPv4 addresses",
      chart: "Azure IPv4 subnet address counts",
      note: "Azure reserves five IPv4 addresses per subnet; service-specific subnet requirements may be stricter. IPv6 is excluded."
    },
    partition: {
      constantMax: "Constant-key max bucket share",
      spreadMax: "Spread-key max bucket share",
      constant: "Constant key count",
      spread: "Spread key count",
      chart: "Toy hash bucket counts",
      note: "This deterministic toy hash is not Cosmos DB physical placement, latency, or RU cost."
    },
    retrieval: {
      recall: "Average Recall@k",
      mrrFull: "Average MRR over full ranking",
      mrrCutoff: "Average MRR@k",
      ranking: "Returned ranking",
      relevant: "Known relevant IDs",
      recallRow: "Recall@k",
      rrFull: "Reciprocal rank (full)",
      rrCutoff: "Reciprocal rank@k",
      chart: "Recall@k by query",
      note: "The same original English synthetic corpus is used in both languages; this is lexical token matching, not embeddings or an LLM benchmark."
    },
    confusion: {
      precision: "Precision",
      recall: "Recall",
      f1: "F1",
      accuracy: "Accuracy",
      tp: "TP true positives",
      fp: "FP false positives",
      fn: "FN false negatives",
      tn: "TN true negatives",
      chart: "Confusion-matrix counts",
      note: "Precision and recall are N/A only when their denominators are zero; F1 is 0 when 2TP + FP + FN is positive and TP is zero."
    }
  },
  zh: {
    pass: "通过",
    fail: "需复核",
    na: "不适用",
    unexpected: "实验发生意外错误。请查看控制台。",
    compute: {
      baseCores: "未加余量的 CPU 核心需求",
      neededCores: "加入余量后的规划核心",
      replicas: "建议副本数",
      actualUtil: "理想实际 CPU 利用率",
      requestedRatio: "请求容量比例",
      serviceTime: "每请求 CPU 工作时间",
      chart: "按副本数计算容量规划",
      actualSeries: "理想实际 CPU 利用率",
      plannedSeries: "请求容量比例",
      note: "余量只放大规划需求；它不是 Azure 实测利用率。"
    },
    recovery: {
      total: "示例复制 + 还原 + 验证时间",
      rpo: "RPO 检查",
      rto: "RTO 阶段检查",
      copy: "复制阶段",
      restore: "还原阶段",
      validate: "验证阶段",
      target: "RTO 目标",
      chart: "示例恢复阶段与目标",
      definitions: "RPO 是可接受的数据丢失时间窗口。RTO 是恢复服务到可用状态的目标时间。",
      formula: "RPO 比较事故时最近备份年龄与目标；这里的 RTO 只检查复制 + 还原 + 验证阶段。",
      caveat: "除非另行提供，检测与启动延迟不包含在内；本实验不能认证端到端灾难恢复。"
    },
    subnet: {
      network: "网络",
      total: "IPv4 总地址数",
      reserved: "Azure 预留 IPv4 地址",
      usable: "可用 IPv4 地址",
      chart: "Azure IPv4 子网地址数量",
      note: "Azure 每个子网预留 5 个 IPv4 地址；服务专用子网要求可能更严格。IPv6 不在范围内。"
    },
    partition: {
      constantMax: "常量键最大桶占比",
      spreadMax: "分散键最大桶占比",
      constant: "常量键计数",
      spread: "分散键计数",
      chart: "玩具哈希桶计数",
      note: "这个确定性玩具哈希不代表 Cosmos DB 物理放置、延迟或 RU 成本。"
    },
    retrieval: {
      recall: "平均 Recall@k",
      mrrFull: "完整排序平均 MRR",
      mrrCutoff: "平均 MRR@k",
      ranking: "返回排序",
      relevant: "已知相关 ID",
      recallRow: "Recall@k",
      rrFull: "倒数排名（完整）",
      rrCutoff: "倒数排名@k",
      chart: "每个查询的 Recall@k",
      note: "中英文页面使用同一份原创英文合成语料；这是词面 token 匹配，不是嵌入或 LLM 基准。"
    },
    confusion: {
      precision: "Precision 精确率",
      recall: "Recall 召回率",
      f1: "F1",
      accuracy: "Accuracy 准确率",
      tp: "TP 真阳性",
      fp: "FP 假阳性",
      fn: "FN 假阴性",
      tn: "TN 真阴性",
      chart: "混淆矩阵计数",
      note: "Precision 和 Recall 仅在分母为 0 时为不适用；当 2TP + FP + FN 为正且 TP 为 0 时，F1 为 0。"
    }
  }
} as const;

const rules = {
  compute: {
    rps: { min: 1, max: 5000, integer: true },
    cpuMs: { min: 1, max: 1000 },
    cores: { min: 0.25, max: 16 },
    headroom: { min: 1, max: 3 }
  },
  storage: {
    rpo: { min: 1, max: 1440, integer: true },
    backupAge: { min: 0, max: 2880, integer: true },
    rto: { min: 1, max: 2880, integer: true },
    copy: { min: 0, max: 720, integer: true },
    restore: { min: 0, max: 720, integer: true },
    validate: { min: 0, max: 720, integer: true }
  },
  network: { prefix: { min: 16, max: 29, integer: true } },
  database: {
    records: { min: 10, max: 1000, integer: true },
    buckets: { min: 2, max: 12, integer: true }
  },
  ai: { k: { min: 1, max: 5, integer: true } },
  ml: {
    tp: { min: 0, max: 10000, integer: true },
    fp: { min: 0, max: 10000, integer: true },
    fn: { min: 0, max: 10000, integer: true },
    tn: { min: 0, max: 10000, integer: true }
  }
} as const;

function validateNumber(field: string, value: number, rule: NumericRule): number {
  if (!Number.isFinite(value)) throw new RangeError(`${field}: must be a finite number`);
  if (value < rule.min || value > rule.max) throw new RangeError(`${field}: must be between ${rule.min} and ${rule.max}`);
  if (rule.integer && !Number.isInteger(value)) throw new RangeError(`${field}: must be an integer`);
  return value;
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatNumber(value: number, digits = 2): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(digits).replace(/\.?0+$/, "");
}

function formatRatio(value: number | null, locale: LabLocale): string {
  return value === null ? labels[locale].na : `${formatNumber(value * 100, 1)}%`;
}

export function safeRatio(numerator: number, denominator: number): number | null {
  return denominator > 0 ? numerator / denominator : null;
}

function assertNonEmptyRelevance(query: string, relevant: readonly string[]) {
  if (!query.trim()) throw new RangeError("query: must not be empty");
  if (relevant.length === 0) throw new RangeError("relevant: must contain at least one document id");
}

export function computeCapacity(input: ComputeInput) {
  const rps = validateNumber("rps", input.rps, rules.compute.rps);
  const cpuMs = validateNumber("cpuMs", input.cpuMs, rules.compute.cpuMs);
  const cores = validateNumber("cores", input.cores, rules.compute.cores);
  const headroom = validateNumber("headroom", input.headroom, rules.compute.headroom);
  const baseCores = (rps * cpuMs) / 1000;
  const requiredCores = baseCores * headroom;
  const replicas = Math.max(1, Math.ceil(requiredCores / cores));
  const actualUtilization = (baseCores / (replicas * cores)) * 100;
  const requestedCapacityRatio = (requiredCores / (replicas * cores)) * 100;
  const rows = Array.from({ length: 6 }, (_, index) => {
    const count = index + 1;
    return {
      label: `${count}`,
      actualUtilization: round((baseCores / (count * cores)) * 100, 1),
      requestedCapacityRatio: round((requiredCores / (count * cores)) * 100, 1)
    };
  });
  return {
    baseCores: round(baseCores, 3),
    requiredCores: round(requiredCores, 3),
    replicas,
    actualUtilization: round(actualUtilization, 1),
    requestedCapacityRatio: round(requestedCapacityRatio, 1),
    serviceTimeMs: cpuMs,
    rows
  };
}

export function recoveryTimeline(input: RecoveryInput) {
  const rpo = validateNumber("rpo", input.rpo, rules.storage.rpo);
  const backupAge = validateNumber("backupAge", input.backupAge, rules.storage.backupAge);
  const rto = validateNumber("rto", input.rto, rules.storage.rto);
  const copy = validateNumber("copy", input.copy, rules.storage.copy);
  const restore = validateNumber("restore", input.restore, rules.storage.restore);
  const validate = validateNumber("validate", input.validate, rules.storage.validate);
  const total = copy + restore + validate;
  return {
    total,
    rpoOk: backupAge <= rpo,
    rtoOk: total <= rto,
    rows: [
      { label: "copy", value: copy },
      { label: "restore", value: restore },
      { label: "validate", value: validate }
    ],
    target: rto,
    backupAgeAtIncident: backupAge
  };
}

export function subnetCapacity(input: SubnetInput) {
  const prefix = validateNumber("prefix", input.prefix, rules.network.prefix);
  const total = 2 ** (32 - prefix);
  const reserved = 5;
  return {
    network: `10.0.0.0/${prefix}`,
    prefix,
    total,
    reserved,
    usable: total - reserved,
    rows: [
      { label: "usable", value: total - reserved },
      { label: "reserved", value: reserved }
    ]
  };
}

function hashIndex(value: string, buckets: number): number {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % buckets;
}

export function partitionSkew(input: PartitionInput) {
  const records = validateNumber("records", input.records, rules.database.records);
  const buckets = validateNumber("buckets", input.buckets, rules.database.buckets);
  const constant = Array.from({ length: buckets }, () => 0);
  const spread = Array.from({ length: buckets }, () => 0);
  for (let index = 0; index < records; index += 1) {
    constant[hashIndex("constant-partition-key", buckets)] += 1;
    spread[hashIndex(`tenant-${index % Math.max(2, buckets * 3)}-record-${index}`, buckets)] += 1;
  }
  const maxConstant = Math.max(...constant) / records;
  const maxSpread = Math.max(...spread) / records;
  return {
    records,
    buckets,
    maxConstant,
    maxSpread,
    rows: spread.map((spreadCount, index) => ({
      label: `b${index + 1}`,
      spread: spreadCount,
      constant: constant[index]
    }))
  };
}

export const retrievalCorpus = [
  { id: "d1", text: "Private Endpoint design requires private DNS zones and public network review." },
  { id: "d2", text: "Backup restore drills compare RPO, RTO, validation, and replication assumptions." },
  { id: "d3", text: "RAG retrieval needs citations, authorization filtering, and answer evaluation." },
  { id: "d4", text: "Container capacity depends on CPU service time, traffic, replicas, and headroom." },
  { id: "d5", text: "Classification evaluation uses precision, recall, confusion matrices, and thresholds." }
] as const;

export const retrievalQueries: readonly { q: string; relevant: readonly (typeof retrievalCorpus)[number]["id"][] }[] = [
  { q: "private dns endpoint", relevant: ["d1"] },
  { q: "restore replication backup", relevant: ["d2"] },
  { q: "capacity cpu traffic", relevant: ["d4"] },
  { q: "evaluation recall", relevant: ["d3", "d5"] },
  { q: "authorization evaluation", relevant: ["d3", "d5"] }
] as const;

function tokenize(text: string): readonly string[] {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function lexicalScore(query: string, text: string): number {
  const body = new Set(tokenize(text));
  return tokenize(query).filter((term) => body.has(term)).length;
}

export function rankRetrieval(query: string) {
  if (!query.trim()) throw new RangeError("query: must not be empty");
  return [...retrievalCorpus]
    .map((doc) => ({ id: doc.id, text: doc.text, score: lexicalScore(query, doc.text) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

export function evaluateRanking(ranking: readonly string[], relevant: readonly string[], k: number) {
  validateNumber("k", k, rules.ai.k);
  assertNonEmptyRelevance("query", relevant);
  const top = ranking.slice(0, k);
  const hits = relevant.filter((id) => top.includes(id)).length;
  const firstFull = ranking.findIndex((id) => relevant.includes(id));
  const firstAtK = top.findIndex((id) => relevant.includes(id));
  return {
    recallAtK: hits / relevant.length,
    reciprocalRankFull: firstFull >= 0 ? 1 / (firstFull + 1) : null,
    reciprocalRankAtK: firstAtK >= 0 ? 1 / (firstAtK + 1) : null
  };
}

export function retrievalMetrics(input: RetrievalInput) {
  const k = validateNumber("k", input.k, rules.ai.k);
  const rows = retrievalQueries.map((query) => {
    assertNonEmptyRelevance(query.q, query.relevant);
    const ranking = rankRetrieval(query.q);
    const rankedIds = ranking.map((doc) => doc.id);
    const metrics = evaluateRanking(rankedIds, query.relevant, k);
    return {
      query: query.q,
      relevant: [...query.relevant],
      ranking,
      topIds: rankedIds.slice(0, k),
      recallAtK: metrics.recallAtK,
      reciprocalRankFull: metrics.reciprocalRankFull,
      reciprocalRankAtK: metrics.reciprocalRankAtK
    };
  });
  return {
    k,
    rows,
    recallAtK: rows.reduce((sum, row) => sum + row.recallAtK, 0) / rows.length,
    mrrFull: rows.reduce((sum, row) => sum + (row.reciprocalRankFull ?? 0), 0) / rows.length,
    mrrAtK: rows.reduce((sum, row) => sum + (row.reciprocalRankAtK ?? 0), 0) / rows.length
  };
}

export function confusionMetrics(input: ConfusionInput) {
  const tp = validateNumber("tp", input.tp, rules.ml.tp);
  const fp = validateNumber("fp", input.fp, rules.ml.fp);
  const fn = validateNumber("fn", input.fn, rules.ml.fn);
  const tn = validateNumber("tn", input.tn, rules.ml.tn);
  const precision = safeRatio(tp, tp + fp);
  const recall = safeRatio(tp, tp + fn);
  const f1Denominator = 2 * tp + fp + fn;
  const f1 = f1Denominator > 0 ? (2 * tp) / f1Denominator : null;
  const accuracy = safeRatio(tp + tn, tp + fp + fn + tn);
  return {
    precision,
    recall,
    f1,
    accuracy,
    rows: [
      { label: "TP", value: tp },
      { label: "FP", value: fp },
      { label: "FN", value: fn },
      { label: "TN", value: tn }
    ]
  };
}

export function getLabResult(kind: "compute", input: ComputeInput, locale?: LabLocale): LabResult;
export function getLabResult(kind: "storage", input: RecoveryInput, locale?: LabLocale): LabResult;
export function getLabResult(kind: "network", input: SubnetInput, locale?: LabLocale): LabResult;
export function getLabResult(kind: "database", input: PartitionInput, locale?: LabLocale): LabResult;
export function getLabResult(kind: "ai", input: RetrievalInput, locale?: LabLocale): LabResult;
export function getLabResult(kind: "ml", input: ConfusionInput, locale?: LabLocale): LabResult;
export function getLabResult(kind: LabKind, input: LabInput, locale?: LabLocale): LabResult;
export function getLabResult(kind: LabKind, input: LabInput, locale: LabLocale = "en"): LabResult {
  const l = labels[locale];
  if (kind === "compute") {
    const result = computeCapacity(input as ComputeInput);
    return {
      summaryRows: [
        { label: l.compute.baseCores, value: formatNumber(result.baseCores, 3), unit: "cores" },
        { label: l.compute.neededCores, value: formatNumber(result.requiredCores, 3), unit: "cores" },
        { label: l.compute.replicas, value: String(result.replicas), unit: "replicas" },
        { label: l.compute.actualUtil, value: `${formatNumber(result.actualUtilization, 1)}%` },
        { label: l.compute.requestedRatio, value: `${formatNumber(result.requestedCapacityRatio, 1)}%` },
        { label: l.compute.serviceTime, value: formatNumber(result.serviceTimeMs, 1), unit: "ms" }
      ],
      detailSections: [],
      chart: {
        title: l.compute.chart,
        unit: "%",
        labels: result.rows.map((row) => `${row.label} replicas`),
        series: [
          { name: l.compute.actualSeries, values: result.rows.map((row) => row.actualUtilization) },
          { name: l.compute.plannedSeries, values: result.rows.map((row) => row.requestedCapacityRatio) }
        ]
      },
      notes: [l.compute.note]
    };
  }
  if (kind === "storage") {
    const result = recoveryTimeline(input as RecoveryInput);
    return {
      summaryRows: [
        { label: l.recovery.total, value: String(result.total), unit: "min" },
        { label: l.recovery.rpo, value: result.rpoOk ? l.pass : l.fail },
        { label: l.recovery.rto, value: result.rtoOk ? l.pass : l.fail }
      ],
      detailSections: [
        {
          title: l.recovery.chart,
          rows: [
            { label: l.recovery.copy, value: String(result.rows[0].value), unit: "min" },
            { label: l.recovery.restore, value: String(result.rows[1].value), unit: "min" },
            { label: l.recovery.validate, value: String(result.rows[2].value), unit: "min" },
            { label: l.recovery.target, value: String(result.target), unit: "min" }
          ]
        }
      ],
      chart: {
        title: l.recovery.chart,
        unit: "min",
        labels: [l.recovery.copy, l.recovery.restore, l.recovery.validate, l.recovery.target],
        series: [{ name: l.recovery.chart, values: [result.rows[0].value, result.rows[1].value, result.rows[2].value, result.target] }]
      },
      notes: [l.recovery.definitions, l.recovery.formula, l.recovery.caveat]
    };
  }
  if (kind === "network") {
    const result = subnetCapacity(input as SubnetInput);
    return {
      summaryRows: [
        { label: l.subnet.network, value: result.network },
        { label: l.subnet.total, value: String(result.total), unit: "addresses" },
        { label: l.subnet.reserved, value: String(result.reserved), unit: "addresses" },
        { label: l.subnet.usable, value: String(result.usable), unit: "addresses" }
      ],
      detailSections: [],
      chart: {
        title: l.subnet.chart,
        unit: "addresses",
        labels: [l.subnet.usable, l.subnet.reserved],
        series: [{ name: l.subnet.chart, values: [result.usable, result.reserved] }]
      },
      notes: [l.subnet.note]
    };
  }
  if (kind === "database") {
    const result = partitionSkew(input as PartitionInput);
    return {
      summaryRows: [
        { label: l.partition.constantMax, value: formatRatio(result.maxConstant, locale) },
        { label: l.partition.spreadMax, value: formatRatio(result.maxSpread, locale) }
      ],
      detailSections: [
        {
          title: l.partition.chart,
          rows: result.rows.map((row) => ({
            label: row.label,
            value: `${l.partition.constant}: ${row.constant}; ${l.partition.spread}: ${row.spread}`,
            unit: "rows"
          }))
        }
      ],
      chart: {
        title: l.partition.chart,
        unit: "rows",
        labels: result.rows.map((row) => row.label),
        series: [
          { name: l.partition.constant, values: result.rows.map((row) => row.constant) },
          { name: l.partition.spread, values: result.rows.map((row) => row.spread) }
        ]
      },
      notes: [l.partition.note]
    };
  }
  if (kind === "ai") {
    const result = retrievalMetrics(input as RetrievalInput);
    return {
      summaryRows: [
        { label: l.retrieval.recall, value: formatRatio(result.recallAtK, locale) },
        { label: l.retrieval.mrrFull, value: formatNumber(result.mrrFull, 3) },
        { label: l.retrieval.mrrCutoff, value: formatNumber(result.mrrAtK, 3) }
      ],
      detailSections: [
        {
          title: l.retrieval.ranking,
          rows: result.rows.map((row) => ({
            label: row.query,
            value: `${l.retrieval.relevant}: ${row.relevant.join(", ")}; ${l.retrieval.ranking}: ${row.ranking.map((doc) => `${doc.id}(${doc.score})`).join(" > ")}; ${l.retrieval.recallRow}: ${formatRatio(row.recallAtK, locale)}; ${l.retrieval.rrFull}: ${row.reciprocalRankFull === null ? l.na : formatNumber(row.reciprocalRankFull, 3)}; ${l.retrieval.rrCutoff}: ${row.reciprocalRankAtK === null ? l.na : formatNumber(row.reciprocalRankAtK, 3)}`
          }))
        }
      ],
      chart: {
        title: l.retrieval.chart,
        unit: "%",
        labels: result.rows.map((row) => row.query),
        series: [{ name: l.retrieval.recallRow, values: result.rows.map((row) => round(row.recallAtK * 100, 1)) }]
      },
      notes: [l.retrieval.note]
    };
  }
  const result = confusionMetrics(input as ConfusionInput);
  return {
    summaryRows: [
      { label: l.confusion.precision, value: formatRatio(result.precision, locale) },
      { label: l.confusion.recall, value: formatRatio(result.recall, locale) },
      { label: l.confusion.f1, value: formatRatio(result.f1, locale) },
      { label: l.confusion.accuracy, value: formatRatio(result.accuracy, locale) }
    ],
    detailSections: [],
    chart: {
      title: l.confusion.chart,
      unit: "count",
      labels: [l.confusion.tp, l.confusion.fp, l.confusion.fn, l.confusion.tn],
      series: [{ name: l.confusion.chart, values: result.rows.map((row) => row.value) }]
    },
    notes: [l.confusion.note]
  };
}
