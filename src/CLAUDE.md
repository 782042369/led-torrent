[根目录](../CLAUDE.md) > **src**

---

# src 模块

> **模块路径**: `src/`
> **模块职责**: 源代码主目录，包含所有业务逻辑与 UI 代码
> **语言**: TypeScript + SCSS

---

## 模块职责

`src` 是项目的核心模块，包含：

1. **应用入口** (`main.ts`): 油猴脚本启动逻辑
2. **业务服务层** (`services/`): 种子操作服务、站点工厂
3. **站点适配器** (`adapters/`): 不同 PT 站点的适配器实现
4. **类型定义** (`types/`): TypeScript 类型声明
5. **工具函数** (`utils/`): HTTP 请求、并发控制、DOM 操作等
6. **样式文件** (`styles/`): UI 样式

---

## 入口与启动

### 主入口文件
**文件**: `main.ts`

**启动流程**:
```typescript
bootstrap()
  └──> 创建 UI 元素 (button + ul)
      └──> new UIManager(button, messageList)
          └──> new AppController(ui)
              └──> controller.init()
                  └──> SiteFactory.getAdapter(url)
                      └──> new TorrentService(adapter)
```

**关键类**:
- `LoadingState`: 加载状态管理
- `UIManager`: UI 更新与事件监听
- `AppController`: 应用控制器，处理领种/弃种逻辑

---

## 对外接口

### 油猴脚本元数据
**配置文件**: `vite.config.ts`

```typescript
{
  name: '一键领种、弃种',
  namespace: '方便用户一键领种、弃种',
  match: [
    '**/userdetails.php?id=*',
    '**://*/claim.php?uid=*',
    'http*://pterclub.com/getusertorrentlist.php?*'
  ],
  icon: 'https://lsky.939593.xyz:11111/Y7bbx9.jpg',
  version: '1.8.4'
}
```

**支持的 URL 模式**:
- 用户详情页: `userdetails.php?id=*`
- 领取记录页: `claim.php?uid=*`
- 猫站种子列表: `pterclub.com/getusertorrentlist.php?*`

---

## 关键依赖与配置

### 内部依赖关系
```
main.ts
  ├── services/site.factory.ts
  │     └── adapters/*.ts
  │           └── base.adapter.ts
  ├── services/torrent.service.ts
  │     └── adapters/base.adapter.ts
  ├── utils/common/ui.ts
  ├── utils/common/dom.ts
  └── utils/constants.ts
```

### 外部依赖
- **无运行时依赖**: 纯浏览器环境 API
- **构建时依赖**: Vite、TypeScript、ESLint、Sass

---

## 数据模型

### 核心数据流

#### 1. 种子数据加载
```typescript
// 输入
userId: string
// 输出
TorrentData {
  claimable: string[]   // 可认领的种子ID
  claimed: string[]     // 已认领的种子ID
}
```

#### 2. 操作执行
```typescript
// 输入
torrentIds: string[]
action: ActionType.CLAIM | ActionType.ABANDON
// 输出
Record<string, number>  // 统计结果: { "领取成功": 10, "领取失败": 2 }
```

---

## 测试与质量

### 当前状态
- **无自动化测试**
- **手动测试**: 在真实 PT 站点中测试
- **代码检查**: ESLint (antfu config)

### 建议补充
- Vitest 单元测试覆盖工具函数
- Playwright E2E 测试覆盖核心流程

---

## 常见问题 (FAQ)

### Q1: 如何调试油猴脚本？
**A**:
1. 打开浏览器开发者工具 (F12)
2. 在 Console 中查看日志输出
3. 使用 `debugger` 语句断点调试
4. 检查 Network 面板查看 HTTP 请求

### Q2: 如何添加新站点支持？
**A**: 参见根目录 `CLAUDE.md` 中的"添加新站点适配器"章节。

### Q3: 并发参数如何调整？
**A**: 修改 `utils/constants.ts`:
```typescript
export const DEFAULT_CONCURRENCY_LIMIT = 2  // 并发数
export const DEFAULT_DELAY_AFTER_REQUEST_MS = 1000  // 延迟毫秒
```

### Q4: 为什么猫站不支持弃种？
**A**: 猫站 API 限制，未提供弃种接口。详见 `pter.adapter.ts`。

---

## 相关文件清单

### 入口与控制
- `main.ts` (224 行) - 应用入口、UI 控制器

### 服务层
- `services/torrent.service.ts` (98 行) - 种子操作服务
- `services/site.factory.ts` (22 行) - 站点工厂

### 适配器
- `adapters/base.adapter.ts` (65 行) - 适配器基类
- `adapters/generic.adapter.ts` (187 行) - 通用 NPHP 站点
- `adapters/pter.adapter.ts` (113 行) - 猫站
- `adapters/springsunday.adapter.ts` (109 行) - 春天站

### 类型定义
- `types/index.ts` (11 行) - 类型导出
- `types/site.ts` (77 行) - 站点适配器接口
- `types/torrent.ts` (28 行) - 种子数据类型
- `types/api.ts` (API 相关类型)
- `types/error.ts` (错误类型)

### 工具函数
- `utils/api.ts` (146 行) - API 请求函数
- `utils/constants.ts` (220 行) - 常量定义
- `utils/concurrency.ts` (69 行) - 并发控制
- `utils/errors.ts` (82 行) - 错误处理
- `utils/request.ts` (207 行) - HTTP 请求封装
- `utils/request-config.ts` - 请求拦截器配置
- `utils/common/dom.ts` - DOM 工具
- `utils/common/ui.ts` (41 行) - UI 工具

### 样式
- `styles/led-torrent.scss` (212 行) - UI 样式

### 类型声明
- `vite-env.d.ts` - Vite 类型声明

---

## 变更记录 (Changelog)

### 2026-01-25 19:18:04
- 初始化 src 模块文档
- 生成文件清单与架构说明
