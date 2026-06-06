/**
 * 展飞智媒 — AI Agent 理解引擎
 *
 * 设计原则：
 * - Pulse（脉搏）：数字冲击力 + 一句话判断
 * - Signals（信号）：Agent 列表 + 分类标签
 * - Feed（动态流）：新品上线动态
 *
 * 服务端渲染：直接读取 daily_report.json
 */

import CurationShell from '@/components/curation/CurationShell'
import type { CurationData } from '@/components/curation/types'
import fs from 'fs/promises'
import path from 'path'

// ─── 服务端数据获取 ─────────────────────────────────────────────────────────────

async function getCuration(): Promise<CurationData> {
  try {
    const reportPath = path.join(process.cwd(), 'daily_report.json')
    const reportRaw = await fs.readFile(reportPath, 'utf-8')
    const report = JSON.parse(reportRaw)

    return {
      ...report,
      refreshedAt: new Date().toISOString(),
    } as CurationData
  } catch (error) {
    console.error('Failed to load curation:', error)
    return {
      meta: { date: new Date().toISOString().split('T')[0], day: 0, version: '' },
      pulse: { new_today: 0, new_growth: '', hot_project: '', hot_stars: 0, papers_count: 0, events_count: 0 },
      events: [],
      leaderboard: [],
      trend: [],
      news: [],
      papers: [],
      launches: [],
      insight: null,
      tomorrow: null,
      refreshedAt: new Date().toISOString(),
    } as CurationData
  }
}

// ─── 主页面 ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const data = await getCuration()
  return <CurationShell data={data} />
}
