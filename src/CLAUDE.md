[根目录](../CLAUDE.md) > **src**

---

# src 模块

## 模块职责

`src/` 是 LED Torrent 项目的源代码根目录。采用分层架构：路由 → 适配器 → 核心 → UI，各模块文档见对应子目录的 CLAUDE.md。

---

## 目录结构

```
src/
├── main.ts               # 应用入口，调用 initApp() 启动
├── vite-env.d.ts         # Vite 环境类型声明
├── router/               # 路由系统：URL 匹配与事件分发
│   ├── index.ts          # 路由分发器
│   └── routes.ts         # 路由配置（含 claim.php 弃种路由）
├── adapters/             # 站点适配器：各站点业务逻辑
│   ├── base.ts           # 基类与接口
│   ├── common.ts         # 通用 Nexus PHP 站点
│   ├── pter.ts           # 猫站
│   └── springsunday.ts   # 春天站
├── core/                 # 核心基础设施
│   ├── api.ts            # 站点 API 接口
│   ├── request.ts        # HTTP 请求封装
│   ├── concurrent.ts     # 并发控制
│   └── types.ts          # 类型定义
├── ui/                   # UI 组件（UIManager、UICreator、ButtonAnimator）
├── utils/                # 纯工具函数（dom、format、url）
├── styles/               # SCSS 样式
└── types/                # 类型定义（已废弃，待迁移）
```

---

## 入口与启动

**入口**：`main.ts` → `initApp()` → 匹配路由 → 绑定适配器动作

**路由匹配**：按 `ROUTES` 数组顺序，`location.href.includes(pattern)` 命中即返回。

**弃种流程**（claim.php 页面）：`loadUserTorrents`（做种数据）→ 清空 allData → `loadUserTorrentsHistory`（领取记录 claim_id）→ confirm → `handleLedTorrent('removeClaim')`。

---

## 变更记录

### 2026-08-17

- 合并 origin/main（v1.8.4 services 架构）到本地 router 架构，保留本地分层设计
- 修复弃种时 allData 混入可认领种子 ID 的 bug（issue #3）
- 清理旧架构死代码（src/utils/sites/、utils/api.ts、utils/request.ts 等）
