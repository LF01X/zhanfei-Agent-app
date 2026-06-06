// ─── daily_report.json 完整类型定义 ────────────────────────────────────────────
// 数据源：Folio Pipeline 生成的 daily_report.json
// 最后更新：2026-06-06
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
  refreshedAt?: string
}

// ─── 新品动态流 ───────────────────────────────────────────────────────────────────
// 产品方 API 推送 + Folio Pipeline 爬取，统一为 ActivityFeedItem

export interface ActivityFeedItem {
  id: string
  type: 'launch' | 'update' | 'milestone' // 新品发布 / 版本更新 / 里程碑
  agentName: string
  agentOrg: string
  description: string
  tags: string[]
  stars: number
  growth: string
  timestamp: string               // ISO 8601
  source: 'product-api' | 'folio-pipeline' // 来源：产品方推送 / Folio 爬取
  verified: boolean               // 是否通过产品方 API 验证
}

// ─── 各字段类型 ───────────────────────────────────────────────────────────────────

export interface Meta {
  date: string
  day: number
  version: string
}

export interface Pulse {
  new_today: number
  new_growth: string
  hot_project: string
  hot_stars: number
  papers_count: number
  events_count: number
}

export interface Event {
  title: string
  type: string
  description: string
  time: string
  location: string
  source: string
}

export interface LeaderboardEntry {
  rank: number
  name: string
  org: string
  stars: number
  growth: string
  tag: string
  progress: number
}

export interface TrendPoint {
  day: string
  this_week: number
  last_week: number
}

export interface NewsItem {
  icon: string
  title: string
  description: string
  date: string
  source: string
}

export interface Paper {
  number: number
  title: string
  abstract: string
  folio_reason: string
  source: string
  publish_date: string
  citations: number
}

export interface Launch {
  class: string
  command_class: string
  name: string
  description: string
  tags: string[]
  stars: number
  growth: string
}

export interface Insight {
  content: string
  author: string
}

export interface Tomorrow {
  question: string
  hint: string
}
