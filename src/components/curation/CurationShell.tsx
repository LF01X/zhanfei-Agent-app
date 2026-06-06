'use client'

import { useState } from 'react'
import type { CurationData, ActivityFeedItem } from './types'

// ─── 主组件 ─────────────────────────────────────────────────────────────────────

export function CurationShell({
  curation,
  feed
}: {
  curation: CurationData
  feed: ActivityFeedItem[]
}) {
  const [activeView, setActiveView] = useState<'pulse' | 'feed'>('pulse')

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* 顶部栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="text-xs text-zinc-500 tracking-widest uppercase">展飞智媒</div>

          {/* 视图切换 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveView('pulse')}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                activeView === 'pulse'
                  ? 'bg-zinc-800 text-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              今日脉搏
            </button>
            <button
              onClick={() => setActiveView('feed')}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                activeView === 'feed'
                  ? 'bg-zinc-800 text-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              新品动态
            </button>
          </div>

          {curation.refreshedAt && (
            <div className="text-xs text-zinc-700 hidden sm:block">
              {new Date(curation.refreshedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </header>

      {/* 主内容 */}
      <main className="pt-16 pb-24 max-w-2xl mx-auto px-6">
        {activeView === 'pulse' ? (
          <PulseView curation={curation} />
        ) : (
          <FeedView feed={feed} />
        )}
      </main>
    </div>
  )
}

// ─── 今日脉搏视图 ────────────────────────────────────────────────────────────────

function PulseView({ curation }: { curation: CurationData }) {
  return (
    <div className="space-y-12">
      {/* Pulse：今日脉搏 */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <div className="text-5xl font-light text-zinc-100">
            {curation.pulse.new_today}
          </div>
          <div className="text-zinc-500 text-sm">个新品今日发布</div>
        </div>

        <div className="text-zinc-600 text-xs font-mono">
          {curation.pulse.new_growth} · {curation.pulse.hot_project} ({curation.pulse.hot_stars.toLocaleString()} stars)
        </div>

        {/* Folio 判断 */}
        <blockquote className="text-zinc-300 text-lg leading-relaxed italic border-l-2 border-cyan-400/50 pl-4 mt-6">
          {curation.pulse.new_today > 0
            ? `今日有 ${curation.launches?.[0]?.name || '多个新品'} 值得关注。${curation.insight.content}`
            : '今日无特别突出的动态。Agent 生态的演进是持续的，不是每天都有大新闻。'
          }
        </blockquote>
        <div className="text-zinc-600 text-xs">— {curation.insight.author}</div>
      </section>

      {/* Signals：今日策展（三段式理解） */}
      {curation.launches.length > 0 && (
        <section className="space-y-8 pt-8 border-t border-zinc-800/50">
          <div className="text-zinc-500 text-xs tracking-widest uppercase">今日信号</div>
          {curation.launches.map((launch, i) => (
            <SignalCard key={i} launch={launch} />
          ))}
        </section>
      )}

      {/* 明日追问 */}
      {curation.tomorrow.question && (
        <section className="bg-zinc-900/50 rounded-lg p-4 space-y-2 mt-8">
          <div className="text-zinc-400 text-sm font-medium">明日追问</div>
          <div className="text-zinc-300 text-sm">{curation.tomorrow.question}</div>
          <div className="text-zinc-600 text-xs">{curation.tomorrow.hint}</div>
        </section>
      )}
    </div>
  )
}

// ─── 新品动态流视图 ──────────────────────────────────────────────────────────────

function FeedView({ feed }: { feed: ActivityFeedItem[] }) {
  return (
    <div className="space-y-8">
      <div className="text-zinc-500 text-xs tracking-widest uppercase">新品动态流</div>

      {feed.length === 0 ? (
        <div className="text-zinc-600 text-sm">暂无动态，产品方 API 接入中...</div>
      ) : (
        <div className="space-y-6">
          {feed.map((item) => (
            <FeedItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* 产品方 API 入口 */}
      <section className="bg-zinc-900/30 rounded-lg p-4 space-y-2 border border-zinc-800/50">
        <div className="text-zinc-400 text-sm font-medium">产品方接入</div>
        <div className="text-zinc-500 text-xs leading-relaxed">
          如果你是 Agent 产品方，可以通过 API 推送新品动态到展飞。
          <br />
          支持格式：JSON POST to <code className="text-cyan-400/70">/api/feed</code>
        </div>
        <a
          href="/docs/api"
          className="text-cyan-400/70 text-xs hover:text-cyan-400 transition-colors inline-block mt-2"
        >
          查看 API 文档 →
        </a>
      </section>
    </div>
  )
}

// ─── 子组件 ─────────────────────────────────────────────────────────────────────

/** SignalCard：三段式理解（为什么重要 / 解决什么 / 谁该关心） */
function SignalCard({ launch }: { launch: CurationData['launches'][0] }) {
  return (
    <div className="space-y-4 pb-8 border-b border-zinc-800/30 last:border-0">
      {/* 标题 + 数据 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-zinc-100 text-base font-medium">{launch.name}</div>
          <div className="text-zinc-500 text-xs mt-1">{launch.class} · {launch.command_class}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-zinc-300 text-sm font-mono">
            {launch.stars >= 1000 ? `${(launch.stars / 1000).toFixed(1)}k` : launch.stars}
          </div>
          <div className="text-zinc-500 text-xs">{launch.growth}</div>
        </div>
      </div>

      {/* 三段式理解 */}
      <div className="space-y-3 text-sm">
        <div>
          <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">为什么现在重要</div>
          <div className="text-zinc-300 leading-relaxed">
            {launch.class.includes('Protocol') || launch.tags.includes('A2A')
              ? `${launch.name} 实现了 ${launch.tags.join(' / ')} 协议，这是多 Agent 协作的标准化起点。`
              : `${launch.name} 在 ${launch.command_class} 领域持续演进，值得关注其设计思路。`
            }
          </div>
        </div>

        <div>
          <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">解决什么问题</div>
          <div className="text-zinc-400 leading-relaxed">{launch.description}</div>
        </div>

        <div>
          <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">谁应该关心</div>
          <div className="text-zinc-500 leading-relaxed text-xs">
            {launch.class.includes('Protocol')
              ? '如果你在做多 Agent 系统，这是你必须看的。'
              : launch.stars > 10000
              ? '已经成为社区认可的工具，值得了解它的设计思路。'
              : '在早期阶段，方向值得关注。'
            }
          </div>
        </div>
      </div>

      {/* 标签 */}
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

/** FeedItemCard：新品动态流卡片 */
function FeedItemCard({ item }: { item: ActivityFeedItem }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-zinc-800/30 last:border-0">
      {/* 类型标识 */}
      <div className={`shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${
        item.type === 'launch' ? 'bg-cyan-400' :
        item.type === 'update' ? 'bg-blue-400' :
        'bg-amber-400'
      }`} />

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-zinc-200 text-sm font-medium">{item.agentName}</span>
          <span className="text-zinc-500 text-xs">{item.agentOrg}</span>
        </div>
        <div className="text-zinc-400 text-sm leading-relaxed">{item.description}</div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-600">{item.stars >= 1000 ? `${(item.stars / 1000).toFixed(1)}k` : item.stars} stars</span>
          <span className="text-zinc-600">{item.growth}</span>
          <span className="text-zinc-700">
            {new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {item.verified && (
            <span className="text-cyan-400/70 text-xs">✓ 已验证</span>
          )}
        </div>
      </div>
    </div>
  )
}
