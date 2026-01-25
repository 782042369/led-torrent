# led-torrent - PT 站点一键领种/弃种工具

> **变更记录 (Changelog)**
> - **2026-01-25 19:18:04** - 初始化项目 AI 上下文，生成完整架构文档

---

## 项目愿景

`led-torrent` 是一个 **油猴脚本 (Tampermonkey/UserScript)**，为 PT (Private Tracker) 站点用户提供**一键批量领种**和**一键弃种**功能，支持多个 PT 站点。

通过适配器模式，该脚本能够智能识别不同站点的页面结构，并执行相应的领种/弃种操作，极大提升用户的 PT 养号效率。

---

## 架构总览

### 技术栈
- **运行环境**: 浏览器油猴脚本 (Tampermonkey/Violentmonkey)
- **构建工具**: Vite 7.x + vite-plugin-monkey
- **开发语言**: TypeScript 5.9+
- **包管理器**: pnpm
- **代码规范**: ESLint (antfu config) + TypeScript Strict Mode
- **样式**: SCSS
- **CI/CD**: GitHub Actions + semantic-release

### 设计模式
- **适配器模式** (`Adapter Pattern`): 统一不同 PT 站点的 API 接口
- **工厂模式** (`Factory Pattern`): `SiteFactory` 根据URL自动选择适配器
- **策略模式** (`Strategy Pattern`): 并发控制与请求延迟策略

---

## 模块结构图

```mermaid
graph TD
    ROOT["(根) led-torrent"]
    ROOT --> SRC["src/"]
    SRC --> MAIN["main.ts - 入口"]
    SRC --> SERVICES["services/ - 业务服务"]
    SRC --> ADAPTERS["adapters/ - 站点适配器"]
    SRC --> TYPES["types/ - 类型定义"]
    SRC --> UTILS["utils/ - 工具函数"]
    SRC --> STYLES["styles/ - 样式"

    SERVICES --> FACTORY["site.factory.ts"]
    SERVICES --> SERVICE["torrent.service.ts"]

    ADAPTERS --> BASE["base.adapter.ts"]
    ADAPTERS --> GENERIC["generic.adapter.ts"]
    ADAPTERS --> PTER["pter.adapter.ts"]
    ADAPTERS --> SSD["springsunday.adapter.ts"]

    TYPES --> API_TYPE["api.ts"]
    TYPES --> ERROR_TYPE["error.ts"]
    TYPES --> SITE_TYPE["site.ts"]
    TYPES --> TORRENT_TYPE["torrent.ts"]

    UTILS --> API_UTILS["api.ts"]
    UTILS --> COMMON["common/"]
    UTILS --> CONCURRENCY["concurrency.ts"]
    UTILS --> CONSTANTS["constants.ts"]
    UTILS --> ERRORS["errors.ts"]
    UTILS --> REQUEST["request.ts"]
    UTILS --> REQUEST_CONFIG["request-config.ts"]

    click MAIN "#src-main-ts" "查看入口文件"
    click SERVICE "#src-services-torrent-service-ts" "查看服务层"
    click FACTORY "#src-services-site-factory-ts" "查看工厂"
    click GENERIC "#src-adapters-generic-adapter-ts" "查看通用适配器"
```

---

## 模块索引

| 模块路径 | 职责 | 语言 | 入口文件 |
|---------|------|------|----------|
| `src/main.ts` | 应用入口，UI 控制器 | TypeScript | `src/main.ts` |
| `src/services/` | 业务服务层 | TypeScript | `torrent.service.ts`, `site.factory.ts` |
| `src/adapters/` | 站点适配器 | TypeScript | `base.adapter.ts`, `generic.adapter.ts`, `pter.adapter.ts`, `springsunday.adapter.ts` |
| `src/types/` | 类型定义 | TypeScript | `index.ts`, `site.ts`, `torrent.ts`, `api.ts`, `error.ts` |
| `src/utils/` | 工具函数库 | TypeScript | `request.ts`, `api.ts`, `constants.ts`, `concurrency.ts` |
| `src/styles/` | 样式文件 | SCSS | `led-torrent.scss` |
| `.github/workflows/` | CI/CD 配置 | YAML | `release.yml` |

---

## 运行与开发

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```
- 使用 Vite 开发服务器
- 支持热更新 (HMR)
- 入口文件: `src/main.ts`

### 构建
```bash
pnpm build
```
- 输出目录: `dist/`
- 生成 `.user.js` 油猴脚本文件

### 代码检查
```bash
pnpm lint
```
- 自动修复代码风格问题

### 安装到浏览器
1. 安装 Tampermonkey 或 Violentmonkey 扩展
2. 打开 `dist/*.user.js` 文件
3. 复制全部内容，粘贴到油猴扩展中创建新脚本

---

## 测试策略

当前项目**暂无自动化测试**。

建议补充：
- **单元测试**: 使用 Vitest 测试适配器、工具函数
- **集成测试**: 测试 `SiteFactory` 和 `TorrentService`
- **E2E 测试**: 使用 Playwright 测试油猴脚本在真实站点中的行为

---

## 编码规范

### TypeScript 配置
- 目标: `ESNext`
- 模块系统: `ESNext`
- 严格模式: `strict: true`
- 路径别名: `@/*` -> `src/*`

### ESLint 规则
- 基于 `@antfu/eslint-config`
- 单引号、2 空格缩进、无分号
- 自动排序导入语句 (`perfectionist/sort-imports`)
- 允许使用 `alert()` 和 `confirm()`

### 命名约定
- **文件名**: 小写 + 连字符 (kebab-case)
- **类名**: 大驼峰 (PascalCase)
- **函数/变量**: 小驼峰 (camelCase)
- **常量**: 全大写下划线 (UPPER_SNAKE_CASE)
- **接口/类型**: 大驼峰 (PascalCase)

---

## AI 使用指引

### 适合 AI 辅助的任务

#### 推荐场景
- **添加新站点适配器**: 复制 `BaseAdapter` 并实现抽象方法
- **修复站点选择器**: 当 PT 站点更新 DOM 结构时
- **优化并发控制**: 调整 `DEFAULT_CONCURRENCY_LIMIT` 和延迟参数
- **添加新功能**: 如"一键重新认领"、"批量检查种子状态"等
- **代码重构**: 重构 `main.ts` 中的 `AppController` 类，分离关注点

#### 需要人工审核的场景
- **站点 API 变更**: 需要手动测试验证
- **并发参数调整**: 过高可能被站点封 IP
- **样式修改**: 需要在不同浏览器中测试视觉效果

### 关键上下文文件

| 文件 | 作用 | AI 使用建议 |
|------|------|-------------|
| `src/utils/constants.ts` | 所有常量定义 | 优先查看此文件了解参数含义 |
| `src/adapters/base.adapter.ts` | 适配器基类 | 添加新站点时继承此类 |
| `src/services/site.factory.ts` | 站点工厂 | 注册新适配器时修改此文件 |
| `src/types/site.ts` | `SiteAdapter` 接口定义 | 添加新方法时更新接口 |

### 常见任务模式

#### 添加新站点适配器
```bash
# 1. 创建新适配器文件
src/adapters/mysite.adapter.ts

# 2. 继承 BaseAdapter
export class MySiteAdapter extends BaseAdapter {
  readonly name = '我的站点'
  readonly type = SiteType.MYSITE

  supports(url: string): boolean {
    return url.includes('mysite.com')
  }

  async loadUserTorrents(userId: string, context?: LoadContext): Promise<TorrentData> {
    // 实现种子加载逻辑
  }

  async performAction(torrentId: string, action: ActionType, context?: ActionContext): Promise<ActionResult> {
    // 实现领种/弃种逻辑
  }
}

# 3. 在 SiteFactory 中注册
# src/services/site.factory.ts
import { MySiteAdapter } from '@/adapters/mysite.adapter'
private static adapters: SiteAdapter[] = [
  new MySiteAdapter(),  // 添加到最前
  // ... 其他适配器
]
```

#### 调整并发控制
```typescript
// src/utils/constants.ts
export const DEFAULT_CONCURRENCY_LIMIT = 2  // 默认并发数
export const DEFAULT_DELAY_AFTER_REQUEST_MS = 1000  // 请求延迟
```

---

## 支持的站点

| 站点名称 | 域名 | 支持功能 | 适配器 |
|---------|------|----------|--------|
| 猫站 | pterclub.net | 一键领种 | `PterAdapter` |
| 春天站 | springsunday.net | 一键领种 | `SpringSundayAdapter` |
| 通用 NPHP 站点 | * | 一键领种 + 一键弃种 | `GenericAdapter` |

---

## 项目文件清单

### 核心源码 (21 个 TypeScript 文件)
```
src/
├── main.ts                    # 应用入口
├── vite-env.d.ts             # Vite 类型声明
├── services/
│   ├── torrent.service.ts    # 种子操作服务
│   └── site.factory.ts       # 站点工厂
├── adapters/
│   ├── base.adapter.ts       # 适配器基类
│   ├── generic.adapter.ts    # 通用 NPHP 站点适配器
│   ├── pter.adapter.ts       # 猫站适配器
│   └── springsunday.adapter.ts  # 春天站适配器
├── types/
│   ├── index.ts              # 类型导出入口
│   ├── api.ts                # API 相关类型
│   ├── error.ts              # 错误类型
│   ├── site.ts               # 站点适配器接口
│   └── torrent.ts            # 种子数据类型
├── utils/
│   ├── api.ts                # API 请求函数
│   ├── constants.ts          # 常量定义
│   ├── concurrency.ts        # 并发控制
│   ├── errors.ts             # 错误处理
│   ├── request.ts            # HTTP 请求封装
│   ├── request-config.ts     # 请求拦截器配置
│   └── common/
│       ├── dom.ts            # DOM 工具函数
│       ├── index.ts          # 工具导出
│       └── ui.ts             # UI 工具函数
└── styles/
    └── led-torrent.scss      # 样式文件
```

### 配置文件
- `vite.config.ts` - Vite 构建配置
- `tsconfig.json` - TypeScript 配置
- `eslint.config.js` - ESLint 配置
- `package.json` - 项目依赖与脚本

---

## 变更记录 (Changelog)

### 2026-01-25 19:18:04
- 初始化项目 AI 上下文
- 生成完整架构文档与模块索引
- 建立覆盖率基线

### 历史版本
详见 [GitHub Releases](https://github.com/782042369/led-torrent/releases)
