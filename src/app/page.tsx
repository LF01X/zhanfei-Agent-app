/**
 * 展飞智媒 — AI Agent 理解引擎
 *
 * 设计原则：
 * - Pulse（脉搏）：一句话判断，不是数字堆砌
 * - Signals（信号）：三段式理解，不是功能列表
 * - Feed（动态流）：新品上线动态，支持产品方 API 推送
 *
 * 服务端渲染：直接读取 daily_report.json
 */

import { CurationShell } from '@/components/curation/CurationShell'
import type { CurationData, ActivityFeedItem } from '@/components/curation/types'
import fs from 'fs/promises'
import path from 'path'

// ─── 服务端数据获取 ─────────────────────────────────────────────────────────────

async function getCuration(): Promise<{
  curation: CurationData
  feed: ActivityFeedItem[]
}> {
  try {
    const reportPath = path.join(process.cwd(), 'daily_report.json')
    const reportRaw = await fs.readFile(reportPath, 'utf-8')
    const report = JSON.parse(reportRaw)

    // 新品动态流：从 launches 转化，后续接入产品方 API
    const feed: ActivityFeedItem[] = (report.launches || []).map((launch: any, i: number) => ({
      id: `launch-${i}`,
      type: 'launch' as const,
      agentName: launch.name,
      agentOrg: launch.command_class,
      description: launch.description,
      tags: launch.tags || [],
      stars: launch.stars || 0,
      growth: launch.growth || '',
      timestamp: new Date().toISOString(),
      source: 'folio-pipeline' as const,
      verified: false
    }))

    return {
      curation: {
        ...report,
        refreshedAt: new Date().toISOString()
      },
      feed
    }
  } catch (error) {
    console.error('Failed to load curation:', error)
    return {
      curation: {
        meta: { date: new Date().toISOString().split('T')[0], day: 0, version: '' },
        pulse: { new_today: 0, new_growth: '', hot_project: '', hot_stars: 0, papers_count: 0, events_count: 0 },
        events: [],
        leaderboard: [],
        trend: [],
        news: [],
        papers: [],
        launches: [],
        insight: { content: '数据加载中', author: 'Folio' },
        tomorrow: { question: '', hint: '' },
        refreshedAt: new Date().toISOString()
      },
      feed: []
    }
  }
}

// ─── 主页面 ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { curation, feed } = await getCuration()
  return <CurationShell curation={curation} feed={feed} />
}
