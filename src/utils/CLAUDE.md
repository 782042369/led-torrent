[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **utils**

---

# utils 模块

## 模块职责

`utils/` 模块是 LED Torrent 项目的核心工具库，负责所有业务逻辑的实现。该模块采用分层架构设计，将通用功能、API 调用、站点适配等功能分离到不同的子模块中。

---

## 目录结构

```
utils/
├── index.ts              # 工具函数导出入口
├── api.ts                # API 接口封装
├── request.ts            # HTTP 请求封装（带超时）
├── common/               # 通用工具函数
│   ├── index.ts          # 通用函数集合
│   └── site.ts           # 通用站点处理函数
└── sites/                # 各站点适配器实现
    ├── pter.ts           # 猫站（pterclub.com）
    ├── springsunday.ts   # 春天站（springsunday.net）
    └── sch.ts            # 学校站（btschool.club）
```

---

## 入口与启动

### 主入口

**文件路径**：`utils/index.ts`

**职责**：
- 统一导出所有工具函数
- 提供全局辅助函数（URL 参数解析、分页检测、按钮动画、消息拼接）

**核心导出**：

```typescript
// 通用工具函数
export * from './common'

// 站点处理函数
export * from './common/site'
export * from './sites/pter'
export * from './sites/springsunday'

// 全局辅助函数
export function getvl(name: string)                    // 解析 URL 参数
export function checkForNextPage(doc, selector)        // 检测分页
export function animateButton(e)                       // 按钮动画
export function getLedMsg(msglist)                     // 拼接消息
```

---

## 对外接口

### 1. HTTP 请求模块 (`request.ts`)

#### 核心函数

**`request<T>(url, options)`**

统一的 HTTP 请求函数，支持：
- GET/POST 请求
- 超时控制（默认 100 秒）
- 自动处理查询参数
- 特殊响应处理（文本/JSON）

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
- 使用 `Promise.race` 实现超时机制
- 自动构建 URL 查询参数
- 针对不同接口的特殊响应处理

---

### 2. API 接口模块 (`api.ts`)

#### 通用站点 API

##### `getNPHPLedTorrent(id, type)`

认领或弃种操作。

**参数**：
- `id: string` - 种子 ID
- `type: 'removeClaim' | 'addClaim'` - 操作类型

**返回**：`Promise<PTAPI.LedTorrentDetails>`

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

**返回**：`Promise<PTAPI.LedTorrentDetails>`

#### 学校站 API

##### `getSchLedTorrent(id)`

学校站认领种子。

**返回**：`Promise<PTAPI.LedTorrentDetails>`

---

### 3. 通用站点处理 (`common/site.ts`)

#### `handleLedTorrent(arr, button, json, type)`

批量处理领种/弃种操作。

**参数**：
- `arr: TorrentDataIdsType` - 种子 ID 数组
- `button: HTMLButtonElement` - 按钮元素（显示进度）
- `json: Record<string, number>` - 结果统计
- `type: 'removeClaim' | 'addClaim'` - 操作类型

**流程**：
1. 遍历种子数组
2. 逐个调用 API
3. 更新按钮进度显示
4. 统计操作结果

#### `loadUserTorrents(userid, allData, ledlist)`

加载用户当前做种数据。

**返回值填充**：
- `allData` - 可认领的种子 ID
- `ledlist` - 已认领的种子 ID

**实现细节**：
- 支持分页加载（使用 `checkForNextPage`）
- DOM 解析提取按钮状态
- 根据按钮文本判断是否可认领

#### `loadUserTorrentsHistory(uid, allData, ledlist)`

加载历史领种记录（用于弃种功能）。

**用途**：获取已认领但当前不在做种的种子，供用户选择是否弃种。

---

### 4. 站点适配器 (`sites/`)

#### 猫站适配器 (`pter.ts`)

**核心函数**：

1. **`loadPterUserTorrents(userid, allData, ledlist)`**
   - 选择器：`.claim-confirm` / `.remove-confirm`
   - 提取 `data-url` 属性

2. **`handleLedPterTorrent(arr, button, json)`**
   - 调用 `getNPHPPterLedTorrent`
   - 根据返回值判断成功/失败

**站点特点**：
- 使用特殊的数据 URL 结构
- 返回布尔值而非标准响应

#### 春天站适配器 (`springsunday.ts`)

**核心函数**：

1. **`loadSpringsundayUserTorrents(userid, allData, ledlist)`**
   - 选择器：`.btn` / `.nowrap`
   - 从 `id` 属性提取种子 ID（移除 "btn" 前缀）
   - 检查 `innerHTML === '已认领'` 判断状态

2. **`handleLedSpringsundayTorrent(arr, button, json)`**
   - 调用 `getSSDLedTorrent`
   - 根据返回值判断成功/失败

**站点特点**：
- 使用标准 PT API 格式
- 按钮文本为中文

#### 学校站适配器 (`sch.ts`)

**核心函数**：

1. **`loadSchTorrentsHistory(uid, allData, ledlist)`**
   - 复用通用站点的 `loadUserTorrentsHistory` 逻辑
   - 选择器：`#claim-table td button`
   - 提取 `data-torrent_id` 和 `data-claim_id`

**站点特点**：
- 与通用站点类似
- 仅提供历史记录加载函数

---

## 关键依赖与配置

### 内部依赖关系

```
utils/index.ts
├── utils/common/index.ts
├── utils/common/site.ts
│   ├── utils/api.ts
│   │   └── utils/request.ts
│   └── utils/common/index.ts (checkForNextPage)
├── utils/sites/pter.ts
│   ├── utils/api.ts
│   └── utils/common/index.ts
└── utils/sites/springsunday.ts
    ├── utils/api.ts
    └── utils/common/index.ts
```

### 外部依赖

- **@/types** - TypeScript 类型定义
- **浏览器原生 API** - fetch、DOMParser、URLSearchParams

---

## 数据模型

### 输入数据

| 类型 | 用途 |
|------|------|
| `TorrentDataIdsType` | 种子 ID 数组（`string[]`） |
| `userid: string` | 用户 ID |
| `button: HTMLButtonElement` | 操作按钮元素 |
| `json: Record<string, number>` | 结果统计对象 |

### 输出数据

| 类型 | 说明 |
|------|------|
| `PTAPI.LedTorrentDetails` | API 响应（`{ msg: string, ret: number }`） |
| `boolean` | 成功/失败标识 |
| `string` | HTML 文本响应 |

---

## 测试与质量

### 当前状态

- **无测试覆盖**
- 代码质量依赖 ESLint
- 使用 TypeScript 类型检查

### 代码规范

遵循 **@antfu/eslint-config**：
- 2 空格缩进
- 单引号
- 无分号
- import 语句按注释块分组排序

### 建议

1. **单元测试**
   - 测试各 API 函数
   - 测试 DOM 解析逻辑
   - 测试分页处理

2. **集成测试**
   - 测试完整的领种流程
   - 模拟不同站点的响应

---

## 常见问题 (FAQ)

### Q1: 如何添加新站点支持？

**步骤**：

1. 创建 `sites/newsite.ts`：
   ```typescript
   export async function loadNewSiteUserTorrents(
     userid: string,
     allData: TorrentDataIdsType,
     ledlist: string[]
   ) {
     // 1. 调用 API 获取 HTML
     // 2. 使用 DOMParser 解析
     // 3. 使用 querySelector 提取数据
     // 4. 支持分页（checkForNextPage）
   }

   export async function handleLedNewSiteTorrent(
     arr: TorrentDataIdsType,
     button: HTMLButtonElement,
     json: Record<string, number>
   ) {
     // 1. 遍历数组
     // 2. 调用 API
     // 3. 更新按钮和统计
   }
   ```

2. 在 `api.ts` 中添加 API 函数

3. 在 `utils/index.ts` 中导出新函数

4. 在 `main.ts` 中添加路由判断

### Q2: 如何调试站点适配器？

**方法**：

1. 在浏览器 Tampermonkey 中访问目标站点
2. 打开开发者工具控制台
3. 检查 DOM 结构，找到种子列表的选择器
4. 测试 DOMParser 解析逻辑：
   ```javascript
   const parser = new DOMParser()
   const doc = parser.parseFromString(html, 'text/html')
   console.log(doc.querySelectorAll('your-selector'))
   ```

### Q3: 如何处理站点 API 变化？

**步骤**：

1. 检查浏览器 Network 面板，查看实际请求
2. 更新 `api.ts` 中的请求参数
3. 更新响应解析逻辑（`request.ts` 特殊处理）
4. 测试确认功能正常

---

## 相关文件清单

### 核心文件（行数统计）

- `utils/index.ts` - 52 行
- `utils/api.ts` - 158 行
- `utils/request.ts` - 106 行
- `utils/common/index.ts` - 43 行
- `utils/common/site.ts` - 138 行
- `utils/sites/pter.ts` - 83 行
- `utils/sites/springsunday.ts` - 85 行
- `utils/sites/sch.ts` - 63 行

**总计**：728 行代码

---

## 变更记录

### 2026-01-14
- 初始化 utils 模块文档
- 完成接口文档与依赖关系图
- 补充站点适配器开发指南
