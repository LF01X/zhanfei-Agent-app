'use client'

import { useState } from 'react'
import type { CurationData } from './types'

// ─── 主组件 ─────────────────────────────────────────────────────────────────────

export function CurationShell({ initialData }: { initialData: CurationData }) {
  const [curation] = useState<CurationData>(initialData)

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
      <main className="pt-12 pb-24 max-w-2xl mx-auto px-6 space-y-12">
        {/* 今日脉搏 */}
        <section className="space-y-3">
          <div className="flex items-baseline gap-3">
            <div className="text-5xl font-light text-zinc-100">
              {curation.pulse.new_today}
            </div>
            <div className="text-zinc-500 text-sm">个新品今日发布</div>
          </div>
          <div className="text-zinc-600 text-xs">
            增长 {curation.pulse.new_growth} · 最热项目 {curation.pulse.hot_project} ({curation.pulse.hot_stars.toLocaleString()} stars)
          </div>
        </section>

        {/* 策展叙事 */}
        <section className="space-y-4">
          <div className="text-zinc-400 text-sm leading-relaxed">
            {curation.meta.version} · {curation.pulse.new_today} 个新品，{curation.papers.length} 篇论文，{curation.events.length} 个活动。
            这不是列表，是策展——每个入选的 Agent，都值得你花时间。
          </div>
        </section>

        {/* Featured Launches */}
        {curation.launches.length > 0 && (
          <section className="space-y-6">
            <div className="text-zinc-500 text-xs tracking-widest uppercase">今日策展</div>
            {curation.launches.map((launch, i) => (
              <LaunchCard key={i} launch={launch} />
            ))}
          </section>
        )}

        {/* Leaderboard */}
        {curation.leaderboard.length > 0 && (
          <section className="space-y-6">
            <div className="text-zinc-500 text-xs tracking-widest uppercase">排行榜</div>
            {curation.leaderboard.map((entry) => (
              <LeaderboardCard key={entry.rank} entry={entry} />
            ))}
          </section>
        )}

        {/* 策展人判断 */}
        <section className="border-t border-zinc-800/50 pt-8 space-y-4">
          <div className="text-zinc-500 text-xs tracking-widest uppercase">策展人笔记</div>
          <blockquote className="text-zinc-300 text-sm leading-relaxed italic border-l-2 border-zinc-700 pl-4">
            {curation.insight.content}
          </blockquote>
          <div className="text-zinc-600 text-xs">— {curation.insight.author}</div>
        </section>

        {/* 明日预告 */}
        {curation.tomorrow.question && (
          <section className="bg-zinc-900/50 rounded-lg p-4 space-y-2">
            <div className="text-zinc-400 text-sm font-medium">明日追问</div>
            <div className="text-zinc-300 text-sm">{curation.tomorrow.question}</div>
            <div className="text-zinc-600 text-xs">{curation.tomorrow.hint}</div>
          </section>
        )}
      </main>
    </div>
  )
}

// ─── 子组件 ─────────────────────────────────────────────────────────────────────

function LaunchCard({ launch }: { launch: CurationData['launches'][0] }) {
  return (
    <div className="space-y-3 pb-6 border-b border-zinc-800/30 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-zinc-100 text-sm font-medium">{launch.name}</div>
          <div className="text-zinc-500 text-xs mt-1">{launch.class} · {launch.command_class}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-zinc-300 text-sm font-mono">{launch.stars >= 1000 ? `${(launch.stars / 1000).toFixed(1)}k` : launch.stars}</div>
          <div className="text-zinc-500 text-xs">{launch.growth}</div>
        </div>
      </div>
      <div className="text-zinc-400 text-sm leading-relaxed">{launch.description}</div>
      {launch.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {launch.tags.map((tag) => (
            <span key={tag} className="text-zinc-600 text-xs bg-zinc-900 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function LeaderboardCard({ entry }: { entry: CurationData['leaderboard'][0] }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-zinc-800/30 last:border-0">
      <div className="text-zinc-600 text-sm w-6 text-right">{entry.rank}</div>
      <div className="flex-1 min-w-0">
        <div className="text-zinc-200 text-sm font-medium truncate">{entry.name}</div>
        <div className="text-zinc-500 text-xs">{entry.org}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-zinc-300 text-sm font-mono">{entry.stars >= 1000 ? `${(entry.stars / 1000).toFixed(0)}k` : entry.stars}</div>
        <div className="text-zinc-500 text-xs">{entry.growth}</div>
      </div>
    </div>
  )
}
