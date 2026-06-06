/**
 * types.ts
 * 
 * 展飞策展组件的类型定义
 */

export interface CurationData {
  date: string
  pulse: string
  narrative: string
  featured: FeaturedAgent[]
  events: CurationEvent[]
  insight: string
  refreshedAt: string
}

export interface FeaturedAgent {
  name: string
  tagline: string
  category: string
  stars: number
  growth: number
  tags: string[]
  verdict: 'watch' | 'explore' | 'adopt'
  whyNow: string
  signals: {
    label: string
    insight: string
  }[]
}

export interface CurationEvent {
  title: string
  type: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  description: string
  time: string
  source: string
}

export interface MessageWithData {
  id: string
  role: 'user' | 'assistant'
  content: string
  data?: {
    agents?: FeaturedAgent[]
    sparkline?: number[]
    related?: string[]
  }
}
