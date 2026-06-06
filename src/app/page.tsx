/**
 * 展飞智媒 — AI Native 时代的 Agent 策展平台
 *
 * 服务端渲染：数据在服务端获取，页面直接渲染
 * 客户端组件：CurationShell 接收数据，处理交互
 */

import { CurationShell } from '@/components/curation/CurationShell'
import type { CurationData } from '@/components/curation/types'
import fs from 'fs/promises'
import path from 'path'

// ─── 服务端数据获取 ─────────────────────────────────────────────────────────────

/**
 * 读取 Folio daily_report.json 并转化为策展格式
 *
 * 为什么不用 fetch('/api/curation')？
 * - 构建时（SSG）没有运行中的服务器，fetch 会失败
 * - 直接读取文件更可靠，不需要网络请求
 * - 数据已经在项目根目录，直接解析即可
 */
async function getCuration(): Promise<CurationData> {
  try {
    const reportPath = path.join(process.cwd(), 'daily_report.json')
    const reportRaw = await fs.readFile(reportPath, 'utf-8')
    const report = JSON.parse(reportRaw)

    // 转化为策展格式
    return {
      date: report.meta?.date || new Date().toISOString().split('T')[0],
      pulse: report.pulse?.new_today
        ? `${report.pulse.new_today} 个新品发布，${report.pulse.new_growth || ''} 增长`
        : 'Agent 生态持续演进中',
      narrative: generateNarrative(report),
      featured: (report.launches || []).slice(0, 3).map((launch: any) => ({
        name: launch.name,
        tagline: launch.description,
        category: launch.launch_class || 'TOOL',
        stars: parseStars(launch.stars),
        growth: parseGrowth(launch.growth),
        tags: launch.tags || [],
        verdict: parseStars(launch.stars) > 1000 ? 'explore' : 'watch',
        whyNow: generateWhyNow(launch),
        signals: generateSignals(launch)
      })),
      events: (report.events || []).map((event: any) => ({
        title: event.title,
        type: (event.type?.toUpperCase() || 'ONLINE') as 'ONLINE' | 'OFFLINE' | 'HYBRID',
        description: event.description,
        time: event.time,
        source: event.source
      })),
      insight: typeof report.insight === 'string' ? report.insight : report.insight?.content || '',
      refreshedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Failed to load curation:', error)

    // 降级：返回最小化内容
    return {
      date: new Date().toISOString().split('T')[0],
      pulse: '数据加载中',
      narrative: '今日策展内容正在生成，请稍候。',
      featured: [],
      events: [],
      insight: '',
      refreshedAt: new Date().toISOString()
    }
  }
}

// ─── 辅助函数 ───────────────────────────────────────────────────────────────────

function generateNarrative(report: any): string {
  const launches = report.launches || []
  const events = report.events || []

  if (launches.length === 0 && events.length === 0) {
    return '今日无特别突出的动态。Agent 生态的演进是持续的，不是每天都有大新闻。'
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

function parseStars(stars: string | number | undefined): number {
  if (typeof stars === 'number') return stars
  if (typeof stars === 'string') {
    // 处理 "372.1k" 格式
    const match = stars.match(/^([\d.]+)([kmb]?)$/i)
    if (!match) return 0
    const num = parseFloat(match[1])
    const unit = match[2].toLowerCase()
    if (unit === 'k') return num * 1000
    if (unit === 'm') return num * 1000000
    if (unit === 'b') return num * 1000000000
    return num
  }
  return 0
}

function parseGrowth(growth: string | number | undefined): number {
  if (typeof growth === 'number') return growth
  if (typeof growth === 'string') {
    // 处理 "↑ 6.3k" 格式
    const match = growth.match(/[\d.]+/)
    return match ? parseFloat(match[0]) : 0
  }
  return 0
}

function generateWhyNow(launch: any): string {
  const stars = parseStars(launch.stars)
  const growth = parseGrowth(launch.growth)

  if (stars > 5000) {
    return '已经成为社区认可的工具，值得了解它的设计思路'
  }
  if (growth > 50) {
    return '近期增长明显，可能有新版本或新讨论带动了关注'
  }
  return '在早期阶段，方向值得关注'
}

function generateSignals(launch: any): { label: string; insight: string }[] {
  const signals: { label: string; insight: string }[] = []
  const stars = parseStars(launch.stars)
  const growth = parseGrowth(launch.growth)

  if (stars > 0) {
    signals.push({
      label: `${stars.toLocaleString()} stars`,
      insight: stars > 5000 ? '主流工具' : stars > 1000 ? '正在破圈' : '早期阶段'
    })
  }

  if (growth > 0) {
    signals.push({
      label: `+${growth} 近期增长`,
      insight: growth > 100 ? '增长很快，值得深入了解' : '稳定增长中'
    })
  }

  return signals
}

// ─── 主页面 ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const curation = await getCuration()
  return <CurationShell initialData={curation} />
}
