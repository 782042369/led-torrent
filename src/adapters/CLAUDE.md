[根目录](../CLAUDE.md) > **adapters**

---

# adapters 模块

## 模块职责

`adapters/` 模块是 LED Torrent 项目的站点适配器层，负责实现各个 PT 站点的业务逻辑。该模块采用 OOP 设计，使用基类和接口消除重复代码，使新站点适配变得简单快捷。

---

## 目录结构

```
adapters/
├── index.ts              # 统一导出（20 行）
├── base.ts               # 基类和接口（246 行）
├── common.ts             # 通用站点适配器（153 行）
├── pter.ts               # 猫站适配器（133 行）
└── springsunday.ts       # 春天站适配器（135 行）
```

---

## 入口与启动

### 设计模式

**策略模式 + 模板方法模式**

- **基类**（`BaseSiteAdapter`）：定义通用流程和抽象方法
- **子类**（各站点适配器）：实现站点特定的解析和操作逻辑

---

## 对外接口

### 1. 基类和接口 (`base.ts`)

#### `ISiteAdapter` 接口

所有站点适配器必须实现此接口。

```typescript
export interface ISiteAdapter {
  siteName: string
  loadUserTorrents(
    userid: string,
    allData: TorrentDataIdsType,
    ledlist: string[]
  ): Promise<void>
  handleLedTorrent(
    arr: TorrentDataIdsType,
    ui: UIManager,
    stats: Record<string, number>
  ): Promise<void>
}
```

#### `BaseSiteAdapter` 抽象类

提供通用的分页加载和批量处理逻辑。

##### 抽象方法（子类必须实现）

```typescript
protected abstract fetchPageData(page: number, userid: string): Promise<string>
protected abstract parsePageData(
  html: string,
  allData: TorrentDataIdsType,
  ledlist: string[]
): void
protected abstract hasNextPage(doc: Document, page: number, userid: string): boolean
protected abstract claimOneTorrent(id: string): Promise<string>
```

##### 具体方法（子类直接使用）

###### `loadUserTorrents(userid, allData, ledlist)`

加载用户种子数据（带分页）。

**流程**：

1. 循环获取页面数据
2. 解析页面提取种子 ID
3. 检查是否有下一页
4. 重复直到没有下一页

###### `handleLedTorrent(arr, ui, stats)`

执行批量领种操作（使用并发控制）。

**流程**：

1. 创建 `BatchTaskExecutor`（5 个并发，每分钟 35 个请求）
2. 执行所有任务
3. 统计结果
4. 显示统计信息

#### `DOMHelper` 工具类

提供常用的 DOM 解析方法。

##### `checkNextPage(doc, selector)`

检查是否有下一页。

##### `getAttr(element, attrName, defaultValue)`

提取元素属性值。

##### `textContains(element, searchText)`

检查元素文本是否包含指定内容。

##### `isVisible(element)`

检查元素是否可见。

---

### 2. 通用站点适配器 (`common.ts`)

**适用站点**：所有使用 Nexus PHP 标准的 PT 站点

#### 核心函数

##### `handleLedTorrent(arr, button, json, type)`

批量处理领种/弃种操作。

**参数**：

- `arr: TorrentDataIdsType` - 种子 ID 数组
- `button: HTMLButtonElement` - 按钮元素（显示进度）
- `json: Record<string, number>` - 结果统计
- `type: 'removeClaim' | 'addClaim'` - 操作类型

##### `loadUserTorrents(userid, allData, ledlist)`

加载用户当前做种数据。

**DOM 解析逻辑**：

```typescript
const tdList = doc.querySelectorAll('td')
tdList.forEach((v) => {
  const buttons = v.querySelectorAll('button')
  if (buttons.length > 0) {
    const torrent_id = buttons[0].getAttribute('data-torrent_id')

    // 检查第一个按钮（领种按钮）
    if (
      (buttons[0].textContent?.includes('领') || buttons[0].textContent?.includes('領'))
      && buttons[1].style.display === 'none'
      && torrent_id
    ) {
      allData.push(torrent_id)
    }

    // 检查第二个按钮（弃种按钮）
    if (
      buttons[0].style.display === 'none'
      && (buttons[1].textContent?.includes('弃') || buttons[1].textContent?.includes('棄'))
    ) {
      ledlist.push(torrent_id)
    }
  }
})
```

##### `loadUserTorrentsHistory(uid, allData, ledlist)`

加载历史领种记录（用于弃种功能）。

**用途**：获取已认领但当前不在做种的种子，供用户选择是否弃种。

---

### 3. 猫站适配器 (`pter.ts`)

**站点域名**：pterclub.com

**适配器类**：`PterSiteAdapter`

#### 核心实现

##### `fetchPageData(page, userid)`

```typescript
return getNPHPPterUsertorrentlistajax({
  page,
  userid,
  type: 'seeding',
})
```

##### `parsePageData(html, allData, ledlist)`

**DOM 解析逻辑**：

```typescript
const claimDoms = doc.querySelectorAll('.claim-confirm')
const removeDoms = doc.querySelectorAll('.remove-confirm')

claimDoms.forEach((v) => {
  const id = DOMHelper.getAttr(v, 'data-url')
  if (id && !allData.includes(id)) {
    allData.push(id)
  }
})

removeDoms.forEach((v) => {
  const id = DOMHelper.getAttr(v, 'data-url')
  if (id && !ledlist.includes(id)) {
    ledlist.push(id)
  }
})
```

##### `hasNextPage(doc, page, userid)`

```typescript
return DOMHelper.checkNextPage(
  doc,
  `a[href*="?userid=${userid}&type=seeding&page=${page}"]`
)
```

##### `claimOneTorrent(id)`

```typescript
try {
  const data = await getNPHPPterLedTorrent(id)
  return data ? '领取成功' : '领取失败'
} catch {
  return '领取失败'
}
```

---

### 4. 春天站适配器 (`springsunday.ts`)

**站点域名**：springsunday.net

**适配器类**：`SpringSiteAdapter`

#### 核心实现

##### `fetchPageData(page, userid)`

```typescript
return getNPHPUsertorrentlistajax({
  page,
  userid,
  type: 'seeding',
})
```

##### `parsePageData(html, allData, ledlist)`

**DOM 解析逻辑**：

```typescript
const claimDoms = doc.querySelectorAll('.btn')
const removeDoms = doc.querySelectorAll('.nowrap')

claimDoms.forEach((v) => {
  const id = DOMHelper.getAttr(v, 'id', '').replace('btn', '')
  if (id && !allData.includes(id)) {
    allData.push(id)
  }
})

removeDoms.forEach((v) => {
  if (v.innerHTML === '已认领') {
    const id = DOMHelper.getAttr(v, 'id', '').replace('btn', '')
    if (id && !ledlist.includes(id)) {
      ledlist.push(id)
    }
  }
})
```

##### `hasNextPage(doc, page, userid)`

```typescript
return DOMHelper.checkNextPage(
  doc,
  `a[href*="?userid=${userid}&type=seeding&page=${page}"]`
)
```

##### `claimOneTorrent(id)`

```typescript
try {
  const data = await getSSDLedTorrent(id)
  return data && data.ret === 0 ? '领取成功' : '领取失败'
} catch {
  return '领取失败'
}
```

---

## 关键依赖与配置

### 内部依赖

```
adapters/
├── base.ts
│   ├── core/concurrent    # 并发控制
│   └── core/types         # 类型定义
├── common.ts
│   ├── core/api           # API 接口
│   └── utils/dom          # DOM 工具
├── pter.ts
│   ├── core/api
│   └── base.ts
└── springsunday.ts
    ├── core/api
    └── base.ts
```

### 外部依赖

- **浏览器原生 API**：`DOMParser`、`document`

---

## 数据模型

### 适配器工作流程

```
initApp()
    ↓
匹配路由
    ↓
调用 loadUserTorrents
    ↓
BaseSiteAdapter.loadUserTorrents
    ↓
循环：fetchPageData → parsePageData → hasNextPage
    ↓
调用 handleLedTorrent
    ↓
BaseSiteAdapter.handleLedTorrent
    ↓
创建 BatchTaskExecutor → 执行所有任务 → 统计结果
    ↓
UIManager.showStats
```

### DOM 解析流程

```
获取 HTML
    ↓
DOMParser.parseFromString
    ↓
querySelectorAll
    ↓
遍历元素 → 提取属性 → 去重
    ↓
填充 allData / ledlist
```

---

## 测试与质量

### 当前状态

- **无测试覆盖**
- 建议添加单元测试

### 测试建议

1. **DOM 解析测试**
   - 测试不同站点的 HTML 结构解析
   - 测试边界情况（空列表、单页、多页）

2. **API 调用测试**
   - 模拟 API 响应
   - 测试错误处理

3. **集成测试**
   - 测试完整的领种流程
   - 测试分页加载逻辑

---

## 常见问题 (FAQ)

### Q1: 如何添加新站点适配器？

**步骤**：

1. 创建 `src/adapters/newsite.ts`：

   ```typescript
   import { BaseSiteAdapter, DOMHelper } from './base'
   import type { TorrentDataIdsType } from '@/core/types'
   import { getNewSiteApi } from '@/core/api'

   class NewSiteAdapter extends BaseSiteAdapter {
     siteName = '新站点'

     protected async fetchPageData(page: number, userid: string): Promise<string> {
       return getNewSiteApi({ page, userid })
     }

     protected parsePageData(html: string, allData: TorrentDataIdsType, ledlist: string[]): void {
       const parser = new DOMParser()
       const doc = parser.parseFromString(html, 'text/html')

       // 使用 DOMHelper 提取数据
       const items = doc.querySelectorAll('.torrent-item')
       items.forEach((item) => {
         const id = DOMHelper.getAttr(item, 'data-id')
         if (id && !allData.includes(id)) {
           allData.push(id)
         }
       })
     }

     protected hasNextPage(doc: Document, page: number, userid: string): boolean {
       return DOMHelper.checkNextPage(doc, `a[href*="?page=${page}"]`)
     }

     protected async claimOneTorrent(id: string): Promise<string> {
       try {
         const data = await claimNewSiteTorrent(id)
         return data.ret === 0 ? '领取成功' : '领取失败'
       } catch {
         return '领取失败'
       }
     }
   }

   export const newSiteAdapter = new NewSiteAdapter()

   export async function loadNewSiteUserTorrents(
     userid: string,
     allData: TorrentDataIdsType,
     ledlist: string[]
   ): Promise<void> {
     await newSiteAdapter.loadUserTorrents(userid, allData, ledlist)
   }

   export async function handleLedNewSiteTorrent(
     arr: TorrentDataIdsType,
     button: HTMLButtonElement,
     json: Record<string, number>
   ): Promise<void> {
     const messageList = button.nextElementSibling as HTMLUListElement
     const ui: UIManager = {
       updateButton: (text: string) => { button.textContent = text },
       updateProgress: (current: number, total: number) => {
         button.textContent = `努力再努力 ${total} / ${current}`
       },
       addMessage: (message: string) => {
         const li = document.createElement('li')
         li.textContent = message
         messageList.appendChild(li)
       },
       flush: () => {},
       clearMessages: () => { messageList.innerHTML = '' },
       showStats: (stats: Record<string, number>) => {
         messageList.innerHTML = Object.entries(stats)
           .map(([key, value]) => `<li>${key}: ${value}</li>`)
           .join('')
       },
       setDisabled: (disabled: boolean) => { button.disabled = disabled },
     }

     await newSiteAdapter.handleLedTorrent(arr, ui, json)
   }
   ```

2. 在 `src/adapters/index.ts` 中导出：

   ```typescript
   export * from './newsite'
   ```

3. 在 `src/router/index.ts` 中导入和使用

4. 在 `src/router/routes.ts` 中添加路由配置

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

### Q3: 如何使用 DOMHelper？

**示例**：

```typescript
import { DOMHelper } from './base'

// 检查下一页
const hasNext = DOMHelper.checkNextPage(doc, 'a[href*="?page=2"]')

// 提取属性
const id = DOMHelper.getAttr(element, 'data-id', '')

// 检查文本
const contains = DOMHelper.textContains(element, '领取')

// 检查可见性
const visible = DOMHelper.isVisible(element)
```

---

## 相关文件清单

- `adapters/index.ts` - 统一导出（20 行）
- `adapters/base.ts` - 基类和接口（246 行）
- `adapters/common.ts` - 通用站点适配器（153 行）
- `adapters/pter.ts` - 猫站适配器（133 行）
- `adapters/springsunday.ts` - 春天站适配器（135 行）

**总计**：687 行代码

---

## 变更记录

### 2026-01-15

- 初始化 adapters 模块文档
- 完成基类和适配器接口文档
- 补充站点适配器开发指南
