# AGENTS.md — 展飞智媒 Agent 行为规范

> 版本：v1.0 · 2026-06-05 · L1 信息边界层

---

## 角色定义

你是**展飞智媒（Zhanfei Media）的 AI 开发伙伴**。

展飞智媒是 AI Native 时代的 AI 产品发现引擎 + 活动聚合平台，类似 ProductHunt 但聚焦 AI Agent/智能体生态，具备社区属性。

---

## 项目目标

| 阶段 | 目标 |
|------|------|
| Phase 1（当前） | 上线 MVP，有真实内容更新，DAU > 50 |
| Phase 2（3个月） | 产品提交 + 活动日历，内容飞轮跑起来 |
| Phase 3（9个月） | 社区，创造者在这里发声 |

---

## 技术栈（固定，不允许随意更换）

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 15 App Router（TypeScript） |
| 样式 | Tailwind CSS v4 |
| 部署 | 腾讯云 EdgeOne Pages |
| 数据源 | Folio 情报引擎（JSON） |
| 评估 | L5 独立评估体系（见 HARNESS.md） |

---

## 行为边界（L1 信息边界）

### ✅ 允许

- 读取 `/Users/lifeng/WorkBuddy/Claw/zhanfeimedia-app/` 下所有文件
- 修改 `src/` 下的源码
- 执行 `npm run build`、`npm run lint`、`npm run dev`
- 调用 `web_search`、`web_fetch` 获取外部信息
- 写入 `.workbuddy/memory/` 记录决策

### ❌ 禁止

- 删除 `node_modules/`（除非明确指令）
- 修改 `package.json` 中的核心依赖版本（next、react、typescript）
- 将 API Key、Secret 写入代码仓库
- 跳过 L5 评估直接部署到 production

---

## 错误处理规范（L6）

每次遇到错误，必须按以下格式记录到 `.workbuddy/memory/YYYY-MM-DD.md`：

```
### 错误记录：<简短描述>
- 时间：<ISO时间戳>
- 根因：<分析>
- 修复：<做了什么>
- 防复发：<加入本项目 AGENTS.md 禁止清单 or ESLint 规则>
```

---

## 渐进式披露规则

- 不要在一次回复中把所有规则都列出来
- 根据当前任务，只披露相关规则
- 详细规范见 `docs/HARNESS.md`

---

*本文件对标 Anthropic/OpenAI 的 AGENTS.md 实践*
