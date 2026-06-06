// ─── daily_report.json 完整类型定义 ────────────────────────────────────────────
// 数据源：Folio Pipeline 生成的 daily_report.json
// 读取时间：2026-06-06
// ─────────────────────────────────────────────────────────────────────────────────

/** 完整策展数据（对应 daily_report.json 顶层结构） */
export interface CurationData {
  meta: Meta
  pulse: Pulse
  events: Event[]
  leaderboard: LeaderboardEntry[]
  trend: TrendPoint[]
  news: NewsItem[]
  papers: Paper[]
  launches: Launch[]
  insight: Insight
  tomorrow: Tomorrow
  refreshedAt?: string // 前端附加：数据刷新时间
}

// ─── 各字段类型 ───────────────────────────────────────────────────────────────────

export interface Meta {
  date: string       // e.g. "2026-06-06"
  day: number        // e.g. 127
  version: string    // e.g. "2026.06.06"
}

export interface Pulse {
  new_today: number        // 今日新增 Agent 数
  new_growth: string       // 增长趋势，e.g. "+23%"
  hot_project: string      // 最热项目名
  hot_stars: number        // 最热项目 star 数
  papers_count: number     // 论文数
  events_count: number    // 活动数
}

export interface Event {
  title: string
  type: string             // e.g. "conference", "webinar"
  description: string
  time: string
  location: string
  source: string
}

export interface LeaderboardEntry {
  rank: number
  name: string
  org: string              // 组织 / 作者
  stars: number            // 注意：是 number，不是 string（e.g. 198000）
  growth: string           // e.g. "+12%" 或 "677 this week"
  tag: string              // e.g. "AI Agent Framework"
  progress: number         // 0-100，进度条
}

export interface TrendPoint {
  day: string              // e.g. "Mon", "Tue"
  this_week: number
  last_week: number
}

export interface NewsItem {
  icon: string             // emoji，e.g. "🤖"
  title: string
  description: string
  date: string
  source: string
}

export interface Paper {
  number: number
  title: string
  abstract: string
  folio_reason: string     // Folio 策展理由
  source: string
  publish_date: string
  citations: number
}

export interface Launch {
  class: string            // e.g. "A2A Protocol"
  command_class: string    // e.g. "Multi-Agent"
  name: string
  description: string
  tags: string[]           // e.g. ["A2A", "Multi-Agent"]
  stars: number            // 注意：是 number
  growth: string           // e.g. "+12%" 或 "N/A"
}

export interface Insight {
  content: string          // 注意：是对象，不是字符串
  author: string           // e.g. "Folio"
}

export interface Tomorrow {
  question: string         // e.g. "Which Agent will surprise us tomorrow?"
  hint: string             // e.g. "Check the A2A protocol implementations..."
}

// ─── 前端辅助类型 ─────────────────────────────────────────────────────────────────

/** 策展叙事（由 curation-engine.ts 生成，或直接从 daily_report.json 转化） */
export interface CurationNarrative {
  pulse: string            // 一句话脉搏
  narrative: string        // 一段话叙事
  featured: FeaturedAgent[]
  verdict: 'watch' | 'explore' | 'adopt'
}

export interface FeaturedAgent {
  name: string
  org: string
  headline: string         // 一句话标题
  whyNow: string           // 为什么现在重要
  whatItSolves: string     // 解决什么问题
  whoCares: string         // 谁应该关心
  stars: number
  growth: string
  verdict: 'watch' | 'explore' | 'adopt'
}
