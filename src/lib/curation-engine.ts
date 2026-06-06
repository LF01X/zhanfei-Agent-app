/**
 * curation-engine.ts
 * 
 * 策展引擎：把第一原理数据转化为"叙事"
 * 
 * 关键洞察：
 * - 数据不是信息，信息不是知识，知识不是理解
 * - 策展人的价值不在于"聚合"，而在于"赋予意义"
 * - 每个 Agent 背后都有一个故事：它解决了什么问题？为什么现在重要？
 * 
 * 这个文件是展飞的"灵魂"——
 * 它决定了我们如何向用户呈现这个世界的 Agents
 */

import type { AgentIntelligence } from './github-fetcher'

// ─── 类型定义 ───────────────────────────────────────────────────────────────────

export interface CurationNote {
  // 核心叙事
  headline: string
  whyNow: string        // 为什么现在是关注它的时机
  whatItSolves: string  // 它解决了什么问题
  whoCares: string      // 谁应该关心它
  
  // 信号解读（把数据翻译成洞察）
  signals: {
    label: string
    insight: string
  }[]
  
  // 策展人判断
  verdict: 'watch' | 'explore' | 'adopt'
  verdictReason: string
  
  // 关联
  relatedAgents: string[]  // 相关的其他 Agents
}

export interface DailyCuration {
  date: string
  pulse: string            // 今日脉搏（一句话）
  narrative: string        // 今日叙事（一段话）
  featured: {
    agent: string
    note: CurationNote
  }[]
  watchlist: string[]      // 值得关注的 Agents
}

// ─── 策展逻辑 ───────────────────────────────────────────────────────────────────

/**
 * 为单个 Agent 生成策展笔记
 * 
 * 这是"理解"发生的地方——
 * 不是描述，是判断
 */
export function curateAgent(
  intelligence: AgentIntelligence
): CurationNote {
  // 基于第一原理数据做判断
  const isActive = intelligence.velocity.lastPush > 
    new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  
  const isPopular = intelligence.stars > 1000
  const isGrowing = intelligence.growth.trend === 'rising'
  
  // 生成 headline（不是标题，是观点）
  const headline = generateHeadline(intelligence, { isActive, isPopular, isGrowing })
  
  // 生成 whyNow（时机判断）
  const whyNow = generateWhyNow(intelligence, { isActive, isPopular, isGrowing })
  
  // 生成信号解读
  const signals = generateSignals(intelligence)
  
  // 生成 verdict（策展人判断）
  const verdict = isActive && isGrowing ? 'explore' :
    isActive ? 'watch' : 'watch'
  
  return {
    headline,
    whyNow,
    whatItSolves: generateWhatItSolves(intelligence),
    whoCares: generateWhoCares(intelligence),
    signals,
    verdict,
    verdictReason: generateVerdictReason(intelligence, verdict),
    relatedAgents: generateRelated(intelligence)
  }
}

// ─── 辅助函数（策展人视角）───────────────────────────────────────────────────────

function generateHeadline(
  agent: AgentIntelligence, 
  ctx: { isActive: boolean; isPopular: boolean; isGrowing: boolean }
): string {
  if (ctx.isGrowing && ctx.isActive) {
    return `${agent.name} 正在成为 ${agent.language} 生态的关键基础设施`
  }
  if (ctx.isPopular && !ctx.isActive) {
    return `${agent.name} 很受欢迎，但最近似乎慢下来了`
  }
  if (!ctx.isPopular && ctx.isActive) {
    return `${agent.name} 还小，但方向对了`
  }
  return `${agent.name}：${agent.description}`
}

function generateWhyNow(agent: AgentIntelligence, ctx: any): string {
  if (agent.topics.includes('agent')) {
    return `Agent 生态正在从「能不能做」进化到「怎么做对」，${agent.name} 在这个转折点上提供了关键工具。`
  }
  if (agent.topics.includes('ai')) {
    return `AI Native 开发范式正在形成，${agent.name} 是早期信号之一。`
  }
  return `${agent.name} 最近有活跃开发（${Math.floor((Date.now() - new Date(agent.velocity.lastPush).getTime()) / (1000 * 60 * 60 * 24))} 天内有更新），值得看看它在往哪个方向走。`
}

function generateWhatItSolves(agent: AgentIntelligence): string {
  // 基于 topics 和 description 推断
  if (agent.topics.includes('agent-framework')) {
    return '让开发者能更快、更可靠地构建 AI Agents'
  }
  if (agent.topics.includes('cli')) {
    return '把 AI 能力带到终端，让命令行工作流更智能'
  }
  if (agent.topics.includes('sdk')) {
    return '降低 AI 集成的门槛，让任何应用都能快速获得 AI 能力'
  }
  return agent.description || '解决这个问题的方式值得关注'
}

function generateWhoCares(agent: AgentIntelligence): string {
  const roles: string[] = []
  
  if (agent.topics.includes('framework') || agent.topics.includes('sdk')) {
    roles.push('AI 应用开发者')
  }
  if (agent.topics.includes('cli') || agent.topics.includes('tool')) {
    roles.push('终端重度用户')
  }
  if (agent.stars > 5000) {
    roles.push('技术决策者（CTO/技术负责人）')
  }
  
  return roles.length > 0 ? roles.join('、') : '对 AI Native 开发感兴趣的人'
}

function generateSignals(agent: AgentIntelligence): CurationNote['signals'] {
  const signals: CurationNote['signals'] = []
  
  // 星数信号
  if (agent.stars > 0) {
    signals.push({
      label: `⭐ ${agent.stars.toLocaleString()} stars`,
      insight: agent.stars > 10000 ? 
        '已经成为主流工具，社区认可度高' : 
        agent.stars > 1000 ?
        '正在破圈，早期采用者已经在用' :
        '还早，但方向可能对'
    })
  }
  
  // 活跃度信号
  const daysSincePush = Math.floor(
    (Date.now() - new Date(agent.velocity.lastPush).getTime()) / (1000 * 60 * 60 * 24)
  )
  signals.push({
    label: `📅 最近更新 ${daysSincePush} 天前`,
    insight: daysSincePush < 3 ?
      '非常活跃，维护者在认真做' :
      daysSincePush < 14 ?
      '正常维护节奏' :
      '更新频率较低，可能在做大的重构'
  })
  
  // 增长趋势信号
  if (agent.growth.trend === 'rising') {
    signals.push({
      label: `📈 增长趋势：上升`,
      insight: `近期关注度在增加，可能有新版本或新文章带动了讨论`
    })
  }
  
  return signals
}

function generateVerdictReason(agent: AgentIntelligence, verdict: CurationNote['verdict']): string {
  switch (verdict) {
    case 'explore':
      return `活跃开发中，增长趋势明显，建议深入了解它的架构设计`
    case 'watch':
      return `有价值，但还没到「必须用」的程度，保持关注`
    case 'adopt':
      return `成熟可靠，可以直接用于生产环境`
  }
}

function generateRelated(agent: AgentIntelligence): string[] {
  // 基于 topics 找相关
  const related: string[] = []
  
  if (agent.topics.includes('agent')) {
    related.push('openclaw', 'hermes-agent')
  }
  if (agent.topics.includes('cli')) {
    related.push('claude-code')
  }
  if (agent.topics.includes('nextjs') || agent.topics.includes('react')) {
    related.push('vercel/ai')
  }
  
  return related
}

// ─── 今日策展（叙事生成）────────────────────────────────────────────────────────

/**
 * 生成今日策展叙事
 * 
 * 这是展飞首页的"默认开场"——
 * 不是列表，是一段有观点的叙事
 */
export function generateDailyCuration(
  agents: AgentIntelligence[]
): DailyCuration {
  const now = new Date()
  
  // 找出今日最值得关注的 Agent
  const featured = agents
    .filter(a => a.growth.trend === 'rising')
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 3)
  
  const notes = featured.map(agent => ({
    agent: agent.name,
    note: curateAgent(agent)
  }))
  
  // 生成脉搏（一句话）
  const pulse = generatePulse(agents)
  
  // 生成叙事（一段话）
  const narrative = generateNarrative(agents, featured)
  
  return {
    date: now.toISOString().split('T')[0],
    pulse,
    narrative,
    featured: notes,
    watchlist: agents.map(a => a.name)
  }
}

function generatePulse(agents: AgentIntelligence[]): string {
  const rising = agents.filter(a => a.growth.trend === 'rising').length
  const total = agents.length
  
  if (rising === 0) {
    return '今日 Agent 生态相对平静，适合深入阅读代码'
  }
  if (rising > total / 2) {
    return `${rising}/${total} 个追踪中的 Agents 呈上升趋势 —— 本周活跃度偏高`
  }
  return `${rising} 个 Agents 呈上升趋势，生态在稳步演进`
}

function generateNarrative(agents: AgentIntelligence[], featured: AgentIntelligence[]): string {
  if (featured.length === 0) {
    return '今日无特别突出的动态。Agent 生态的演进是持续的，不是每天都有大新闻。这正是深入理解架构的好时机。'
  }
  
  const names = featured.map(a => a.name).join('、')
  return `今日 ${names} 值得关注。它们代表了 Agent 生态的不同方向：${featured[0].topics.slice(0, 2).join(' 和 ')}。不是每个都适合你，但理解它们各自的选择，能帮你厘清自己的方向。`
}

// ─── 公开 API ───────────────────────────────────────────────────────────────────

/**
 * 获取今日策展内容
 * 
 * 这是展飞首页的核心数据源
 * 优先真实数据，降级到 Folio JSON，再降级到生成内容
 */
export async function getTodayCuration(): Promise<DailyCuration> {
  // TODO: 实际调用 getBatchIntelligence 获取真实数据
  // 现在先返回基于 Folio daily_report.json 的内容
  
  // 这个函数在下一步会接入真实数据
  // 现在先做一个接口占位
  
  throw new Error('Not yet implemented: connect to real data source')
}
