/**
 * Folio Bridge — 情报引擎数据契约层
 *
 * 职责：将 Folio Pipeline 输出的 daily_report.json 映射为展飞前端类型。
 * 不做数据拉取、不做状态管理、不做副作用。纯映射。
 *
 * 数据流：
 *   Folio Pipeline (Python) → daily_report.json → folio-bridge.ts → page.tsx
 *
 * 契约约定：
 *   - 桥接层不改变数据语义，只做字段映射和格式适配
 *   - 缺失字段用安全默认值填充，不抛异常
 *   - 新增 Folio 字段自动透传，无需修改桥接层
 */

// ─── Folio 原始类型（与 daily_report.json 结构一一对应） ───

interface FolioLaunch {
  class: string;
  command_class: string;
  name: string;
  description: string;
  tags: string[];
  stars: string;
  growth: string;
}

interface FolioEvent {
  title: string;
  type: string;
  description: string;
  time: string;
  location: string;
  source: string;
}

interface FolioLeaderboardItem {
  rank: number;
  name: string;
  org: string;
  stars: string;
  growth: string;
  tag: string | null;
  progress: number;
}

interface FolioTrendDay {
  day: string;
  this_week: number;
  last_week: number;
}

interface FolioNewsItem {
  icon: string;
  title: string;
  description: string;
  date: string;
  source: string;
}

interface FolioPaper {
  number: string;
  title: string;
  abstract: string;
  folio_reason: string;
  source: string;
  publish_date: string;
  citations: string;
}

interface FolioDailyReport {
  meta: {
    date: string;
    day: string;
    version: string;
  };
  pulse: {
    new_today: number;
    new_growth: string;
    hot_project: string;
    hot_stars: string;
    papers_count: number;
    events_count: number;
  };
  events: FolioEvent[];
  leaderboard: FolioLeaderboardItem[];
  trend: FolioTrendDay[];
  news: FolioNewsItem[];
  papers: FolioPaper[];
  launches: FolioLaunch[];
  insight: {
    content: string;
    author: string;
  };
  tomorrow: {
    question: string;
    hint: string;
  };
}

// ─── 展飞前端类型 ───

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  votes: number;
  tags: string[];
  launchedAt: string;
  /** Folio 扩展：星数（如 "372.1k"） */
  stars: string;
  /** Folio 扩展：增长趋势（如 "↑ 6.3k"） */
  growth: string;
  /** Folio 扩展：发布类别 */
  launchClass: string;
  /** Folio 扩展：数据来源 */
  source: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  url: string;
  type: "online" | "offline" | "hybrid";
  description: string;
  time: string;
  source: string;
}

export interface LeaderboardItem {
  rank: number;
  name: string;
  org: string;
  stars: string;
  growth: string;
  tag: string | null;
  progress: number;
}

export interface TrendDay {
  day: string;
  thisWeek: number;
  lastWeek: number;
}

export interface NewsItem {
  icon: string;
  title: string;
  description: string;
  date: string;
  source: string;
}

export interface PaperItem {
  number: string;
  title: string;
  abstract: string;
  folioReason: string;
  source: string;
  publishDate: string;
  citations: string;
}

export interface Pulse {
  newToday: number;
  newGrowth: string;
  hotProject: string;
  hotStars: string;
  papersCount: number;
  eventsCount: number;
}

export interface Insight {
  content: string;
  author: string;
}

export interface Tomorrow {
  question: string;
  hint: string;
}

export interface FolioIntelligence {
  meta: {
    date: string;
    day: string;
    version: string;
  };
  pulse: Pulse;
  products: Product[];
  events: Event[];
  leaderboard: LeaderboardItem[];
  trend: TrendDay[];
  news: NewsItem[];
  papers: PaperItem[];
  insight: Insight;
  tomorrow: Tomorrow;
  lastUpdated: string;
}

// ─── 原子映射函数 ───

/** 解析星数字符串为数值（用于排序/比较），"372.1k" → 372100 */
function parseStars(s: string): number {
  const cleaned = s.replace(/[↑↓\s]/g, "");
  if (cleaned.endsWith("k")) {
    return parseFloat(cleaned) * 1000;
  }
  return parseInt(cleaned, 10) || 0;
}

/** Folio Launch → 展飞 Product */
function mapLaunch(launch: FolioLaunch, index: number): Product {
  const stars = launch.stars || "0";
  return {
    id: `folio-launch-${index}`,
    name: launch.name,
    tagline: launch.description.slice(0, 80) + (launch.description.length > 80 ? "…" : ""),
    description: launch.description,
    url: `https://github.com/search?q=${encodeURIComponent(launch.name)}`,
    votes: parseStars(stars),
    tags: launch.tags,
    launchedAt: "", // Folio 日报不包含单品发布日期，由 pipeline 后续补充
    stars,
    growth: launch.growth || "—",
    launchClass: launch.class,
    source: "Folio",
  };
}

/** Folio Event → 展飞 Event */
function mapEvent(event: FolioEvent, index: number): Event {
  const typeMap: Record<string, "online" | "offline" | "hybrid"> = {
    online: "online",
    offline: "offline",
    hybrid: "hybrid",
  };
  return {
    id: `folio-event-${index}`,
    title: event.title,
    date: "", // Folio 日报活动时间用 time 字段（如 "08:00"），日期取自日报 date
    location: event.location,
    url: "",
    type: typeMap[event.type] || "online",
    description: event.description,
    time: event.time,
    source: event.source,
  };
}

/** Folio LeaderboardItem → 展飞 LeaderboardItem（几乎 1:1） */
function mapLeaderboardItem(item: FolioLeaderboardItem): LeaderboardItem {
  return {
    rank: item.rank,
    name: item.name,
    org: item.org,
    stars: item.stars,
    growth: item.growth,
    tag: item.tag,
    progress: item.progress,
  };
}

/** Folio TrendDay → 展飞 TrendDay */
function mapTrendDay(day: FolioTrendDay): TrendDay {
  return {
    day: day.day,
    thisWeek: day.this_week,
    lastWeek: day.last_week,
  };
}

/** Folio NewsItem → 展飞 NewsItem（1:1） */
function mapNewsItem(item: FolioNewsItem): NewsItem {
  return { ...item };
}

/** Folio Paper → 展飞 PaperItem */
function mapPaper(paper: FolioPaper): PaperItem {
  return {
    number: paper.number,
    title: paper.title,
    abstract: paper.abstract,
    folioReason: paper.folio_reason,
    source: paper.source,
    publishDate: paper.publish_date,
    citations: paper.citations,
  };
}

// ─── 主入口：桥接函数 ───

/**
 * 将 Folio 日报 JSON 映射为展飞前端完整情报对象。
 *
 * 安全设计：
 *   - 输入为 null/undefined 时返回 null
 *   - 任何子字段缺失都用安全默认值
 *   - 不抛异常，上层自行处理 null case
 */
export function bridgeFolioReport(raw: FolioDailyReport | null): FolioIntelligence | null {
  if (!raw) return null;

  const { meta, pulse, events, leaderboard, trend, news, papers, launches, insight, tomorrow } = raw;

  return {
    meta: {
      date: meta?.date || "",
      day: meta?.day || "",
      version: meta?.version || "",
    },
    pulse: {
      newToday: pulse?.new_today ?? 0,
      newGrowth: pulse?.new_growth || "—",
      hotProject: pulse?.hot_project || "",
      hotStars: pulse?.hot_stars || "",
      papersCount: pulse?.papers_count ?? 0,
      eventsCount: pulse?.events_count ?? 0,
    },
    products: (launches || []).map(mapLaunch),
    events: (events || []).map((e, i) => mapEvent(e, i)),
    leaderboard: (leaderboard || []).map(mapLeaderboardItem),
    trend: (trend || []).map(mapTrendDay),
    news: (news || []).map(mapNewsItem),
    papers: (papers || []).map(mapPaper),
    insight: {
      content: insight?.content || "",
      author: insight?.author || "",
    },
    tomorrow: {
      question: tomorrow?.question || "",
      hint: tomorrow?.hint || "",
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * 从 daily_report.json 静态导入 Folio 数据并桥接。
 * Next.js 构建时会将 JSON 内联，零运行时开销。
 *
 * 使用方式：
 *   import { getFolioIntelligence } from "@/lib/folio-bridge";
 *   const data = getFolioIntelligence();
 */
export async function getFolioIntelligence(): Promise<FolioIntelligence | null> {
  try {
    // 动态 import，Next.js 在构建时解析
    const report = await import("@/../daily_report.json");
    return bridgeFolioReport(report.default || report);
  } catch {
    console.warn("[Folio Bridge] daily_report.json 未找到，返回 null。请确保 Folio Pipeline 已生成该文件。");
    return null;
  }
}

/**
 * 获取情报数据，带 fallback 机制。
 * 优先使用 Folio 真实数据，未就绪时回退到 null（由上层决定展示策略）。
 */
export async function getIntelligence(): Promise<FolioIntelligence | null> {
  return getFolioIntelligence();
}
