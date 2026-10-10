import type { Locale } from "@/i18n";
import { localizePath } from "@/i18n";

const projectData = [
  {
    slug: "customer-service-agent",
    title: { zh: "客服智能体", en: "Customer Service Agent" },
    repo: "https://github.com/easonwangzk/customer-service-agent",
    topics: ["AI", "Azure", "Agent"],
    status: {
      zh: "公开代码 / 学习案例 / README 描述，未在本站运行",
      en: "Public code / learning case / README-based description; not running on this site"
    },
    summary: {
      zh: "README 描述的 Microsoft Foundry 客服演示：React 工作台经 FastAPI BFF 连接 Hosted Agent，并以 Azure Container Apps、Entra 身份、Azure Table Storage 会话与工单式 handoff 组织端到端学习。",
      en: "A Microsoft Foundry customer-service demo described by its README: a React workbench connects through a FastAPI BFF to a Hosted Agent, with Azure Container Apps, Entra identity, Azure Table Storage sessions, and ticket-style handoff framing the end-to-end study."
    },
    flow: {
      zh: ["React 工作台", "FastAPI BFF", "Azure Container Apps", "Foundry Hosted Agent", "Azure AI Search / Table Storage"],
      en: ["React workbench", "FastAPI BFF", "Azure Container Apps", "Foundry Hosted Agent", "Azure AI Search / Table Storage"]
    },
    learn: {
      zh: ["用户偏好需要按用户隔离", "RAG 引用应结构化并可追踪", "合成只读订单不等于真实客服系统"],
      en: ["User preferences need per-user isolation", "RAG citations should be structured and traceable", "Synthetic read-only orders are not a real customer-service system"]
    },
    limits: {
      zh: "未在本站运行；不包含真实人类派单、生产端点、客户数据或可用性声明。",
      en: "Not running on this site; it includes no real human dispatch, production endpoint, customer data, or availability claim."
    },
    related: ["/learn/ai/rag-grounding/", "/learn/compute/container-apps/"]
  },
  {
    slug: "openai-repo",
    title: { zh: "OpenAI 实践样例", en: "OpenAI Practical Examples" },
    repo: "https://github.com/easonwangzk/openai-repo",
    topics: ["AI", "Multimodal"],
    status: { zh: "公开代码 / 学习案例 / README 描述，未在本站运行", en: "Public code / learning case / README-based description; not running on this site" },
    summary: {
      zh: "面向文本、视觉、图像生成、视频异步工作流、语音识别与 TTS 的实践样例仓库。它适合作为 API 能力地图，但模型可用性、凭据与计费均在站外配置。",
      en: "A practical examples repository for text, vision, image generation, asynchronous video workflows, speech recognition, and TTS. It works as an API capability map, while model availability, credentials, and billing are configured off-site."
    },
    flow: { zh: ["Python 样例", "文本 / 视觉提示", "异步媒体任务", "STT / TTS 样例", "官方 API 文档"], en: ["Python examples", "Text / vision prompts", "Async media jobs", "STT / TTS samples", "Official API docs"] },
    learn: { zh: ["把异步任务状态显式建模", "不要在静态站点中嵌入密钥", "多模态输入需要成本与安全边界"], en: ["Model asynchronous task state explicitly", "Do not embed secrets in a static site", "Multimodal input needs cost and safety boundaries"] },
    limits: { zh: "本站不调用模型、不展示生成结果，不承诺具体模型名称在未来仍可用。", en: "This site does not call models or show generated outputs, and it does not promise that specific model names will remain available." },
    related: ["/learn/ai/multimodal-patterns/", "/resources/"]
  },
  {
    slug: "amazon-multimodal-rag-assistant",
    title: { zh: "Amazon 多模态 RAG 助手", en: "Amazon Multimodal RAG Assistant" },
    repo: "https://github.com/easonwangzk/Amazon-Multimodal-RAG-Assistant",
    topics: ["AI", "RAG"],
    status: { zh: "公开代码 / 学习案例 / README 描述，未在本站运行", en: "Public code / learning case / README-based description; not running on this site" },
    summary: {
      zh: "README 描述了面向商品文本与图片检索的 RAG 学习项目：CLIP（Contrastive Language-Image Pre-training）向量、ChromaDB、FastAPI 与 GPT 或本地模型组合。",
      en: "The README describes a RAG learning project for product text and image retrieval: CLIP embeddings, ChromaDB, FastAPI, and GPT or local models."
    },
    flow: { zh: ["商品文本 / 图片", "CLIP 向量", "ChromaDB 检索", "FastAPI 端点", "LLM 回答"], en: ["Product text / image", "CLIP embeddings", "ChromaDB retrieval", "FastAPI endpoint", "LLM answer"] },
    learn: { zh: ["RAG 是 Retrieval-Augmented Generation", "图片与文本向量需要同一检索策略", "演示项目不代表商业集成或平台隶属"], en: ["RAG means Retrieval-Augmented Generation", "Image and text vectors need one retrieval strategy", "A demo project does not imply commercial integration or platform affiliation"] },
    limits: { zh: "未声明与 Amazon 官方关联；本站不运行检索库、不提供购物或推荐结果。", en: "No official Amazon affiliation is asserted; this site does not run the retrieval store or provide shopping or recommendation results." },
    related: ["/learn/ai/rag-grounding/", "/learn/database/search-indexes/"]
  },
  {
    slug: "recommendation-algorithm",
    title: { zh: "推荐算法学习仓库", en: "Recommendation Algorithm" },
    repo: "https://github.com/easonwangzk/Recommendation-Algorithm",
    topics: ["ML", "Python"],
    status: { zh: "公开代码 / 学习案例 / README 描述，未在本站运行", en: "Public code / learning case / README-based description; not running on this site" },
    summary: {
      zh: "公开 README 仅以 Recommendation Algorithm 描述该 Python 学习仓库。本站把它收录为推荐系统入口，不推断未写明的算法类型、数据集或指标。",
      en: "The public README describes this Python learning repository only as Recommendation Algorithm. This site lists it as a recommendation-systems entry point without inferring unstated algorithm types, datasets, or metrics."
    },
    flow: { zh: ["公开仓库入口", "补充问题定义", "核对实现与数据", "再记录评估方法"], en: ["Public repository entry", "Add problem definition", "Review implementation and data", "Then record evaluation method"] },
    learn: { zh: ["算法命名不能替代数据与目标定义", "推荐系统需要离线评估与线上约束分开看", "公开 README 不足时应明确未知"], en: ["Algorithm names do not replace data and objective definitions", "Recommendation systems separate offline evaluation from online constraints", "State unknowns when a public README is thin"] },
    limits: { zh: "不展示命中率、召回率或线上效果；不声称已部署推荐服务。", en: "No hit rate, recall, or online result is shown; no deployed recommendation service is claimed." },
    related: ["/learn/ml/classification-evaluation/", "/learn/ml/mlops-monitoring/"]
  },
  {
    slug: "medllm",
    title: { zh: "MedLLM 医学问答学习", en: "MedLLM" },
    repo: "https://github.com/easonwangzk/MedLLM",
    topics: ["ML", "LLM", "Healthcare"],
    status: { zh: "公开代码 / 学习案例 / README 描述，未在本站运行", en: "Public code / learning case / README-based description; not running on this site" },
    summary: {
      zh: "公开 README 描述了使用 PubMedQA、MedQA-USMLE 等数据和 RLAIF 思路训练医学问答模型的 notebook 项目。本站仅从学习角度解释数据、对齐与评估概念。",
      en: "The public README describes a notebook project that trains a medical QA model with PubMedQA, MedQA-USMLE, and RLAIF ideas. This site explains the data, alignment, and evaluation concepts only from a learning perspective."
    },
    flow: { zh: ["生物医学 QA 数据", "监督微调", "AI 反馈奖励", "基准比较", "Notebook 分析"], en: ["Biomedical QA data", "Supervised fine-tuning", "AI feedback rewards", "Benchmark comparison", "Notebook analysis"] },
    learn: { zh: ["医疗模型必须避免临床有效性外推", "评估集成绩不等于医疗建议", "安全声明需要独立验证与监管语境"], en: ["Medical models must avoid clinical-effectiveness overreach", "Benchmark scores are not medical advice", "Safety claims need independent validation and regulatory context"] },
    limits: { zh: "本站不提供医疗建议、不声称临床效果、不复述 README 中未验证的经济影响为事实。", en: "This site provides no medical advice, claims no clinical effect, and does not repeat unverified economic impact from the README as fact." },
    related: ["/learn/ml/classification-evaluation/", "/about/"]
  },
  {
    slug: "uchicago-rag-system",
    title: { zh: "UChicago RAG 系统", en: "UChicago RAG System" },
    repo: "https://github.com/easonwangzk/Uchicago-RAG-System",
    topics: ["AI", "RAG", "Python"],
    status: { zh: "公开代码 / 学习案例 / README 描述，未在本站运行", en: "Public code / learning case / README-based description; not running on this site" },
    summary: {
      zh: "公开 README 描述了支持 PDF 与 HTML 文档的 RAG 系统，包含命令行与 Streamlit 使用方式、向量检索参数和 OpenAI API 配置要求。",
      en: "The public README describes a RAG system for PDF and HTML documents, with CLI and Streamlit usage, vector retrieval parameters, and OpenAI API configuration requirements."
    },
    flow: { zh: ["PDF / HTML 文档", "切块", "嵌入", "向量检索", "CLI 或 Streamlit 回答"], en: ["PDF / HTML documents", "Chunking", "Embeddings", "Vector retrieval", "CLI or Streamlit answer"] },
    learn: { zh: ["文档解析质量影响答案", "相似度阈值与 top_k 是可调权衡", "学校名称不能被解读为官方背书"], en: ["Document parsing quality affects answers", "Similarity thresholds and top_k are tunable tradeoffs", "A school name must not be read as official endorsement"] },
    limits: { zh: "不声称 UChicago 官方认可；README 中性能数字如被引用也只代表仓库自述，本站未复验。", en: "No official UChicago approval is claimed; any performance numbers in the README represent repository self-description and were not re-tested here." },
    related: ["/learn/ai/rag-grounding/", "/learn/database/search-indexes/"]
  }
] as const;

export const projects = getProjects("zh");

export function getProjects(locale: Locale) {
  return projectData.map((project, index) => ({
    slug: project.slug,
    title: project.title[locale],
    repo: project.repo,
    topics: [...project.topics],
    status: project.status[locale],
    summary: project.summary[locale],
    flow: [...project.flow[locale]],
    learn: [...project.learn[locale]],
    limits: project.limits[locale],
    related: project.related.map((path) => localizePath(path, locale)),
    index
  }));
}

export function getProject(slug: string, locale: Locale = "zh") {
  return getProjects(locale).find((project) => project.slug === slug);
}

