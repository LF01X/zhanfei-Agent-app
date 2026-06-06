/**
 * API Route: /api/curation
 * 
 * 策展叙事 API
 * 
 * 返回今日策展内容（基于 Folio daily_report.json + GitHub 真实数据）
 * 这是首页的默认数据来源
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const revalidate = 3600 // 每小时重新验证

export async function GET(req: NextRequest) {
  try {
    // 读取 Folio 生成的 daily_report.json
    const reportPath = path.join(process.cwd(), 'daily_report.json')
    const reportRaw = await fs.readFile(reportPath, 'utf-8')
    const report = JSON.parse(reportRaw)
    
    // 转化为展飞需要的"策展叙事"格式
    const curation = {
      date: report.meta.date,
      pulse: report.pulse || 'Agent 生态持续演进中',
      narrative: generateNarrative(report),
      featured: (report.launches || []).slice(0, 3).map((launch: any) => ({
        name: launch.name,
        tagline: launch.description,
        category: launch.launch_class || 'TOOL',
        stars: launch.stars || 0,
        growth: launch.growth || 0,
        tags: launch.tags || [],
        verdict: launch.stars > 1000 ? 'explore' : 'watch',
        whyNow: generateWhyNow(launch),
        signals: generateSignals(launch)
      })),
      events: (report.events || []).map((event: any) => ({
        title: event.title,
        type: event.event_type || 'ONLINE',
        description: event.description,
        time: event.time,
        source: event.source
      })),
      insight: report.insight || '',
      refreshedAt: new Date().toISOString()
    }
    
    return NextResponse.json(curation)
  } catch (error) {
    console.error('Failed to load curation:', error)
    
    // 降级：返回最小化内容
    return NextResponse.json({
      date: new Date().toISOString().split('T')[0],
      pulse: '数据加载中',
      narrative: '今日策展内容正在生成，请稍候。',
      featured: [],
      events: [],
      insight: '',
      refreshedAt: new Date().toISOString()
    })
  }
}

// ─── 辅助函数 ─────────────────────────────────────────────────────────────────────

function generateNarrative(report: any): string {
  const launches = report.launches || []
  const events = report.events || []
  
  if (launches.length === 0 && events.length === 0) {
    return '今日无特别突出的动态。Agent 生态的演进是持续的，不是每天都有大新闻。这正是深入理解架构的好时机。'
  }
  
  const parts: string[] = []
  
  if (launches.length > 0) {
    const names = launches.slice(0, 3).map((l: any) => l.name).join('、')
    parts.push(`今日 ${names} 值得关注`)
  }
  
  if (events.length > 0) {
    parts.push(`${events.length} 个行业活动正在进行中`)
  }
  
  return parts.join('。') + '。'
}

function generateWhyNow(launch: any): string {
  if (launch.stars > 5000) {
    return '已经成为社区认可的工具，值得了解它的设计思路'
  }
  if (launch.growth > 50) {
    return '近期增长明显，可能有新版本或新讨论带动了关注'
  }
  return '在早期阶段，方向值得关注'
}

function generateSignals(launch: any): { label: string; insight: string }[] {
  const signals: { label: string; insight: string }[] = []
  
  if (launch.stars > 0) {
    signals.push({
      label: `${launch.stars.toLocaleString()} stars`,
      insight: launch.stars > 5000 ? '主流工具' : launch.stars > 1000 ? '正在破圈' : '早期阶段'
    })
  }
  
  if (launch.growth > 0) {
    signals.push({
      label: `+${launch.growth} 近期增长`,
      insight: launch.growth > 100 ? '增长很快，值得深入了解' : '稳定增长中'
    })
  }
  
  return signals
}
