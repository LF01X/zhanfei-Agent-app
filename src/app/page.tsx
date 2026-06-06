/**
 * 展飞智媒 — AI Native 时代的 Agent 策展平台
 *
 * 服务端渲染：直接读取 daily_report.json，转化为 CurationData
 * 客户端组件：CurationShell 接收数据，处理交互
 */

import { CurationShell } from '@/components/curation/CurationShell'
import type { CurationData } from '@/components/curation/types'
import fs from 'fs/promises'
import path from 'path'

// ─── 服务端数据获取 ─────────────────────────────────────────────────────────────

async function getCuration(): Promise<CurationData> {
  try {
    const reportPath = path.join(process.cwd(), 'daily_report.json')
    const reportRaw = await fs.readFile(reportPath, 'utf-8')
    const report = JSON.parse(reportRaw)

    // daily_report.json 的结构直接就是 CurationData，不需要转化
    // 只需要加 refreshedAt 字段
    return {
      ...report,
      refreshedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Failed to load curation:', error)

    // 降级：返回最小化内容
    return {
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
    }
  }
}

// ─── 主页面 ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const curation = await getCuration()
  return <CurationShell initialData={curation} />
}
