/**
 * 展飞智媒 — AI Native 时代的 Agent 策展平台
 * 
 * 设计哲学：
 * - 对话优先，不是搜索优先
 * - 叙事开场，不是列表开场
 * - 真实数据，不是模拟数据
 * - 有态度，不是中立聚合
 * 
 * 交互流：
 * 1. 用户打开展飞 → 看到"今日策展"叙事
 * 2. 叙事底部有对话输入框 → 用户可以追问
 * 3. 追问在对话流中呈现 → 数据和叙事融合
 */

import { Suspense } from 'react'
import { CurationShell } from '@/components/curation/CurationShell'

// ─── 加载状态 ───────────────────────────────────────────────────────────────────

function CurationLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-zinc-500 text-sm tracking-wider uppercase mb-2">
          展飞智媒
        </div>
        <div className="text-zinc-400 text-lg">
          正在获取今日策展内容...
        </div>
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}

// ─── 主页面 ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <Suspense fallback={<CurationLoading />}>
      <CurationShell />
    </Suspense>
  )
}
