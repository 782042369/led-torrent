[根目录](../CLAUDE.md) > **core**

---

# core 模块

## 模块职责

`core/` 模块是 LED Torrent 项目的核心基础设施层，提供底层能力支持，包括 API 接口定义、HTTP 请求封装、并发控制和类型定义。该模块为上层适配器和路由系统提供稳定、高效的底层服务。

---

## 目录结构

```
core/
├── api.ts                # API 接口定义（143 行）
├── request.ts            # HTTP 请求封装（128 行）
├── concurrent.ts         # 并发控制（185 行）
└── types.ts              # 类型定义（39 行）
```

---

## 入口与启动

### 模块职责划分

| 文件 | 职责 | 主要功能 |
| --- | --- | --- |
| **api.ts** | API 接口层 | 定义所有 PT 站点的 API 接口 |
| **request.ts** | HTTP 请求层 | 统一的请求方法，支持超时 |
| **concurrent.ts** | 并发控制层 | 防止请求过载导致站点压力 |
| **types.ts** | 类型定义层 | TypeScript 类型定义 |

---

## 对外接口

### 1. API 接口层 (`api.ts`)

#### 通用站点 API（Nexus PHP）

##### `getNPHPLedTorrent(id, type)`

认领或弃种操作。

**参数**：

- `id: string` - 种子 ID
- `type: 'removeClaim' \| 'addClaim'` - 操作类型

**返回**：`Promise<LedTorrentDetails>`

```typescript
interface LedTorrentDetails {
  msg: string | 'OK'
  ret: -1 | 0
}
```

##### `getNPHPUsertorrentlistajax(params)`

获取用户做种列表。

**参数**：

```typescript
{
  page: number
  userid: string
  type: 'seeding'
}
```

**返回**：`Promise<string>` (HTML)

##### `getNPHPUsertorrentHistory(params)`

获取用户历史领种记录。

**参数**：

```typescript
{
  page: number
  uid: string
}
```

**返回**：`Promise<string>` (HTML)

#### 猫站 API

##### `getNPHPPterUsertorrentlistajax(params)`

获取猫站用户做种列表。

##### `getNPHPPterLedTorrent(id)`

猫站认领种子。

**返回**：`Promise<boolean>` (成功/失败)

#### 春天站 API

##### `getSSDLedTorrent(id)`

春天站认领种子。

**返回**：`Promise<LedTorrentDetails>`

---

### 2. HTTP 请求层 (`request.ts`)

#### `request<T>(url, options)`

统一的 HTTP 请求函数。

**签名**：

```typescript
async function request<T>(
  url: string,
  options?: RequestOptions
): Promise<T>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  params?: Record<string, any>
}
```

**特性**：

- 使用 `Promise.race` 实现超时机制（默认 100 秒）
- 自动构建 URL 查询参数
- 针对不同接口的特殊响应处理

**特殊响应处理**：

- `viewclaims.php` - 返回布尔值
- `user-seeding-torrent` - 检测登录失效（500/404/403）
- `getusertorrentlistajax` / `claim.php` - 返回文本
- 默认返回 JSON

---

### 3. 并发控制层 (`concurrent.ts`)

#### `ConcurrentPool` 类

并发控制池，限制同时运行的任务数量。

**使用示例**：

```typescript
const pool = new ConcurrentPool(5) // 最多 5 个并发

await pool.add(async () => {
  // 执行任务
})

await pool.waitAll() // 等待所有任务完成
```

#### `RateLimiter` 类

速率限制器，控制单位时间内的请求次数。

**使用示例**：

```typescript
const limiter = new RateLimiter(60) // 每分钟 60 个请求

await limiter.wait() // 等待直到可以发送下一个请求
```

#### `BatchTaskExecutor` 类

批量任务执行器，结合并发控制和速率限制。

**使用示例**：

```typescript
const executor = new BatchTaskExecutor(5, 35) // 5 个并发，每分钟 35 个请求

const tasks = [
  () => api.call1(),
  () => api.call2(),
  // ...
]

await executor.executeAll(tasks, (current, total) => {
  console.log(`进度: ${current}/${total}`)
})
```

---

### 4. 类型定义层 (`types.ts`)

#### 核心类型

```typescript
/** 种子数据ID类型定义 */
export type TorrentDataIdsType = string[]

/** 用户做种列表 */
export interface TorrentList {
  data?: { id: string }[]
  meta?: { to: number, total: number }
}

/** 领取种子结果详情 */
export interface LedTorrentDetails {
  msg: string | 'OK'
  ret: -1 | 0
}

/** HTTP 请求选项 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  params?: Record<string, any>
}
```

---

## 关键依赖与配置

### 内部依赖

```
core/
├── api.ts
│   └── request.ts       # HTTP 请求
└── concurrent.ts        # 独立模块
```

### 外部依赖

- **浏览器原生 API**：`fetch`、`DOMParser`、`URLSearchParams`

---

## 数据模型

### 请求流程

```
适配器 → API 接口 → HTTP 请求 → 站点服务器
         ↓
    响应数据 → 适配器处理 → UI 更新
```

### 并发控制流程

```
任务数组 → BatchTaskExecutor → ConcurrentPool + RateLimiter → 执行任务
                                              ↓
                                         进度回调 → UI 更新
```

---

## 测试与质量

### 当前状态

- **无测试覆盖**
- 建议添加单元测试

### 测试建议

1. **API 层测试**
   - 测试各个 API 函数的参数构造
   - 模拟响应数据

2. **请求层测试**
   - 测试超时机制
   - 测试特殊响应处理
   - 测试错误处理

3. **并发控制测试**
   - 测试并发池的并发限制
   - 测试速率限制器的时间间隔
   - 测试批量执行器的进度回调

---

## 常见问题 (FAQ)

### Q1: 如何添加新站点的 API？

**步骤**：

1. 在 `api.ts` 中添加 API 函数：

   ```typescript
   export async function getNewSiteApi(params: {
     page: number
     userid: string
   }) {
     return request<string>('newsite-api-endpoint', {
       method: 'GET',
       params,
     })
   }

   export async function getNewSiteLedTorrent(id: string) {
     const body = new FormData()
     body.append('action', 'claim')
     body.append('id', id)
     return request<LedTorrentDetails>('/claim.php', {
       method: 'POST',
       body,
     })
   }
   ```

2. 在适配器中调用：

   ```typescript
   import { getNewSiteApi, getNewSiteLedTorrent } from '@/core/api'
   ```

### Q2: 如何调整并发参数？

**方法**：创建 `BatchTaskExecutor` 时调整参数

```typescript
// 默认：5 个并发，每分钟 35 个请求
const executor = new BatchTaskExecutor(5, 35)

// 调整为：3 个并发，每分钟 20 个请求
const executor = new BatchTaskExecutor(3, 20)
```

### Q3: 如何处理请求超时？

**方法**：在 `request` 调用时设置 `timeout` 参数

```typescript
request(url, {
  timeout: 60000, // 60 秒超时
})
```

---

## 相关文件清单

- `core/api.ts` - API 接口定义（143 行）
- `core/request.ts` - HTTP 请求封装（128 行）
- `core/concurrent.ts` - 并发控制（185 行）
- `core/types.ts` - 类型定义（39 行）

**总计**：495 行代码

---

## 变更记录

### 2026-01-15

- 初始化 core 模块文档
- 完成接口文档和使用说明
