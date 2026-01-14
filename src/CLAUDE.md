[根目录](../CLAUDE.md) > **src**

---

# src 模块

## 模块职责

`src/` 是 LED Torrent 项目的源代码根目录，包含了所有前端代码和资源。该模块采用模块化架构设计，将功能按照职责分离到不同的子目录中。

---

## 目录结构

```
src/
├── main.ts                    # 主入口文件
├── vite-env.d.ts             # Vite 环境类型声明
├── utils/                    # 工具函数集合
│   ├── index.ts              # 工具函数导出入口
│   ├── api.ts                # API 接口封装
│   ├── request.ts            # HTTP 请求封装
│   ├── common/               # 通用工具函数
│   └── sites/                # 站点适配器
├── types/                    # TypeScript 类型定义
└── styles/                   # 样式文件
```

---

## 入口与启动

### 主入口文件

**文件路径**：`main.ts`

**职责**：
- 脚本初始化和 UI 渲染
- 根据当前 URL 判断所在站点并分发处理逻辑
- 创建操作按钮和状态显示区域
- 绑定事件监听器

**核心流程**：

1. **UI 初始化**
   ```typescript
   const button = document.createElement('button')
   const ulbox = document.createElement('ul')
   button.className = 'bubbly-button'
   ```

2. **站点路由判断**
   ```typescript
   if (location.href.includes('pterclub.com/getusertorrentlist.php')) {
     // 猫站领取种子
   } else if (location.href.includes('springsunday.net/userdetails.php')) {
     // 春天站领取种子
   } else if (location.href.includes('pt.btschool.club/userdetails.php')) {
     // 学校站领取种子
   }
   ```

3. **事件处理**
   - 使用 `setupButtonListener` 统一处理按钮点击事件
   - 加载状态管理（防止重复点击）
   - 实时更新按钮状态和进度显示

---

## 对外接口

### 导出的主要函数

从 `@/utils` 导出以下核心函数：

| 函数名 | 用途 | 定义位置 |
|--------|------|----------|
| `loadUserTorrents` | 加载通用站点用户做种数据 | `utils/common/site.ts` |
| `loadPterUserTorrents` | 加载猫站用户做种数据 | `utils/sites/pter.ts` |
| `loadSpringsundayUserTorrents` | 加载春天站用户做种数据 | `utils/sites/springsunday.ts` |
| `handleLedTorrent` | 处理通用站点领种/弃种 | `utils/common/site.ts` |
| `handleLedPterTorrent` | 处理猫站领种 | `utils/sites/pter.ts` |
| `handleLedSpringsundayTorrent` | 处理春天站领种 | `utils/sites/springsunday.ts` |
| `getLedMsg` | 生成提示信息 | `utils/index.ts` |
| `animateButton` | 按钮动画效果 | `utils/index.ts` |
| `getvl` | 解析 URL 参数 | `utils/index.ts` |

---

## 关键依赖与配置

### 运行时依赖

本项目**无运行时依赖**，纯使用浏览器原生 API：
- `fetch` - HTTP 请求
- `DOMParser` - HTML 解析
- `URLSearchParams` - URL 参数解析
- `document` / `window` - DOM 操作

### 开发依赖

- **TypeScript 5.9+** - 类型系统
- **Vite 7** - 构建工具
- **vite-plugin-monkey** - 用户脚本构建插件
- **SCSS** - 样式预处理器
- **@antfu/eslint-config** - 代码规范

### 构建配置

**Vite 配置** (`vite.config.ts`)：
```typescript
{
  entry: 'src/main.ts',
  userscript: {
    name: '一键领种、弃种',
    version: '1.7',
    match: [
      'http*://*/userdetails.php?id=*',
      'http*://*/claim.php?uid=*',
      'http*://pterclub.com/getusertorrentlist.php?*'
    ]
  }
}
```

---

## 数据模型

### TorrentDataIdsType

**定义位置**：`types/index.d.ts`

```typescript
export type TorrentDataIdsType = string[]
```

**说明**：种子 ID 数组类型，用于批量操作。

### PTAPI.LedTorrentDetails

**定义位置**：`types/api.d.ts`

```typescript
namespace PTAPI {
  interface LedTorrentDetails {
    msg: string | 'OK'  // 操作结果消息
    ret: -1 | 0         // 返回码
  }
}
```

---

## 测试与质量

### 当前状态

- **无自动化测试**
- 无测试框架配置
- 无测试用例

### 建议

为核心功能添加单元测试：

1. **API 请求测试**
   - 测试超时处理
   - 测试错误响应处理

2. **DOM 解析测试**
   - 测试不同站点的 HTML 结构解析
   - 测试边界情况

3. **工具函数测试**
   - `getvl` 参数解析
   - `checkForNextPage` 分页检测

---

## 常见问题 (FAQ)

### Q1: 如何添加新站点支持？

**步骤**：

1. 在 `src/utils/sites/` 下创建新文件（如 `newsite.ts`）
2. 实现两个核心函数：
   ```typescript
   export async function loadNewSiteUserTorrents(
     userid: string,
     allData: TorrentDataIdsType,
     ledlist: string[]
   )

   export async function handleLedNewSiteTorrent(
     arr: TorrentDataIdsType,
     button: HTMLButtonElement,
     json: { [key in string]: number }
   )
   ```
3. 在 `src/utils/api.ts` 中添加站点特定的 API 函数
4. 在 `src/main.ts` 中添加 URL 路由判断
5. 在 `src/utils/index.ts` 中导出新函数

### Q2: 按钮不显示怎么办？

检查：
1. 当前 URL 是否在 `vite.config.ts` 的 `match` 配置中
2. 浏览器控制台是否有错误
3. Tampermonkey 脚本是否已启用

### Q3: 领种失败常见原因？

1. **登录失效**：站点登录状态过期
2. **权限不足**：用户没有领种权限
3. **网络超时**：请求超过 100 秒默认超时
4. **站点结构变化**：DOM 选择器失效

---

## 相关文件清单

### 核心文件

- `src/main.ts` - 主入口（198 行）
- `src/vite-env.d.ts` - Vite 类型声明

### 工具函数

- `src/utils/index.ts` - 工具函数导出（52 行）
- `src/utils/api.ts` - API 接口（158 行）
- `src/utils/request.ts` - HTTP 请求封装（106 行）

### 通用工具

- `src/utils/common/index.ts` - 通用函数（43 行）
- `src/utils/common/site.ts` - 通用站点处理（138 行）

### 站点适配器

- `src/utils/sites/pter.ts` - 猫站适配器（83 行）
- `src/utils/sites/springsunday.ts` - 春天站适配器（85 行）
- `src/utils/sites/sch.ts` - 学校站适配器（63 行）

### 类型定义

- `src/types/api.d.ts` - API 类型（25 行）
- `src/types/index.d.ts` - 通用类型（3 行）

### 样式文件

- `src/styles/led-torrent.scss` - 按钮样式（212 行）

---

## 变更记录

### 2026-01-14
- 初始化 src 模块文档
- 完成架构分析与文件清单整理
