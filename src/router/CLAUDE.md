[根目录](../CLAUDE.md) > **router**

---

# router 模块

## 模块职责

`router/` 模块是 LED Torrent 项目的路由系统，负责 URL 匹配、UI 初始化和事件分发。它是应用启动后的第一道关卡，将用户当前访问的 URL 映射到对应的站点适配器和操作类型。

---

## 目录结构

```
router/
├── index.ts              # 路由分发器（189 行）
└── routes.ts             # 路由配置（93 行）
```

---

## 入口与启动

### 主函数

**文件路径**：`router/index.ts`

**职责**：

- 创建 UI 组件（按钮和消息列表）
- 匹配当前 URL 到路由配置
- 设置按钮点击事件监听器
- 调用对应的适配器处理业务逻辑

**核心流程**：

```typescript
export function initApp() {
  // 1. 创建 UI 面板
  const { container, button, messageList } = UICreator.createPanel()

  // 2. 匹配路由
  const route = matchRoute()

  // 3. 如果匹配成功，设置按钮文本和事件
  if (route) {
    button.textContent = route.buttonText
    setupButtonListener(button, () =>
      handleTorrentsActions(button, messageList, getvl(route.userIdParam), route.action)
    )
  }

  // 4. 将面板添加到页面
  document.body.appendChild(container)
}
```

---

## 对外接口

### 路由配置

**文件路径**：`router/routes.ts`

#### `RouteConfig` 接口

```typescript
export interface RouteConfig {
  name: string                      // 路由名称
  pattern: string | string[]        // URL 匹配模式
  buttonText: string                // 按钮文本
  initMessage?: string              // 初始消息（可选）
  action: RouteAction               // 操作类型
  userIdParam: 'id' | 'uid' | 'userid'  // 用户 ID 参数名
}
```

#### `RouteAction` 类型

```typescript
export type RouteAction = 'claim' | 'abandon' | 'claimPter' | 'claimSpring'
```

#### 路由配置列表

```typescript
export const ROUTES: RouteConfig[] = [
  {
    name: '猫站领种',
    pattern: 'pterclub.com/getusertorrentlist.php',
    buttonText: '一键认领',
    action: 'claimPter',
    userIdParam: 'userid',
  },
  {
    name: '春天站领种',
    pattern: 'springsunday.net/userdetails.php',
    buttonText: '一键认领',
    action: 'claimSpring',
    userIdParam: 'id',
  },
  {
    name: '通用站点领种',
    pattern: 'userdetails.php',
    buttonText: '一键认领',
    action: 'claim',
    userIdParam: 'id',
  },
  {
    name: '通用站点弃种',
    pattern: 'claim.php',
    buttonText: '一键弃种',
    initMessage: '<li>放弃本人没在做种的种子</li>',
    action: 'abandon',
    userIdParam: 'uid',
  },
]
```

---

## 关键依赖与配置

### 内部依赖

```
router/
├── ui/                    # UI 组件
│   ├── UICreator         # UI 创建器
│   └── ButtonAnimator    # 按钮动画
├── adapters/             # 站点适配器
│   ├── loadUserTorrents
│   ├── loadPterUserTorrents
│   ├── loadSpringsundayUserTorrents
│   └── handleLed*Torrent
└── utils/                # 工具函数
    ├── getvl             # URL 参数解析
    └── getLedMsg         # 消息格式化
```

### 外部依赖

- **浏览器原生 API**：`document`、`window.location`

---

## 数据模型

### 路由匹配

路由匹配使用简单的字符串包含检查：

```typescript
function matchRoute(): RouteConfig | null {
  const currentUrl = location.href

  for (const route of ROUTES) {
    const patterns = Array.isArray(route.pattern) ? route.pattern : [route.pattern]

    for (const pattern of patterns) {
      if (currentUrl.includes(pattern)) {
        return route
      }
    }
  }

  return null
}
```

### 操作分发

根据 `action` 类型分发到不同的适配器：

```typescript
async function handleTorrentsActions(
  button: HTMLButtonElement,
  ulbox: HTMLElement,
  userId: string,
  action: RouteAction
) {
  const msglist: Record<string, number> = {}
  const ledlist: string[] = []
  const allData: TorrentDataIdsType = []

  // 1. 根据操作类型加载数据
  if (action === 'claim' || action === 'abandon') {
    await loadUserTorrents(userId, allData, ledlist)
  }
  else if (action === 'claimPter') {
    await loadPterUserTorrents(userId, allData, ledlist)
  }
  else if (action === 'claimSpring') {
    await loadSpringsundayUserTorrents(userId, allData, ledlist)
  }

  // 2. 执行操作
  if (action === 'claim') {
    await handleLedTorrent(allData, button, msglist, 'addClaim')
  }
  else if (action === 'abandon') {
    // 特殊处理：弃种需要加载历史数据
    if (confirm('真的要弃种吗?')) {
      await loadUserTorrentsHistory(userId, allData, ledlist)
      await handleLedTorrent(allData, button, msglist, 'removeClaim')
    }
  }
  else if (action === 'claimPter') {
    await handleLedPterTorrent(allData, button, msglist)
  }
  else if (action === 'claimSpring') {
    await handleLedSpringsundayTorrent(allData, button, msglist)
  }
}
```

---

## 测试与质量

### 当前状态

- **无测试覆盖**
- 建议添加路由匹配测试

### 测试建议

1. **单元测试**
   - 测试 `matchRoute` 函数的各种 URL
   - 测试路由优先级（猫站 > 春天站 > 通用站）

2. **集成测试**
   - 测试完整的路由到适配器的流程
   - 测试 UI 初始化和事件绑定

---

## 常见问题 (FAQ)

### Q1: 如何添加新站点路由？

**步骤**：

1. 在 `routes.ts` 中添加新的路由配置：

   ```typescript
   export const ROUTES: RouteConfig[] = [
     // ... 现有路由
     {
       name: '新站点领种',
       pattern: 'newsite.com/userdetails.php',
       buttonText: '一键认领',
       action: 'claimNewSite',
       userIdParam: 'id',
     },
   ]
   ```

2. 在 `index.ts` 中导入对应的适配器函数：

   ```typescript
   import { loadNewSiteUserTorrents, handleLedNewSiteTorrent } from '@/adapters'
   ```

3. 在 `handleTorrentsActions` 中添加对应的 action 处理

### Q2: 路由匹配的优先级是什么？

**优先级**：按 `ROUTES` 数组的顺序，从上到下匹配

**示例**：

- 猫站（`pterclub.com/getusertorrentlist.php`）优先于通用站（`userdetails.php`）
- 因为猫站路由在前，先匹配

### Q3: 如何禁用某个站点的路由？

**方法**：注释掉对应的路由配置

```typescript
export const ROUTES: RouteConfig[] = [
  // {
  //   name: '猫站领种',
  //   pattern: 'pterclub.com/getusertorrentlist.php',
  //   ...
  // },
]
```

---

## 相关文件清单

- `router/index.ts` - 路由分发器（189 行）
- `router/routes.ts` - 路由配置（93 行）

**总计**：282 行代码

---

## 变更记录

### 2026-01-15

- 初始化 router 模块文档
- 完成路由配置和使用说明
