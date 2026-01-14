[根目录](../CLAUDE.md) > [src](../CLAUDE.md) > **utils**

---

# utils 模块

## 模块职责

`utils/` 模块是 LED Torrent 项目的工具函数库，提供纯函数集合，不包含副作用。该模块被重构为轻量级的工具库，只包含通用的 DOM、格式化和 URL 工具函数。

---

## 目录结构

```
utils/
├── index.ts              # 统一导出（17 行）
├── dom.ts                # DOM 工具（22 行）
├── format.ts             # 格式化工具（22 行）
└── url.ts                # URL 工具（23 行）
```

---

## 入口与启动

### 重构说明

**旧架构**：`utils/` 包含 API、请求、站点适配器等所有业务逻辑

**新架构**：`utils/` 只包含纯工具函数，业务逻辑迁移到 `adapters/` 和 `core/`

**优势**：

- 职责单一，易于维护
- 工具函数可在任何地方复用
- 便于单元测试

---

## 对外接口

### 1. DOM 工具 (`dom.ts`)

#### `checkForNextPage(doc, nextPageLinkSelector)`

检查是否有下一页。

**参数**：

- `doc: Document` - DOM 文档对象
- `nextPageLinkSelector: string` - 下一页链接选择器

**返回**：`boolean` - 是否存在下一页

**使用示例**：

```typescript
const parser = new DOMParser()
const doc = parser.parseFromString(html, 'text/html')

const hasNext = checkForNextPage(doc, 'a[href*="?page=2"]')
```

**实现**：

```typescript
export function checkForNextPage(
  doc: Document,
  nextPageLinkSelector: string,
): boolean {
  return Boolean(doc.querySelector(nextPageLinkSelector))
}
```

---

### 2. 格式化工具 (`format.ts`)

#### `getLedMsg(msglist)`

拼接提示信息为 HTML 列表。

**参数**：

- `msglist: Record<string, number>` - 消息统计对象

**返回**：`string` - HTML 字符串

**使用示例**：

```typescript
const msglist = {
  '领取成功': 10,
  '领取失败': 2,
}

const html = getLedMsg(msglist)
// '<li>领取成功: 10</li><li>领取失败: 2</li>'
```

**实现**：

```typescript
export function getLedMsg(msglist: Record<string, number>) {
  let msgLi = ''
  Object.keys(msglist).forEach((e) => {
    msgLi += `<li>${e}: ${msglist[e]}</li>`
  })
  return msgLi
}
```

---

### 3. URL 工具 (`url.ts`)

#### `getvl(name)`

解析 URL 参数。

**参数**：

- `name: string` - 参数名称

**返回**：`string` - 参数值，如果不存在则返回空字符串

**使用示例**：

```typescript
// URL: https://example.com/userdetails.php?id=123&name=test
const userId = getvl('id') // '123'
const userName = getvl('name') // 'test'
const notFound = getvl('foo') // ''
```

**实现**：

```typescript
export function getvl(name: string) {
  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result[name] ?? ''
}
```

---

## 关键依赖与配置

### 内部依赖

- **无**：纯工具函数，不依赖其他模块

### 外部依赖

- **浏览器原生 API**：`URLSearchParams`、`document`

---

## 数据模型

### 工具函数特性

| 函数 | 纯函数 | 副作用 | 可测试性 |
| --- | --- | --- | --- |
| `checkForNextPage` | ✅ | ❌ | ✅ |
| `getLedMsg` | ✅ | ❌ | ✅ |
| `getvl` | ✅ | ❌ | ✅ |

**所有工具函数都是纯函数，无副作用，易于测试。**

---

## 测试与质量

### 当前状态

- **无测试覆盖**
- 建议添加单元测试

### 测试建议

1. **DOM 工具测试**
   ```typescript
   describe('checkForNextPage', () => {
     it('should return true when next page exists', () => {
       const doc = new DOMParser().parseFromString(
         '<a href="?page=2">Next</a>',
         'text/html'
       )
       expect(checkForNextPage(doc, 'a[href*="?page=2"]')).toBe(true)
     })

     it('should return false when next page does not exist', () => {
       const doc = new DOMParser().parseFromString('<div>No pagination</div>', 'text/html')
       expect(checkForNextPage(doc, 'a[href*="?page=2"]')).toBe(false)
     })
   })
   ```

2. **格式化工具测试**
   ```typescript
   describe('getLedMsg', () => {
     it('should format message list to HTML', () => {
       const msglist = { '领取成功': 10, '领取失败': 2 }
       const html = getLedMsg(msglist)
       expect(html).toContain('<li>领取成功: 10</li>')
       expect(html).toContain('<li>领取失败: 2</li>')
     })
   })
   ```

3. **URL 工具测试**
   ```typescript
   describe('getvl', () => {
     beforeEach(() => {
       // Mock window.location.search
       delete (window as any).location
       ;(window as any).location = new URL('https://example.com?id=123&name=test')
     })

     it('should return parameter value', () => {
       expect(getvl('id')).toBe('123')
       expect(getvl('name')).toBe('test')
     })

     it('should return empty string for missing parameter', () => {
       expect(getvl('foo')).toBe('')
     })
   })
   ```

---

## 常见问题 (FAQ)

### Q1: 如何添加新的工具函数？

**步骤**：

1. 在对应的分类文件中添加函数（`dom.ts`、`format.ts` 或 `url.ts`）

2. 确保函数是纯函数（无副作用）

3. 在 `utils/index.ts` 中导出

**示例**：

```typescript
// utils/format.ts
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

// utils/index.ts
export * from './format'
```

### Q2: 为什么 utils/ 不再包含业务逻辑？

**原因**：

- **职责分离**：业务逻辑应该放在 `adapters/` 和 `core/` 中
- **可复用性**：`utils/` 只包含通用工具，可在任何项目中复用
- **可测试性**：纯函数更容易测试

### Q3: 如何使用这些工具函数？

**方法**：从 `@/utils` 导入

```typescript
import { checkForNextPage, getLedMsg, getvl } from '@/utils'

// 使用
const hasNext = checkForNextPage(doc, 'a[href*="?page=2"]')
const html = getLedMsg({ '成功': 10 })
const userId = getvl('id')
```

---

## 相关文件清单

- `utils/index.ts` - 统一导出（17 行）
- `utils/dom.ts` - DOM 工具（22 行）
- `utils/format.ts` - 格式化工具（22 行）
- `utils/url.ts` - URL 工具（23 行）

**总计**：84 行代码（重构后，大幅减少）

---

## 变更记录

### 2026-01-15

- 重构 utils 模块，移除业务逻辑
- 只保留纯工具函数
- 生成完整模块文档

### 2026-01-14

- 初始化 utils 模块文档（旧版本）
