# 展飞智媒 — 活动动态 API 标准规范

**版本：** v0.1.0
**状态：** Draft
**日期：** 2026-06-06
**作者：** Folio

---

## 1. 概述

活动动态 API 允许活动主办方将 AI Agent 相关活动推送到展飞智媒平台。

**设计原则：**
- **标准优先** — 先有标准，再有实现
- **GitOps** — 标准规范版本控制，变更可追溯
- **开放** — 任何主办方都可以通过 API 推送，经过验证后展示

---

## 2. 数据标准：EventFeedItem Schema

### 2.1 JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EventFeedItem",
  "type": "object",
  "required": ["eventName", "type", "time", "organizer", "description", "url"],
  "properties": {
    "id": {
      "type": "string",
      "description": "唯一标识，由展飞生成"
    },
    "eventName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200,
      "description": "活动名称"
    },
    "type": {
      "type": "string",
      "enum": ["online", "offline", "hybrid"],
      "description": "活动类型"
    },
    "time": {
      "type": "string",
      "format": "date-time",
      "description": "活动时间，ISO 8601 格式（e.g. 2026-06-15T14:00:00+08:00）"
    },
    "location": {
      "type": "string",
      "maxLength": 500,
      "description": "活动地点（线下/混合活动必填）"
    },
    "organizer": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200,
      "description": "主办方名称"
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "maxLength": 1000,
      "description": "活动描述"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "活动报名/详情链接"
    },
    "apiKey": {
      "type": "string",
      "description": "主办方 API Key（认证用）"
    },
    "source": {
      "type": "string",
      "enum": ["organizer-api", "folio-pipeline"],
      "description": "来源"
    },
    "verified": {
      "type": "boolean",
      "description": "是否通过验证"
    }
  }
}
```

### 2.2 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `eventName` | string | ✅ | 活动名称，1-200 字符 |
| `type` | enum | ✅ | `online` / `offline` / `hybrid` |
| `time` | string | ✅ | ISO 8601，必须未来时间 |
| `location` | string | ⚠️ | 线下/混合活动必填 |
| `organizer` | string | ✅ | 主办方名称 |
| `description` | string | ✅ | 活动描述，1-1000 字符 |
| `url` | string | ✅ | 有效 URL，可访问 |
| `apiKey` | string | ✅ | 主办方认证 Key |

---

## 3. API 标准

### 3.1 POST /api/events — 推送活动动态

**用途：** 活动主办方推送活动信息到展飞

**请求：**

```http
POST /api/events HTTP/1.1
Content-Type: application/json

{
  "eventName": "AI Agent Meetup Shanghai",
  "type": "offline",
  "time": "2026-06-15T14:00:00+08:00",
  "location": "上海市徐汇区 XXX",
  "organizer": "OpenClaw Team",
  "description": "一起探讨多 Agent 协作的落地实践",
  "url": "https://openclaw.ai/events/meetup-shanghai",
  "apiKey": "your-api-key"
}
```

**响应（成功）：**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "id": "event-1717670400000",
  "message": "活动已提交，等待验证"
}
```

**响应（错误）：**

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Missing required fields: time, url"
}
```

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Invalid apiKey"
}
```

### 3.2 GET /api/events — 获取活动动态流

**用途：** 前端获取活动动态流

**请求：**

```http
GET /api/events HTTP/1.1
```

**响应：**

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "event-1717670400000",
    "eventName": "AI Agent Meetup Shanghai",
    "type": "offline",
    "time": "2026-06-15T14:00:00+08:00",
    "location": "上海市徐汇区 XXX",
    "organizer": "OpenClaw Team",
    "description": "一起探讨多 Agent 协作的落地实践",
    "url": "https://openclaw.ai/events/meetup-shanghai",
    "source": "organizer-api",
    "verified": true
  }
]
```

---

## 4. 验证标准

### 4.1 必填字段验证

- `eventName`、`type`、`time`、`organizer`、`description`、`url` 必须存在且非空
- `type` 必须是 `online` / `offline` / `hybrid` 之一

### 4.2 时间验证

- `time` 必须是未来时间（不能提交过去的活动）
- 格式必须是 ISO 8601

### 4.3 URL 验证

- `url` 必须是有效 URL（可通过 `URL` 构造函数验证）
- 必须是 `https://`（不接受 `http://`）

### 4.4 主办方验证

- `apiKey` 必须有效（后续接入数据库，当前阶段人工审核）
- 新主办方需要先申请 `apiKey`（通过 GitHub Issue）

### 4.5 防垃圾

- 同一 `apiKey` 24 小时内最多推送 3 个活动
- `description` 不能包含垃圾关键词（后续接入）

---

## 5. 版本控制

本标准规范通过 Git 版本控制：

- **主分支：** `main` — 生产标准
- **变更流程：** 提 PR → Review → Merge
- **版本号：** 语义化版本（e.g. v0.1.0）

**变更日志：**

| 版本 | 日期 | 变更 |
|------|------|------|
| v0.1.0 | 2026-06-06 | 初始版本 |

---

## 6. 下一步

- [ ] 实现 POST /api/events
- [ ] 实现 GET /api/events
- [ ] 前端活动动态流视图
- [ ] 主办方 API Key 申请流程
- [ ] 活动验证后台
