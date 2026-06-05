/**
 * 展飞智媒 · 情报数据接口
 *
 * 类型定义统一来自 folio-bridge.ts（单一数据源）。
 * getLatestIntelligence() 优先使用 Folio 真实数据，未就绪时返回空数据集。
 */

// Re-export 统一类型，保持向后兼容
export type {
  Product,
  Event,
  LeaderboardItem,
  TrendDay,
  NewsItem,
  PaperItem,
  Pulse,
  Insight,
  Tomorrow,
  FolioIntelligence,
} from "./folio-bridge";

import { getIntelligence, type FolioIntelligence } from "./folio-bridge";

/**
 * 获取最新 AI 情报数据
 *
 * 数据源：Folio 情报引擎 daily_report.json（每日由 Pipeline 自动更新）
 * Fallback：Folio 数据未就绪时返回空数据集，前端正常渲染不报错
 */
export async function getLatestIntelligence(): Promise<{
  products: import("./folio-bridge").Product[];
  events: import("./folio-bridge").Event[];
  pulse: import("./folio-bridge").Pulse | null;
  insight: import("./folio-bridge").Insight | null;
  lastUpdated: string;
}> {
  const data: FolioIntelligence | null = await getIntelligence();

  if (data) {
    return {
      products: data.products,
      events: data.events,
      pulse: data.pulse,
      insight: data.insight,
      lastUpdated: data.lastUpdated,
    };
  }

  // Folio 数据未就绪 — 返回空集，不阻塞页面渲染
  return {
    products: [],
    events: [],
    pulse: null,
    insight: null,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * 获取完整 Folio 情报（含榜单、趋势、论文等全部维度）
 * 供需要全量数据的页面使用
 */
export async function getFullIntelligence(): Promise<FolioIntelligence | null> {
  return getIntelligence();
}
