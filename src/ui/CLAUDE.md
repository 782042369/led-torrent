[根目录](../CLAUDE.md) > **ui**

---

# ui 模块

## 模块职责

`ui/` 模块是 LED Torrent 项目的 UI 组件层，统一管理界面元素的创建、更新和动画效果。该模块提供了一套优雅的组件 API，减少频繁的 DOM 操作，提升用户体验。

---

## 目录结构

```
ui/
├── index.ts              # 统一导出（11 行）
└── components.ts         # 组件实现（214 行）
```

---

## 入口与启动

### 组件列表

| 组件 | 职责 |
| --- | --- |
| **UIManager** | UI 管理器，批量更新减少 DOM 操作 |
| **UICreator** | UI 元素创建器 |
| **ButtonAnimator** | 按钮动画控制器 |

---

## 对外接口

### 1. UIManager 类

**职责**：管理操作面板的 UI 更新，减少频繁 DOM 操作

#### 构造函数

```typescript
constructor(button: HTMLButtonElement, messageList: HTMLUListElement)
```

#### 方法

##### `updateButton(text: string)`

更新按钮文本。

```typescript
ui.updateButton('开始工作...')
```

##### `updateProgress(current: number, total: number)`

更新进度显示。

```typescript
ui.updateProgress(10, 100) // 显示 "努力再努力 100 / 10"
```

##### `addMessage(message: string)`

添加消息到队列（批量更新，减少 DOM 操作）。

**特性**：

- 消息先缓存到内存
- 100ms 后批量更新到 DOM
- 自动防抖，避免频繁操作

```typescript
ui.addMessage('领取成功: 10')
ui.addMessage('领取失败: 2')
ui.flush() // 立即刷新所有缓存的消息
```

##### `flush()`

立即刷新所有缓存的消息。

##### `clearMessages()`

清空消息列表。

##### `showStats(stats: Record<string, number>)`

批量显示统计结果。

```typescript
ui.showStats({
  '领取成功': 10,
  '领取失败': 2,
})
```

##### `setDisabled(disabled: boolean)`

设置按钮禁用状态。

---

### 2. UICreator 类

**职责**：快速创建标准 UI 元素

#### 静态方法

##### `createPanel()`

创建操作面板。

**返回**：

```typescript
{
  container: HTMLDivElement
  button: HTMLButtonElement
  messageList: HTMLUListElement
}
```

**使用示例**：

```typescript
const { container, button, messageList } = UICreator.createPanel()

document.body.appendChild(container)
```

##### `createMessageItem(text: string)`

创建带文本的消息项。

**返回**：`HTMLLIElement`

```typescript
const li = UICreator.createMessageItem('操作完成')
messageList.appendChild(li)
```

---

### 3. ButtonAnimator 类

**职责**：管理按钮的气泡动画效果

#### 静态方法

##### `animate(event: MouseEvent)`

触发按钮动画。

**使用示例**：

```typescript
button.addEventListener('click', (e) => {
  ButtonAnimator.animate(e)
  // 750ms 后动画自动结束
})
```

**动画原理**：

1. 移除 `animate` 类（如果存在）
2. 强制重绘
3. 添加 `animate` 类
4. 750ms 后移除类

---

## 关键依赖与配置

### 内部依赖

- **无**：纯 UI 组件，不依赖其他模块

### 外部依赖

- **浏览器原生 API**：`document`、`window`

---

## 数据模型

### 组件生命周期

```
UICreator.createPanel()
      ↓
创建 container、button、messageList
      ↓
UIManager 实例化
      ↓
批量操作：addMessage() → 缓存
      ↓
flush() → 批量更新 DOM
```

### 消息队列机制

```typescript
private messageCache: string[] = []
private updateTimer: number | null = null

addMessage(message) {
  messageCache.push(message)

  // 防抖，100ms 后批量更新
  if (updateTimer !== null) {
    clearTimeout(updateTimer)
  }

  updateTimer = setTimeout(() => {
    flushMessages()
  }, 100)
}

flushMessages() {
  const fragment = document.createDocumentFragment()

  messageCache.forEach((message) => {
    const li = document.createElement('li')
    li.textContent = message
    fragment.appendChild(li)
  })

  messageList.appendChild(fragment)
  messageCache = []
}
```

---

## 测试与质量

### 当前状态

- **无测试覆盖**
- 建议添加单元测试

### 测试建议

1. **UIManager 测试**
   - 测试消息队列机制
   - 测试批量更新逻辑
   - 测试防抖功能

2. **UICreator 测试**
   - 测试元素创建
   - 测试元素结构

3. **ButtonAnimator 测试**
   - 测试动画类添加和移除
   - 测试动画时序

---

## 常见问题 (FAQ)

### Q1: 如何自定义按钮样式？

**方法**：修改 `styles/` 目录下的 SCSS 文件

```scss
// styles/_variables.scss
$button-bg: #ff0081;
$button-text: #fff;
```

### Q2: 如何调整消息队列的刷新间隔？

**方法**：修改 `UIManager.addMessage` 中的延迟时间

```typescript
// 当前：100ms
this.updateTimer = window.setTimeout(() => {
  this.flushMessages()
}, 100)

// 修改为：200ms
this.updateTimer = window.setTimeout(() => {
  this.flushMessages()
}, 200)
```

### Q3: 如何禁用按钮动画？

**方法**：注释掉动画调用

```typescript
button.addEventListener('click', (e) => {
  // ButtonAnimator.animate(e) // 注释掉
  // ... 其他逻辑
})
```

---

## 相关文件清单

- `ui/index.ts` - 统一导出（11 行）
- `ui/components.ts` - 组件实现（214 行）

**总计**：225 行代码

---

## 变更记录

### 2026-01-15

- 初始化 ui 模块文档
- 完成组件接口文档
