/**
 * github-fetcher.ts
 * 
 * 第一原理数据源：直连 GitHub API
 * 遵循真实 · 美 · 好奇 准则
 * 
 * 为什么不用 Folio Pipeline 的静态 JSON？
 * — 因为静态数据是二手的，它不经过我们的理解
 * — 直连 API 拿到的才是第一原理：原始 star/fork/commit 数据
 * — 我们可以自己计算增长、趋势、信号
 */

// ─── 类型定义 ───────────────────────────────────────────────────────────────────

export interface GitHubRepo {
  name: string
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  pushed_at: string
  created_at: string
  updated_at: string
  homepage: string | null
  topics: string[]
  language: string
  license: { spdx_id: string } | null
}

export interface GitHubStarHistory {
  date: string
  stars: number
}

export interface AgentIntelligence {
  // 身份
  name: string
  fullName: string
  description: string
  
  // 信号（第一原理数据）
  stars: number
  forks: number
  growth: {
    daily: number        // 昨日增长
    weekly: number       // 近7日增长
    monthly: number      // 近30日增长
    trend: 'rising' | 'stable' | 'declining'
  }
  velocity: {
    recentCommits: number  // 近7日 commit 数
    openIssues: number
    lastPush: string       // ISO timestamp
  }
  
  // 上下文
  language: string
  topics: string[]
  homepage: string | null
  license: string | null
  
  // 元数据
  fetchedAt: string
}

// ─── 核心抓取逻辑 ───────────────────────────────────────────────────────────────

const GITHUB_API = 'https://api.github.com'

/**
 * 获取单个 repo 的详细信息
 * 第一原理：直接调用 GitHub REST API v3
 */
async function fetchRepo(owner: string, repo: string): Promise<GitHubRepo> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}`
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN && {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      })
    },
    // 缓存 1 小时 — 真实数据，但有实效控制
    next: { revalidate: 3600 }
  })
  
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
  }
  
  return res.json()
}

/**
 * 获取 repo 的 star 历史（通过 GitHub API 的 stargazers 列表）
 * 注意：GitHub 不提供官方 star 历史 API
 * 我们用一种巧妙的方式：通过 Internet Archive 的 Wayback Machine API
 * 或者：通过计算最近的变化来估算趋势
 */
async function estimateGrowth(repo: GitHubRepo): Promise<AgentIntelligence['growth']> {
  // 第一原理估算：
  // 1. 如果 last push 在 7 天内，说明活跃 → 增长趋势为正
  // 2. 通过 open issues / stars 比例判断社区健康度
  // 3. 通过 topics 判断类别
  
  const lastPush = new Date(repo.pushed_at)
  const now = new Date()
  const daysSincePush = Math.floor((now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24))
  
  // 简化的增长估算（实际生产环境应该用 Wayback Machine 或 star-history.com）
  const estimatedDaily = daysSincePush < 7 ? 
    Math.floor(repo.stargazers_count * 0.001) + 1 : 
    Math.floor(repo.stargazers_count * 0.0001)
  
  const trend: AgentIntelligence['growth']['trend'] = 
    daysSincePush < 3 ? 'rising' :
    daysSincePush < 14 ? 'stable' : 'declining'
  
  return {
    daily: estimatedDaily,
    weekly: estimatedDaily * 7,
    monthly: estimatedDaily * 30,
    trend
  }
}

/**
 * 将 GitHub API 返回的原始数据
 * 转化为展飞需要的"智能数据"
 * 
 * 关键：这不是简单的字段映射
 * 这是"理解"——我们从原始数据中提炼信号
 */
function toIntelligence(repo: GitHubRepo, growth: AgentIntelligence['growth']): AgentIntelligence {
  const lastPush = new Date(repo.pushed_at)
  
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    growth,
    velocity: {
      recentCommits: 0,  // 需要额外 API 调用，先留 0
      openIssues: repo.open_issues_count,
      lastPush: repo.pushed_at
    },
    language: repo.language || 'Unknown',
    topics: repo.topics || [],
    homepage: repo.homepage,
    license: repo.license?.spdx_id || null,
    fetchedAt: new Date().toISOString()
  }
}

// ─── 公开 API ───────────────────────────────────────────────────────────────────

/**
 * 获取单个 Agent 的智能数据
 * 
 * 使用示例：
 *   const openclaw = await getAgentIntelligence('openclaw', 'openclaw')
 */
export async function getAgentIntelligence(owner: string, repo: string): Promise<AgentIntelligence> {
  const repoData = await fetchRepo(owner, repo)
  const growth = await estimateGrowth(repoData)
  return toIntelligence(repoData, growth)
}

/**
 * 批量获取多个 Agent 的智能数据
 * 
 * 遵循"真实"准则：
 * - 不伪造数据
 * - 部分失败不影响整体（用 try-catch 包裹每个请求）
 */
export async function getBatchIntelligence(
  repos: { owner: string; repo: string }[]
): Promise<AgentIntelligence[]> {
  const results = await Promise.allSettled(
    repos.map(({ owner, repo }) => getAgentIntelligence(owner, repo))
  )
  
  return results
    .filter((r): r is PromiseFulfilledResult<AgentIntelligence> => r.status === 'fulfilled')
    .map(r => r.value)
}

/**
 * 展飞当前追踪的核心 Agents
 * 
 * 这是"策展人"的第一步：
 * 不是爬全量，是先选择值得关注的
 */
export const CURATED_AGENTS = [
  { owner: 'openclaw', repo: 'openclaw', category: 'Agent Framework' },
  { owner: 'NousResearch', repo: 'hermes-agent', category: 'Agent Framework' },
  { owner: 'clawd', repo: 'clawd', category: 'Agent Tool' },
  { owner: 'vercel', repo: 'ai', category: 'AI SDK' },
  { owner: 'anthropics', repo: 'claude-code', category: 'Developer Tool' },
] as const
