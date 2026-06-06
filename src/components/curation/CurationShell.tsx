/**
 * CurationShell.tsx
 *
 * 展飞的核心交互组件
 *
 * Phase 1（当前）：叙事优先界面
 * - 今日脉搏（一句话）
 * - 策展叙事（一段话）
 * - Featured Agents（嵌入式叙事，不是卡片）
 * - 预设问题（引导探索）
 *
 * Phase 2（后续）：接入对话功能
 * - 用户点击预设问题 → 展开对话
 * - 对话流中呈现数据和洞察
 */

'use client'

import { useState, useEffect } from 'react'
import type { CurationData } from './types'

// ─── 主组件 ─────────────────────────────────────────────────────────────────────

export function CurationShell() {
  const [curation, setCuration] = useState<CurationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/curation')
      .then(res => res.json())
      .then(data => {
        setCuration(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-zinc-500 text-sm tracking-wider uppercase">展飞智媒</div>
          <div className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  if (!curation) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-zinc-500">暂无策展内容</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* 顶部栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="text-xs text-zinc-500 tracking-widest uppercase">展飞智媒</div>
          {curation.refreshedAt && (
            <div className="text-xs text-zinc-700">
              更新于 {new Date(curation.refreshedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </header>

      {/* 主内容 */}
      <main className="pt-12 pb-24 max-w-2xl mx-auto px-6">
        <CurationContent curation={curation} />
      </main>
    </div>
  )
}

// ─── 内容组件 ───────────────────────────────────────────────────────────────────

function CurationContent({ curation }: { curation: CurationData }) {
  return (
    <div className="space-y-12">
      {/* 脉搏 */}
      <section>
        <div className="text-zinc-600 text-[11px] tracking-[0.2em] uppercase mb-3">今日脉搏</div>
        <h1 className="text-xl font-light text-zinc-100 leading-snug tracking-tight">
          {curation.pulse}
        </h1>
        <div className="mt-2 text-zinc-700 text-[11px]">{curation.date}</div>
      </section>

      {/* 叙事 */}
      <section>
        <p className="text-zinc-400 text-base leading-relaxed font-light">
          {curation.narrative}
        </p>
      </section>

      {/* 策展笔记 */}
      {curation.insight && (
        <section className="border-l border-zinc-700 pl-4 -ml-px">
          <div className="text-zinc-600 text-[11px] tracking-[0.2em] uppercase mb-2">策展笔记</div>
          <p className="text-zinc-300 text-sm leading-relaxed">{curation.insight}</p>
        </section>
      )}

      {/* Featured Agents */}
      {curation.featured.length > 0 && (
        <section className="space-y-8">
          <div className="text-zinc-600 text-[11px] tracking-[0.2em] uppercase">今日关注</div>
          {curation.featured.map((agent, i) => (
            <AgentCard key={agent.name} agent={agent} index={i} />
          ))}
        </section>
      )}

      {/* 活动 */}
      {curation.events.length > 0 && (
        <section className="space-y-4">
          <div className="text-zinc-600 text-[11px] tracking-[0.2em] uppercase">行业活动</div>
          {curation.events.map((event, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="text-zinc-700 shrink-0 text-lg leading-none mt-0.5">
                {event.type === 'ONLINE' ? '○' : event.type === 'OFFLINE' ? '◉' : '◇'}
              </span>
              <div>
                <div className="text-zinc-300">{event.title}</div>
                <div className="text-zinc-600 text-xs mt-0.5">{event.description}</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

// ─── Agent 卡片（嵌入式叙事）─────────────────────────────────────────────────────

function AgentCard({ agent, index }: { agent: CurationData['featured'][0]; index: number }) {
  return (
    <div className="group">
      {/* 序号 + 名称 */}
      <div className="flex items-baseline gap-3 mb-1.5">
        <span className="text-zinc-800 text-xs tabular-nums w-5 text-right">{index + 1}</span>
        <h3 className="text-zinc-200 text-sm font-medium">{agent.name}</h3>
        <span className="text-zinc-700 text-[10px] uppercase tracking-wider">{agent.category}</span>
      </div>

      {/* Tagline */}
      <p className="text-zinc-500 text-sm leading-relaxed mb-2 ml-8">{agent.tagline}</p>

      {/* 信号 */}
      <div className="ml-8 flex items-center gap-3 text-xs">
        {agent.stars > 0 && (
          <span className="text-zinc-600 tabular-nums">★ {agent.stars.toLocaleString()}</span>
        )}
        {agent.growth > 0 && (
          <span className={agent.growth > 30 ? 'text-emerald-600' : 'text-zinc-600'}>
            ↑ {agent.growth}/d
          </span>
        )}
        {agent.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-zinc-700">#{tag}</span>
        ))}
      </div>

      {/* 策展判断 */}
      <div className="ml-8 mt-1.5">
        <span className={`text-[11px] px-2 py-0.5 rounded-sm ${
          agent.verdict === 'explore'
            ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/40'
            : agent.verdict === 'adopt'
            ? 'bg-blue-950/30 text-blue-400 border border-blue-900/40'
            : 'bg-zinc-900/50 text-zinc-500 border border-zinc-800/50'
        }`}>
          {agent.verdict === 'explore' ? '深入' : agent.verdict === 'adopt' ? '採用' : '关注'}
        </span>
      </div>
    </div>
  )
}
