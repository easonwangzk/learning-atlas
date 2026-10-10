import { withBase } from "@/lib/paths";

export const projects = [
  {
    slug: "customer-service-agent",
    title: "Customer Service Agent",
    repo: "https://github.com/easonwangzk/customer-service-agent",
    topics: ["AI", "Azure", "Agent"],
    status: "公开代码 / 学习案例 / README 描述，未在本站运行",
    summary: "README 描述的 Microsoft Foundry 客服演示：React 工作台经 FastAPI BFF 连接 Hosted Agent，并以 Azure Container Apps、Entra 身份、Azure Table Storage 会话与工单式 handoff 组织端到端学习。",
    flow: ["React workbench", "FastAPI BFF", "Azure Container Apps", "Foundry Hosted Agent", "Azure AI Search / Table Storage"],
    learn: ["用户偏好需要按用户隔离", "RAG 引用应结构化并可追踪", "合成只读订单不等于真实客服系统"],
    limits: "未在本站运行；不包含真实人类派单、生产端点、客户数据或可用性声明。",
    related: [withBase("/learn/ai/rag-grounding/"), withBase("/learn/compute/container-apps/")]
  },
  {
    slug: "openai-repo",
    title: "OpenAI Practical Examples",
    repo: "https://github.com/easonwangzk/openai-repo",
    topics: ["AI", "Multimodal"],
    status: "公开代码 / 学习案例 / README 描述，未在本站运行",
    summary: "面向文本、视觉、图像生成、视频异步工作流、语音识别与 TTS 的实践样例仓库。它适合作为 API 能力地图，但模型可用性、凭据与计费均在站外配置。",
    flow: ["Python examples", "Text / vision prompts", "Async media jobs", "STT / TTS samples", "Official API docs"],
    learn: ["把异步任务状态显式建模", "不要在静态站点中嵌入密钥", "多模态输入需要成本与安全边界"],
    limits: "本站不调用模型、不展示生成结果，不承诺具体模型名称在未来仍可用。",
    related: [withBase("/learn/ai/multimodal-patterns/"), withBase("/resources/")]
  },
  {
    slug: "amazon-multimodal-rag-assistant",
    title: "Amazon Multimodal RAG Assistant",
    repo: "https://github.com/easonwangzk/Amazon-Multimodal-RAG-Assistant",
    topics: ["AI", "RAG"],
    status: "公开代码 / 学习案例 / README 描述，未在本站运行",
    summary: "README 描述了面向商品文本与图片检索的 RAG 学习项目：CLIP（Contrastive Language-Image Pre-training）向量、ChromaDB、FastAPI 与 GPT 或本地模型组合。",
    flow: ["Product text / image", "CLIP embeddings", "ChromaDB retrieval", "FastAPI endpoint", "LLM answer"],
    learn: ["RAG 是 Retrieval-Augmented Generation", "图片与文本向量需要同一检索策略", "演示项目不代表商业集成或平台隶属"],
    limits: "未声明与 Amazon 官方关联；本站不运行检索库、不提供购物或推荐结果。",
    related: [withBase("/learn/ai/rag-grounding/"), withBase("/learn/database/search-indexes/")]
  },
  {
    slug: "recommendation-algorithm",
    title: "Recommendation Algorithm",
    repo: "https://github.com/easonwangzk/Recommendation-Algorithm",
    topics: ["ML", "Python"],
    status: "公开代码 / 学习案例 / README 描述，未在本站运行",
    summary: "公开 README 仅以 Recommendation Algorithm 描述该 Python 学习仓库。本站把它收录为推荐系统入口，不推断未写明的算法类型、数据集或指标。",
    flow: ["Python learning code", "Feature thinking", "Candidate ranking", "Evaluation notes"],
    learn: ["算法命名不能替代数据与目标定义", "推荐系统需要离线评估与线上约束分开看", "公开 README 不足时应明确未知"],
    limits: "不展示命中率、召回率或线上效果；不声称已部署推荐服务。",
    related: [withBase("/learn/ml/classification-evaluation/"), withBase("/learn/ml/mlops-monitoring/")]
  },
  {
    slug: "medllm",
    title: "MedLLM",
    repo: "https://github.com/easonwangzk/MedLLM",
    topics: ["ML", "LLM", "Healthcare"],
    status: "公开代码 / 学习案例 / README 描述，未在本站运行",
    summary: "公开 README 描述了使用 PubMedQA、MedQA-USMLE 等数据和 RLAIF 思路训练医学问答模型的 notebook 项目。本站仅从学习角度解释数据、对齐与评估概念。",
    flow: ["Biomedical QA data", "Supervised fine-tuning", "AI feedback rewards", "Benchmark comparison", "Notebook analysis"],
    learn: ["医疗模型必须避免临床有效性外推", "评估集成绩不等于医疗建议", "安全声明需要独立验证与监管语境"],
    limits: "本站不提供医疗建议、不声称临床效果、不复述 README 中未验证的经济影响为事实。",
    related: [withBase("/learn/ml/model-evaluation/"), withBase("/about/")]
  },
  {
    slug: "uchicago-rag-system",
    title: "UChicago RAG System",
    repo: "https://github.com/easonwangzk/Uchicago-RAG-System",
    topics: ["AI", "RAG", "Python"],
    status: "公开代码 / 学习案例 / README 描述，未在本站运行",
    summary: "公开 README 描述了支持 PDF 与 HTML 文档的 RAG 系统，包含命令行与 Streamlit 使用方式、向量检索参数和 OpenAI API 配置要求。",
    flow: ["PDF / HTML documents", "Chunking", "Embeddings", "Vector retrieval", "CLI or Streamlit answer"],
    learn: ["文档解析质量影响答案", "相似度阈值与 top_k 是可调权衡", "学校名称不能被解读为官方背书"],
    limits: "不声称 UChicago 官方认可；README 中性能数字如被引用也只代表仓库自述，本站未复验。",
    related: [withBase("/learn/ai/rag-grounding/"), withBase("/learn/database/search-indexes/")]
  }
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
