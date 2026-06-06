# 展飞智媒 — 活动动态 API 标准规范

**版本：** v1.0.0-draft
**状态：** Review
**日期：** 2026-06-06
**作者：** Folio

---

## 1. 概述

活动动态 API 允许活动主办方将 AI Agent 相关活动推送到展飞智媒平台。

**设计原则：**
- **标准优先** — 先有标准，再有实现
- **GitOps** — 标准规范版本控制，变更可追溯
- **开放** — 任何主办方都可以通过 API 推送
- **安全第一** — 认证、验证、防垃圾，缺一不可

---

## 2. 数据标准：EventFeedItem

### 2.1 JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EventFeedItem",
  "type": "object",
  "required": ["eventName", "type", "time", "organizer", "description", "url", "apiKey"],
  "properties": {
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
      "description": "活动时间，ISO 8601（e.g. 2026-06-15T14:00:00+08:00）"
    },
    "location": {
      "type": "string",
      "maxLength": 500,
      "description": "活动地点。线下/混合活动必填"
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
      "pattern": "^https://",
      "description": "活动报名/详情链接，必须 HTTPS"
    },
    "apiKey": {
      "type": "string",
      "description": "主办方 API Key"
    },
    "source": {
      "type": "string",
      "enum": ["organizer-api", "folio-pipeline"],
      "description": "来源。系统自动设置，调用方不传"
    },
    "verified": {
      "type": "boolean",
      "description": "是否通过验证。系统自动设置，调用方不传"
    }
  }
}
```

### 2.2 字段说明

| 字段 | 类型 | 必填 | 调用方传入 | 说明 |
|------|------|------|-----------|------|
| `eventName` | string | ✅ | ✅ | 活动名称，1-200 字符 |
| `type` | enum | ✅ | ✅ | `online` / `offline` / `hybrid` |
| `time` | ISO 8601 | ✅ | ✅ | 必须未来时间 |
| `location` | string | ⚠️ | ✅ | 线下/混合活动必填，500 字符内 |
| `organizer` | string | ✅ | ✅ | 主办方名称，1-200 字符 |
| `description` | string | ✅ | ✅ | 活动描述，1-1000 字符 |
| `url` | string | ✅ | ✅ | 必须 `https://`，必须可访问 |
| `apiKey` | string | ✅ | ✅ | 主办方认证 Key |
| `source` | enum | — | ❌ | 系统自动设置 |
| `verified` | boolean | — | ❌ | 系统自动设置 |

---

## 3. API 契约

### 3.1 POST /api/events — 推送活动

**用途：** 活动主办方推送活动信息

**认证方式：** `apiKey` in request body

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

**响应码：**

| 状态码 | 含义 | 示例 |
|--------|------|------|
| `200` | 成功 | `{ "success": true, "id": "event-xxx" }` |
| `400` | 请求参数错误 | `{ "error": "Missing required fields: time, url" }` |
| `401` | 认证失败 | `{ "error": "Invalid apiKey" }` |
| `429` | 频率限制 | `{ "error": "Rate limit exceeded", "retryAfter": 3600 }` |

### 3.2 GET /api/events — 获取活动流

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

### 4.1 输入验证（Input Validation）

| 规则 | 说明 |
|------|------|
| 必填字段 | `eventName`、`type`、`time`、`organizer`、`description`、`url`、`apiKey` 必须存在且非空 |
| `type` 枚举 | 必须是 `online` / `offline` / `hybrid` 之一 |
| `time` 时间 | ISO 8601 格式，且必须是未来时间（`> Date.now()`） |
| `time` 上限 | 不能超过当前时间 + 365 天（防止恶意数据） |
| `url` 协议 | 必须以 `https://` 开头 |
| `url` 可访问 | HTTP HEAD 请求返回 2xx/3xx（实现阶段做，规范不规定） |
| `location` 条件必填 | `type` 为 `offline` 或 `hybrid` 时，`location` 必须非空 |
| 字符串长度 | 按 JSON Schema 的 minLength/maxLength 验证 |
| XSS 防护 | 所有字符串字段做 HTML 转义后存储 |

### 4.2 认证验证（Authentication）

- `apiKey` 必须有效
- 认证失败返回 `401`
- 新主办方申请流程见 [§5.2 主办方接入流程](#52-主办方接入流程)

### 4.3 频率限制（Rate Limiting）

| 规则 | 限制 | 理由 |
|------|------|------|
| 单 apiKey 每小时 | 最多 1 次 POST | 防止重复提交，正常主办方一天最多几个活动 |
| 单 apiKey 每天 | 最多 3 次 POST | 正常主办方一天不会超过 3 个活动 |
| 单 IP 每小时 | 最多 10 次 POST | 防止未认证用户滥用 |

超限返回 `429`，`Retry-After` 头为 3600（秒）。

### 4.4 内容审核

- `eventName` 和 `description` 不能包含垃圾关键词（待定义黑名单）
- 活动必须与 AI Agent 相关（后续接入 AI 审核）

---

## 5. 主办方接入

### 5.1 接入原则

- **开放但审慎** — 任何主办方都可以申请，但需经过验证
- **一次申请，长期有效** — 通过后 apiKey 不过期，但可吊销
- **可追溯** — 所有 API 调用记录可查

### 5.2 主办方接入流程

```
1. 主办方提交申请
   ↓ GitHub Issue（标签：api-key-request）或邮件 api@zhanfeimedia.com
   ↓ 需提供：主办方名称、官网 URL、联系方式

2. 展飞审核（24 小时内）
   ↓ 人工审核：确认是真实主办方
   ↓ AI 辅助：检查官网可访问、不是垃圾域名

3. 发放 apiKey
   ↓ 通过 GitHub Issue 回复或邮件回复
   ↓ apiKey 格式：zfe_xxxx（32 位随机字符串）

4. 主办方测试
   ↓ 用 apiKey 调用 POST /api/events
   ↓ 首次提交需人工审核后展示

5. 正常使用
   ↓ 后续提交自动展示（仍保留 AI 审核）
```

### 5.3 apiKey 管理

- 一个主办方一个 apiKey
- apiKey 泄漏 → 主办方申请吊销 + 重新发放
- 滥用 → 吊销 apiKey + 列入黑名单

---

## 6. 安全标准

### 6.1 输入安全

- 所有字符串字段做 HTML 转义（防 XSS）
- 所有字符串字段 trim() 后再验证长度
- 不接受 HTML 标签

### 6.2 传输安全

- 所有 API 请求必须 HTTPS（`https://`）
- 不通过 URL query string 传递 apiKey（仅 POST body）

### 6.3 存储安全

- apiKey 不存储在代码仓库中
- apiKey 不在日志中输出（脱敏）
- 活动数据定期备份

---

## 7. 版本控制

本标准规范通过 Git 版本控制：

- **主分支：** `main` — 生产标准
- **变更流程：** 提 PR → Review → Merge
- **版本号：** 语义化版本（MAJOR.MINOR.PATCH）

**变更日志：**

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0-draft | 2026-06-06 | 初始版本，完整规范 |

---

## 8. 实现清单

以下按本标准规范实现：

- [ ] `types.ts` — EventFeedItem 类型（按 JSON Schema）
- [ ] `POST /api/events` — 推送活动（按 §3.1 契约）
- [ ] `GET /api/events` — 获取活动流（按 §3.2 契约）
- [ ] 输入验证（按 §4.1）
- [ ] 频率限制（按 §4.3）
- [ ] 前端活动动态流视图
- [ ] 主办方接入流程（按 §5.2）
