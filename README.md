# 展飞智媒 · Zhanfei Media

AI Native 时代的产品发现引擎。

## 技术栈

- Next.js 15 (App Router)
- Tailwind CSS 4
- TypeScript
- Vercel 部署

## 数据流

```
Folio Pipeline (Python)
    ↓ daily_report.json
folio-bridge.ts（纯函数桥接层）
    ↓
page.tsx（展示层）
```

## 本地开发

```bash
npm install
npm run dev
```

## 部署

推送到 `main` 分支自动触发 Vercel 部署。

## 目录结构

```
src/
  lib/
    intelligence.ts   # 情报数据接口
    folio-bridge.ts  # Folio JSON → 前端类型桥接层
  app/
    page.tsx         # 主页面
```
