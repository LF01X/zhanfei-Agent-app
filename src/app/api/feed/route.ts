/**
 * 产品方 API — 推送新品动态到展飞
 *
 * POST /api/feed
 * Content-Type: application/json
 *
 * Body:
 * {
 *   "agentName": "openclaw",
 *   "agentOrg": "OpenClaw Team",
 *   "description": "v3.2 发布，支持 A2A 协议",
 *   "tags": ["A2A", "Multi-Agent"],
 *   "stars": 198340,
 *   "growth": "+12%",
 *   "apiKey": "your-api-key"  // 产品方认证
 * }
 *
 * 响应：
 * { "success": true, "id": "feed-xxx" }
 *
 * 认证：
 * - 产品方需要先申请 apiKey（通过 GitHub Issue 或邮件）
 * - apiKey 存入 .env.local（后续接入数据库）
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// ─── 类型定义 ─────────────────────────────────────────────────────────────────────

interface FeedSubmission {
  agentName: string
  agentOrg: string
  description: string
  tags?: string[]
  stars?: number
  growth?: string
  apiKey: string
}

// ─── POST：接收产品方推送 ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: FeedSubmission = await request.json()

    // 基础验证
    if (!body.agentName || !body.description || !body.apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: agentName, description, apiKey' },
        { status: 400 }
      )
    }

    // TODO：apiKey 验证（后续接入数据库）
    // const isValid = await validateApiKey(body.apiKey)
    // if (!isValid) return NextResponse.json({ error: 'Invalid apiKey' }, { status: 401 })

    // 写入 feed.json（追加模式）
    const feedPath = path.join(process.cwd(), 'feed.json')
    let feed: any[] = []
    try {
      const existing = await fs.readFile(feedPath, 'utf-8')
      feed = JSON.parse(existing)
    } catch {
      // 文件不存在，从空数组开始
    }

    const newItem = {
      id: `feed-${Date.now()}`,
      type: 'launch',
      agentName: body.agentName,
      agentOrg: body.agentOrg || '',
      description: body.description,
      tags: body.tags || [],
      stars: body.stars || 0,
      growth: body.growth || '',
      timestamp: new Date().toISOString(),
      source: 'product-api',
      verified: true
    }

    feed.unshift(newItem) // 最新在前

    // 只保留最近 100 条
    if (feed.length > 100) feed = feed.slice(0, 100)

    await fs.writeFile(feedPath, JSON.stringify(feed, null, 2))

    return NextResponse.json({ success: true, id: newItem.id })
  } catch (error) {
    console.error('Feed submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ─── GET：获取新品动态流（供前端展示） ───────────────────────────────────────────

export async function GET() {
  try {
    const feedPath = path.join(process.cwd(), 'feed.json')
    const feedRaw = await fs.readFile(feedPath, 'utf-8')
    const feed = JSON.parse(feedRaw)
    return NextResponse.json(feed)
  } catch {
    return NextResponse.json([])
  }
}
