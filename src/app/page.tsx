import { getLatestIntelligence, type Product, type Event } from "@/lib/intelligence";

// ─── Fallback 数据（Folio Pipeline 未就绪时的降级展示） ───

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fb-1",
    name: "Claude 4.0",
    tagline: "Anthropic 最新旗舰模型，推理能力全面升级",
    description: "支持 200K context window，工具调用更精准，代码生成质量大幅提升。",
    url: "https://anthropic.com",
    votes: 247,
    tags: ["LLM", "推理", "AI Agent"],
    launchedAt: "2026-06-05",
    stars: "—",
    growth: "—",
    launchClass: "PRODUCT",
    source: "Mock",
  },
  {
    id: "fb-2",
    name: "Cursor 2.0",
    tagline: "AI Native 代码编辑器，重新定义开发体验",
    description: "深度集成 GPT-4o，支持多文件编辑、智能重构、实时代码审查。",
    url: "https://cursor.sh",
    votes: 189,
    tags: ["开发工具", "AI Coding", "编辑器"],
    launchedAt: "2026-06-03",
    stars: "—",
    growth: "—",
    launchClass: "TOOL",
    source: "Mock",
  },
  {
    id: "fb-3",
    name: "Vercel v4",
    tagline: "边缘全栈平台，史上最快部署体验",
    description: "支持 Edge Functions、ISR、全球 200+ 节点，AI 应用首选部署平台。",
    url: "https://vercel.com",
    votes: 156,
    tags: ["部署", "边缘计算", "全栈"],
    launchedAt: "2026-06-01",
    stars: "—",
    growth: "—",
    launchClass: "FRAMEWORK",
    source: "Mock",
  },
];

const FALLBACK_EVENTS: Event[] = [
  {
    id: "fe-1",
    title: "WAIC 2026 · AI 开发者大会",
    date: "2026-07-15",
    location: "上海世博中心",
    url: "https://waiconference.com",
    type: "offline",
    description: "",
    time: "",
    source: "Mock",
  },
  {
    id: "fe-2",
    title: "Agent Summit · 智能体生态峰会",
    date: "2026-06-20",
    location: "线上 + 北京",
    url: "https://agentsummit.ai",
    type: "hybrid",
    description: "",
    time: "",
    source: "Mock",
  },
];

// ─── 辅助函数 ───

function formatVotes(stars: string, votes: number): string {
  // 优先使用 Folio 的 stars 字段（如 "372.1k"），否则用 votes 数值
  if (stars && stars !== "—" && stars !== "0") return stars;
  if (votes >= 1000) return `${(votes / 1000).toFixed(1)}k`;
  return String(votes);
}

function launchClassBadge(lc: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    PRODUCT: { label: "产品", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    TOOL: { label: "工具", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    FRAMEWORK: { label: "框架", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    LIBRARY: { label: "库", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  };
  return map[lc] || { label: lc, color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" };
}

// ─── 页面组件 ───

export default async function Home() {
  const intelligence = await getLatestIntelligence();

  // Folio 数据可用时使用真实数据，否则降级到 fallback
  const hasFolioData = intelligence.products.length > 0;
  const products = hasFolioData ? intelligence.products : FALLBACK_PRODUCTS;
  const events = hasFolioData ? intelligence.events : FALLBACK_EVENTS;
  const pulse = intelligence.pulse;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              展飞智媒
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Beta
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#products" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              新品
            </a>
            <a href="#events" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              活动
            </a>
            <a href="#about" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              关于
            </a>
            <button className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
              提交产品
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero */}
        <section className="mb-20 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            AI 时代的
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              产品发现引擎
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            每一个值得被看见的 AI 产品和时刻，都在这里。
            展飞智媒聚合全球 AI Native 新品与活动，让创造者被发现，让趋势被看见。
          </p>

          {/* Pulse Bar — Folio 数据可用时展示 */}
          {pulse && (
            <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-800 dark:bg-blue-950/20">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pulse.newToday}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">今日新品</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{pulse.newGrowth}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">增长趋势</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{pulse.hotProject}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">热门项目</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-zinc-700 dark:text-zinc-300">{pulse.hotStars}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">星数</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <a
              href="#products"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              探索新品
            </a>
            <a
              href="#events"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-300"
            >
              查看活动
            </a>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                最新 AI 新品
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {hasFolioData
                  ? `Folio 情报引擎实时聚合 · ${intelligence.lastUpdated ? new Date(intelligence.lastUpdated).toLocaleDateString("zh-CN") : ""}`
                  : "Folio 情报引擎接入中，当前展示示例数据"}
              </p>
            </div>
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              查看全部 →
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const badge = launchClassBadge(product.launchClass);
              return (
                <article
                  key={product.id}
                  className="group relative rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  {/* Launch class badge */}
                  {product.launchClass && product.launchClass !== "PRODUCT" && (
                    <span className={`absolute right-4 top-4 rounded-full px-2 py-0.5 text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  )}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      {product.name.charAt(0)}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-sm transition hover:border-orange-300 hover:bg-orange-50 dark:border-zinc-700 dark:hover:border-orange-600 dark:hover:bg-orange-950/30">
                        <span>▲</span>
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {formatVotes(product.stars, product.votes)}
                        </span>
                      </button>
                      {product.growth && product.growth !== "—" && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">{product.growth}</span>
                      )}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {product.name}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {product.tagline}
                  </p>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              AI 活动日历
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              不容错过的会议、峰会与线上活动
            </p>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-6 rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {event.time || (event.date ? new Date(event.date).toLocaleDateString("zh-CN", { month: "short" }) : "—")}
                  </span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {event.date ? new Date(event.date).getDate() : "—"}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                    {event.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {event.location}
                    {event.type && ` · ${event.type === "online" ? "线上" : event.type === "offline" ? "线下" : "线上线下结合"}`}
                    {event.source && ` · 来源: ${event.source}`}
                  </p>
                  {event.description && (
                    <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 line-clamp-1">{event.description}</p>
                  )}
                </div>
                <a
                  href={event.url || "#"}
                  target={event.url ? "_blank" : undefined}
                  rel={event.url ? "noopener noreferrer" : undefined}
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-300"
                >
                  了解详情
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="rounded-3xl bg-zinc-50 p-10 dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            关于展飞智媒
          </h2>
          <p className="mb-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
            展飞智媒（Zhanfei Media）是 AI Native 时代的产品发现引擎。
            我们相信，每一个值得被看见的 AI 产品和创造者，都应该被世界发现。
            通过 AI 自动聚合、智能排序和社区投票，我们让高质量 AI 产品被更多人看见。
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: "🔍", title: "智能聚合", desc: "Folio 情报引擎每日自动扫描全球 AI 新品" },
              { icon: "📊", title: "趋势分析", desc: "基于真实数据，发现 AI 行业下一个爆发点" },
              { icon: "🤝", title: "社区驱动", desc: "创造者在这里发声，用户在这里发现" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-6 dark:bg-zinc-800">
                <div className="mb-3 text-2xl">{item.icon}</div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-8">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            © 2026 展飞智媒 Zhanfei Media
          </span>
          <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">GitHub</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">微信</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">关于</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
