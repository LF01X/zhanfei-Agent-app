'use client'

import { useState } from 'react'
import type { CurationData, Launch, LeaderboardEntry, ActivityFeedItem } from './types'

export default function CurationShell({ data }: { data: CurationData }) {
  const [activeView, setActiveView] = useState<'pulse' | 'feed'>('pulse')

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-tight text-zinc-100">展飞智媒</span>
            <span className="text-[10px] text-zinc-500 font-mono">Understanding Engine</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveView('pulse')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'pulse'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              今日脉搏
            </button>
            <button
              onClick={() => setActiveView('feed')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'feed'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              新品动态
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {activeView === 'pulse' ? (
          <PulseView data={data} />
        ) : (
          <FeedView launches={data.launches || []} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-24">
        <div className="max-w-2xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-zinc-600">
          <span>Folio · Understanding Engine</span>
          <span>{data.meta?.date || new Date().toISOString().slice(0, 10)}</span>
        </div>
      </footer>
    </div>
  )
}

/* ── Pulse View ───────────────────────────────────────────── */

function PulseView({ data }: { data: CurationData }) {
  const launches = data.launches || []
  const leaderboard = data.leaderboard || []
  const insight = data.insight
  const tomorrow = data.tomorrow
  const topItem = leaderboard[0]

  return (
    <div className="space-y-16">
      {/* Pulse — 数字冲击力 */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="text-6xl font-bold tracking-tight text-cyan-400 leading-none">
            {launches.length}
          </div>
          <div className="text-lg text-zinc-400 font-light">
            个新品今日发布
          </div>
          {topItem && (
            <div className="text-sm text-zinc-500 mt-2">
              最热 {topItem.name} ({topItem.stars}⭐) · {topItem.growth}
            </div>
          )}
        </div>
      </section>

      {/* Folio Insight — 一句话判断 */}
      {insight && (
        <section className="space-y-4">
          <div className="h-px bg-zinc-800/50" />
          <blockquote className="space-y-3">
            <p className="text-lg text-zinc-300 leading-relaxed font-light">
              {insight.content}
            </p>
            <footer className="text-xs text-zinc-600 font-mono">
              — {insight.author}
            </footer>
          </blockquote>
          <div className="h-px bg-zinc-800/50" />
        </section>
      )}

      {/* Signals — Agent 列表 */}
      <section className="space-y-6">
        <h2 className="text-sm font-medium text-zinc-500 tracking-wider uppercase">
          今日信号
        </h2>
        <div className="space-y-8">
          {launches.slice(0, 8).map((l, i) => (
            <SignalCardView key={l.name + i} launch={l} index={i} />
          ))}
        </div>
      </section>

      {/* Tomorrow — 明日追问 */}
      {tomorrow && (
        <section className="space-y-4">
          <div className="h-px bg-zinc-800/50" />
          <div className="space-y-3">
            <div className="text-sm font-medium text-zinc-500 tracking-wider uppercase">
              明日追问
            </div>
            <p className="text-zinc-400 italic">
              &ldquo;{tomorrow.question}&rdquo;
            </p>
            {tomorrow.hint && (
              <p className="text-sm text-zinc-600">
                💡 {tomorrow.hint}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

/* ── Signal Card ─────────────────────────────────────────── */

function SignalCardView({ launch, index }: { launch: Launch; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="space-y-3 group">
      {/* 序号 + 名字 + star */}
      <div className="flex items-baseline gap-3">
        <span className="text-xs text-zinc-700 font-mono w-4">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-base font-medium text-zinc-200 group-hover:text-cyan-400 transition-colors">
          {launch.name}
        </h3>
        <span className="text-[10px] text-zinc-600 font-mono ml-auto">
          {launch.stars}⭐ · {launch.growth}
        </span>
      </div>

      {/* 描述 + 分类 */}
      <div className="pl-7 space-y-2">
        {launch.description && (
          <p className="text-sm text-zinc-500 leading-relaxed">{launch.description}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-500">
            {launch.class}
          </span>
          {launch.tags?.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-500">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 展开更多 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="pl-7 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        {expanded ? '− 收起' : '+ 详情'}
      </button>

      {expanded && (
        <div className="pl-7 space-y-2 text-sm text-zinc-500">
          <p>分类: {launch.class} / {launch.command_class}</p>
        </div>
      )}

      {/* 分隔线 */}
      {index < 7 && <div className="h-px bg-zinc-800/30 ml-7" />}
    </article>
  )
}

/* ── Feed View ───────────────────────────────────────────── */

function FeedView({ launches }: { launches: Launch[] }) {
  if (launches.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-sm font-medium text-zinc-500 tracking-wider uppercase">
          新品动态
        </h2>
        <div className="text-sm text-zinc-600">
          暂无动态。产品方可通过 API 推送新品信息。
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-medium text-zinc-500 tracking-wider uppercase">
        新品动态
      </h2>
      <div className="space-y-6">
        {launches.map((l, i) => (
          <article key={l.name + i} className="space-y-2 pl-7 border-l border-zinc-800/50 relative">
            <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-cyan-600/60" />
            <div className="flex items-baseline gap-2">
              <h3 className="text-sm font-medium text-zinc-300">{l.name}</h3>
              <span className="text-[10px] text-zinc-600 font-mono">{l.class}</span>
            </div>
            {l.description && (
              <p className="text-sm text-zinc-500 leading-relaxed">{l.description}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span>{l.stars}⭐</span>
              <span>{l.growth}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
