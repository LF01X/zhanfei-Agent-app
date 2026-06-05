// Folio 情报引擎数据接口
// 后续由 Folio Agent 自动更新此文件

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  votes: number;
  tags: string[];
  launchedAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  url: string;
  type: "online" | "offline" | "hybrid";
}

/**
 * 获取最新 AI 情报数据
 * 数据源：Folio 情报引擎（每日自动更新）
 *
 * 当前使用 mock 数据，Phase 2 接入真实情报流
 */
export async function getLatestIntelligence(): Promise<{
  products: Product[];
  events: Event[];
  lastUpdated: string;
}> {
  // TODO: Phase 2 — 替换为真实 Folio 情报引擎 API
  // 当前返回 mock 数据用于 MVP 验证
  return {
    products: [
      {
        id: "1",
        name: "Claude 4.0",
        tagline: "Anthropic 最新旗舰模型，推理能力全面升级",
        description:
          "支持 200K context window，工具调用更精准，代码生成质量大幅提升。",
        url: "https://anthropic.com",
        votes: 247,
        tags: ["LLM", "推理", "AI Agent"],
        launchedAt: "2026-06-05",
      },
      {
        id: "2",
        name: "Cursor 2.0",
        tagline: "AI Native 代码编辑器，重新定义开发体验",
        description:
          "深度集成 GPT-4o，支持多文件编辑、智能重构、实时代码审查。",
        url: "https://cursor.sh",
        votes: 189,
        tags: ["开发工具", "AI Coding", "编辑器"],
        launchedAt: "2026-06-03",
      },
      {
        id: "3",
        name: "Vercel v4",
        tagline: "边缘全栈平台，史上最快部署体验",
        description:
          "支持 Edge Functions、ISR、全球 200+ 节点，AI 应用首选部署平台。",
        url: "https://vercel.com",
        votes: 156,
        tags: ["部署", "边缘计算", "全栈"],
        launchedAt: "2026-06-01",
      },
    ],
    events: [
      {
        id: "1",
        title: "WAIC 2026 · AI 开发者大会",
        date: "2026-07-15",
        location: "上海世博中心",
        url: "https://waiconference.com",
        type: "offline",
      },
      {
        id: "2",
        title: "Agent Summit · 智能体生态峰会",
        date: "2026-06-20",
        location: "线上 + 北京",
        url: "https://agentsummit.ai",
        type: "hybrid",
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}
