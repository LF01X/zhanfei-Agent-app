# 展飞智媒 · 竞品研究与迭代方向

> Folio Intelligence Engine · 2026-06-06
> 准则：真实 · 美 · 好奇

---

## 一、硅谷 AI 产品发现平台全景

2026 年，AI Agent 市场呈现一个核心矛盾：**104,000+ Agents 分布在 15+ 注册中心，互操作性为零。** 没有统一的"元层"发现平台。

各平台在各自生态位中竞争，但都不解决跨生态系统的发现问题。

### 1.1 五类平台对比

| 平台 | 模型 | 基因 | 致命短板 |
|------|------|------|----------|
| **Product Hunt** | 社区投票 + Maker 故事 | 早期采用者引力场 | 非 AI Native，投票权重向大厂倾斜 |
| **Hugging Face** | 开放中心 | 开发者生态最开放 | 46.3% 技能重复，信号噪音比极差 |
| **Claude Marketplace** | 企业采购层 | 零佣金 + 销售团队定向推荐 | 封闭生态，非公开浏览 |
| **GPT Store** | 创作者经济 | 300 万 GPT 已创建，规模最大 | 货币化失败，单次对话收入 $0.03 |
| **Salesforce AgentExchange** | 企业工作流 | ARR 已达 8 亿美元 | 仅限 Salesforce 生态 |

### 1.2 当前格局的三大缺口

```
┌─────────────────────────────────────────────┐
│                                             │
│   ① 跨注册中心元搜索层 — 完全缺失            │
│                                             │
│   ② 基于基准测试的质量认证 — 无人做           │
│                                             │
│   ③ Agent 原生计费基础设施 — 尚不存在         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 二、关键平台深度分析

### 2.1 Product Hunt — 社区投票的引力场

**机制核心**：24 小时发布窗口 + 质量加权投票算法

**2026 年变化**：
- 60%+ 每日前 5 含 AI 组件
- 评论质量权重 > 投票数量
- 发布后 SEO 成为系统策略（DA 91 反向链接）

**可迁移机制**：
- **多波次发布策略**：单次发布是事件，多次发布是增长策略。3 次发布可获 2,000-4,000+ 总投票（vs 单次 800-1,500）
- **制作者评论策略**：以问题开头，包含具体数字，提供社区独家优惠
- **发布后内容日历**：回顾博客 + 技术文章 + 对比页面

**为什么不全盘模仿**：
Product Hunt 是"人的投票"，展飞的基因是"Agent 的感知"。前者靠社区运营，后者靠情报引擎自动化。模仿 Product Hunt 的投票机制会稀释差异化。

### 2.2 AgentMarketCap — 发现危机的声音

**核心洞察**：
> "The marketplace that doesn't yet exist — a neutral, cross-registry, benchmark-first discovery layer with real quality certification and agent-native billing — remains the largest open opportunity."

**2026 数据**：
- 104,000+ Agents，15+ 注册中心
- 46.3% Hugging Face 技能为重复项
- 88% 组织报告过 Agent 安全事件
- 90% 已部署 Agent 权限过高

**可迁移机制**：
- **协议无关的聚合层**：不绑定任何单一 Agent 协议（MCP / A2A / ARDP），做"Agent 界的 Kayak"
- **基于结果的认证**：验证 Agent 是否能以可接受准确性和延迟完成任务，而非仅安全检查
- **子美分级计费**：基于任务和结果的微操作计费模型

### 2.3 Crossmint AI 活动日历 — 生态位导向的策展

**机制核心**：全球性、多维筛选、价值判断型的活动聚合

**设计理念**：
- **"路线图"定位**：不仅是日历，是年度参会规划工具
- **分层策展**：基础设施层 → 开源协议层 → 行业应用层 → 区域枢纽
- **价值筛选**：标注"旗舰会议"、"若非微软技术栈可跳过"
- **内容营销闭环**：提供行业价值 → 建立专业权威 → 自然产品导流

**可迁移机制**：
- **生态位标签系统**：不是平铺活动列表，而是按生态层级分类
- **策展而非搬运**：每个活动带有主观判断和价值筛选
- **规划工具定位**：帮用户决策"该去哪个"，而非"有哪些"

### 2.4 Zylos 市场分析 — 分发渠道的战争

**五种市场模型的本质差异**：

| 维度 | 企业市场 | 消费者市场 |
|------|----------|------------|
| 核心诉求 | 合规、访问控制、可审计 | 注意力、留存、信任 |
| 分发控制 | IT 管理员严格管控 | 平台算法推荐 |
| 计费模式 | 分层套餐（对话/积分/用户） | 创作者分成 |
| 信任建立 | 安全认证 + 客户验证 | 社区评价 + 下载量 |
| 当前主导 | Salesforce（ARR $8亿） | OpenAI（81% 份额） |

**对展飞的启示**：展飞不是企业市场也不是消费者市场，而是**建设者市场**——服务 AI 创造者本身。

---

## 三、对照分析：展飞 vs 竞品

### 3.1 展飞的独特基因

| 维度 | 展飞智媒 | Product Hunt | Hugging Face | AgentMarketCap |
|------|----------|-------------|-------------|----------------|
| 发现方式 | **Agent 自动化策展** | 社区投票 | 开放上传 | 数据分析 |
| 数据来源 | Folio 情报引擎自主扫描 | Maker 自主提交 | 社区贡献 | 注册中心聚合 |
| 策展逻辑 | 跨源融合 + 智能排序 | 人为投票排序 | 下载量/Star | 市值/活跃度 |
| 活动覆盖 | ✅ 产品 + 活动 | ✅ 产品为主 | ❌ 无活动 | ❌ 无活动 |
| 社区机制 | ❌ 暂无 | ✅ 评论+投票 | ✅ Issue/Discussion | ❌ 无 |
| 质量信号 | Folio 评分算法 | 社区投票 | Star/Download | 链上数据 |

### 3.2 展飞的核心优势

1. **Agent 原生策展**：不是人投票，是 Agent 自动发现、评估、排序。这是根本性的差异化。
2. **产品 × 活动双轴**：竞品要么只做产品（PH），要么只做活动（Luma），展飞两者融合。
3. **跨源融合**：Folio Pipeline 从 GitHub / arXiv / HackerNews / ProductHunt 多源并发采集，无人做这件事。
4. **Folio 编辑视角**：`insight` + `tomorrow` 提供了 AI 策展人视角，而非冷冰冰的列表。

### 3.3 展飞当前的主要差距

| 差距 | 严重度 | 竞品对标 |
|------|--------|----------|
| 无社区互动层 | 🔴 高 | Product Hunt 的评论/投票 |
| 数据实时性不足 | 🟡 中 | daily_report.json 日更新 |
| 无跨注册中心聚合 | 🟡 中 | AgentMarketCap 的方向 |
| 活动数据偏薄 | 🟡 中 | Crossmint 的多维筛选 |
| 缺少产品详情页 | 🟠 低 | PH 的产品故事页 |
| 无 SEO 反向链接策略 | 🟠 低 | PH 的 DA 91 生态 |

---

## 四、迭代方案

基于「真实·美·好奇」准则，分三波迭代。

### 第一波：数据深度（真实）

**目标**：让 Folio 情报引擎的数据维度追上并超越竞品。

#### 1.1 跨注册中心聚合（Agent 界的 Kayak）

```
当前：daily_report.json 主要覆盖 GitHub + ClawHub
目标：聚合 5+ 注册中心（HuggingFace / GPT Store / Claude Marketplace / MCP Market / AgentMarketCap）
```

**执行**：
- 扩展 `scout` agent 的数据源列表
- 新增 `cross_registry_dedup` 模块（参考 AgentMarketCap 的 46.3% 重复率教训）
- 输出字段增加 `registry` 来源标注

#### 1.2 基准测试信号

```
当前：stars + growth 是唯一质量信号
目标：引入 Folio 自有评分体系（quality_score / freshness / community_health）
```

**执行**：
- `folio_schema.py` 新增 `QualityMetrics` dataclass
- `daily_report.json` 每个 launch 增加 `folio_score`、`activity_level`、`velocity`
- 前端 Pulse 栏展示"Folio 评分"维度

#### 1.3 活动数据加深

```
当前：events 只有 title / type / description / time / location
目标：增加生态位标签、参会规模、技术深度评级
```

**执行**：
- 参考 Crossmint 的分层策展模式
- 新增字段：`ecosystem_tier`（infra / protocol / application / regional）
- 新增字段：`audience_profile`（engineer / executive / researcher）
- 新增字段：`folio_pick`（Folio 推荐标记）

### 第二波：叙事深度（美）

**目标**：让展飞不只是列表，而是有观点的策展。

#### 2.1 Folio 策展人视角

```
当前：insight 是单段文本
目标：insight 升级为结构化策展视角
```

**新增模块**：

```typescript
interface CuratorView {
  headline: string;          // "OpenClaw 生态本周爆发"
  keyTakeaways: string[];    // 3 条核心洞察
  underrated: Launch[];      // "被低估的"
  overhyped: Launch[];       // "被高估的"
  watchlist: string[];       // "下周值得关注"
  methodology: string;       // "Folio 如何得出这个结论"
}
```

**为什么**：Product Hunt 的榜单是算法+人投出来的，但不解释"为什么"。Folio 可以解释——这是 Agent 原生策展的独特价值。

#### 2.2 产品故事页（Maker Story）

```
当前：产品卡片只有 tagline + description
目标：每个产品有一个独立的故事页
```

**页面结构**：
- **产品基因**：谁做的、为什么做、解决什么问题
- **技术栈**：用了什么模型/框架/协议
- **增长轨迹**：Stars 时间线（参考 Star History）
- **Folio 点评**：Agent 策展人的一句话点评
- **同类对比**：相似产品的横向比较

**设计原则**：
- 不是 Product Hunt 的"评论墙"
- 是 Folio 写的"产品档案"
- 每页 3 分钟可读完

#### 2.3 视觉叙事升级

**当前页面问题**：
- Pulse 栏是横向四列数字，缺乏故事性
- 产品卡片区分度不够（openclaw 372k 星和 Notion AI 3.5k 星看起来差不多）
- 缺少时间维度（趋势图、时间线）

**迭代方向**：
- **Pulse 升级为叙事横幅**：不是四个数字，是一句话摘要 + 一个趋势微图
- **产品卡片视觉层级**：星数差距用视觉比例表达（进度条/色阶）
- **活动时间线**：不是平铺列表，是按时间轴展开的日历视图

### 第三波：社区深度（好奇）

**目标**：从"Folio 告诉你"到"你和 Folio 一起发现"。

#### 3.1 好奇心驱动的推荐

```
当前：新品列表按 Folio 评分排序
目标：基于用户兴趣的个性化推荐
```

**不是算法推荐**（那太普通了），而是**好奇心推荐**：

```typescript
interface CuriosityFeed {
  because_you_liked: Launch[];      // "因为你关注了 openclaw"
  you_might_have_missed: Launch[];  // "上周评分高但被忽略的"
  wildcard: Launch;                 // "一个完全不同的东西"
  question: string;                 // "你觉得这个方向怎么样？"
}
```

#### 3.2 轻量社区信号

```
当前：零社区互动
目标：极简互动，不学 PH 的评论系统
```

**展飞式互动**（不是 Product Hunt 的克隆）：

| 互动 | 机制 | 为什么不同 |
|------|------|------------|
| **点亮** | 单次点击，不可撤销 | 不是投票，是"我看到你了" |
| **追问** | 对产品提一个问题，Folio 尝试回答 | 好奇心驱动的对话 |
| **追踪** | 关注产品，接收更新通知 | 建设者的关注链 |
| **策展人笔记** | 公开的短评（140 字） | 不是评论，是策展 |

#### 3.3 建设者档案

```
当前：产品只有名称和标签
目标：展示创造者（Maker Profile）
```

- **Maker 画像**：GitHub 头像、项目历史、技术栈
- **建设者关系图**：谁和谁在同一个生态中协作
- **贡献时间线**：从第一个 commit 到现在

---

## 五、优先级矩阵

```
影响力
  ▲
  │
  │  ┌──────────────┬──────────────┐
  │  │ 第二波：叙事  │ 第一波：数据  │
  │  │              │              │
 高 │  curator_view │ cross_registry│
  │  │  maker_story │  quality_score│
  │  │  visual_tier │  event_depth  │
  │  ├──────────────┼──────────────┤
  │  │              │              │
  │  │ 第三波：社区  │              │
 低 │  curiosity    │              │
  │  │  light_social│              │
  │  └──────────────┴──────────────┘
  │     低 ◄──── 实施成本 ────► 高
  ▼
```

**建议顺序**：

```
Week 1-2:  第一波·数据深度
           ├─ cross_registry 聚合（5+ 注册中心）
           ├─ quality_score 评分体系
           └─ event_depth 活动加深

Week 3-4:  第二波·叙事深度
           ├─ curator_view 策展视角
           ├─ maker_story 产品故事页
           └─ visual_tier 视觉层级升级

Week 5+:   第三波·社区深度
           ├─ curiosity_feed 好奇心推荐
           ├─ light_social 轻量互动
           └─ maker_profile 建设者档案
```

---

## 六、一个关键判断

看完所有竞品后，最清晰的结论是：

> **Product Hunt 是"人的投票"，Hugging Face 是"代码的仓库"，AgentMarketCap 是"数据的分析"。**
> **展飞智媒的定位应该是：Agent 的策展人。**

不是让人投票决定什么值得看，不是让下载量决定排名，不是让数据分析师写报告——而是让 Folio 情报引擎像一个真正的策展人一样，每天告诉你：**今天什么值得看，为什么，以及明天该关注什么。**

这个定位在 2026 年的市场上是空白。

Product Hunt 不会做 Agent 自动化策展（那是反其社区基因的）。
Hugging Face 不会做编辑视角（那是反其开放中心基因的）。
AgentMarketCap 不会做叙事深度（那是反其数据驱动基因的）。

**展飞做这件事，刚好。**

---

*Folio Intelligence Engine · 基于真实数据的策展，而非算法的投喂。*
