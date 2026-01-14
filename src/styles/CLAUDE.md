[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **styles**

---

# styles 模块

## 模块职责

`styles/` 模块负责 LED Torrent 项目的所有样式定义。该模块使用 SCSS 预处理器，实现了具有动画效果的按钮样式和状态显示区域样式，为用户提供友好的视觉反馈。

---

## 目录结构

```
styles/
└── led-torrent.scss       # 主样式文件（212 行）
```

---

## 样式详解

### 1. 容器样式 (`.led-box`)

**作用**：固定定位的操作面板容器

**样式特性**：
```scss
.led-box {
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 9999;              // 确保在最上层
  display: flex;
  flex-direction: column;     // 垂直排列
  align-items: flex-start;
  justify-content: center;
}
```

**设计说明**：
- 固定在页面左上角，不随滚动移动
- `z-index: 9999` 确保不会被其他元素覆盖
- 使用 Flexbox 垂直布局按钮和消息列表

---

### 2. 消息列表样式

#### `.led-box ul`

```scss
ul {
  margin-left: 0;
  padding-left: 0;
}
```

#### `.led-box li`

**作用**：单条消息的样式

**样式特性**：
```scss
li {
  color: #fff;
  background-color: #ff0081;
  padding: 8px 10px;
  list-style: none;
  line-height: 20px;
  font-size: 14px;
  margin-left: 0;
}
```

**视觉效果**：
- 粉红色背景（`#ff0081`）
- 白色文字
- 圆角列表项
- 适合显示操作进度和结果

---

### 3. 按钮样式 (`.bubbly-button`)

#### 基础样式

```scss
.bubbly-button {
  font-family: 'Helvetica', 'Arial', sans-serif;
  display: inline-block;
  font-size: 20px;
  padding: 8px 10px;
  appearance: none;
  background-color: #ff0081;
  color: #fff;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5);
}
```

**视觉效果**：
- 鲜艳的粉红色背景
- 柔和的阴影效果
- 平滑的过渡动画
- 鼠标悬停时有交互反馈

#### 悬停状态

```scss
&:hover {
  background-color: #ff0081;
}
```

#### 点击状态

```scss
&:active {
  transform: scale(0.9);
  background-color: #e60074;
  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);
}
```

**动画效果**：
- 按钮缩小至 90%
- 背景色变深
- 阴影变淡

---

### 4. 气泡动画

#### 伪元素准备

```scss
.bubbly-button:before,
.bubbly-button:after {
  position: absolute;
  content: '';
  display: block;
  width: 140%;
  height: 100%;
  left: -20%;
  z-index: -1000;
  transition: all ease-in-out 0.5s;
  background-repeat: no-repeat;
}
```

**设计原理**：
- 使用 `::before` 和 `::after` 伪元素
- 通过 `radial-gradient` 创建多个圆形气泡
- 通过 `background-position` 控制气泡位置

#### 顶部气泡 (`:before`)

```scss
.bubbly-button:before {
  display: none;
  top: -75%;
  background-image:
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, transparent 20%, #ff0081 20%, transparent 30%),
    // ... 共 8 个径向渐变
  background-size:
    10% 10%,
    20% 20%,
    15% 15%,
    // ... 对应 8 个尺寸
}
```

#### 底部气泡 (`:after`)

```scss
.bubbly-button:after {
  display: none;
  bottom: -75%;
  background-image:
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    // ... 共 7 个径向渐变
}
```

---

### 5. 动画关键帧

#### `topBubbles` 动画

**持续时间**：0.75 秒
**效果**：顶部气泡向上移动并逐渐消失

```scss
@keyframes topBubbles {
  0% {
    background-position:
      5% 90%,
      10% 90%,
      10% 90%,
      // ... 9 个位置
  }
  50% {
    background-position:
      0% 80%,
      0% 20%,
      10% 40%,
      // ... 移动到新位置
  }
  100% {
    background-position:
      0% 70%,
      0% 10%,
      10% 30%,
      // ... 最终位置
    background-size:
      0% 0%,
      0% 0%,
      // ... 缩小至 0
  }
}
```

#### `bottomBubbles` 动画

**持续时间**：0.75 秒
**效果**：底部气泡向下移动并逐渐消失

---

### 6. 动画触发

```scss
.bubbly-button.animate:before {
  display: block;
  animation: topBubbles ease-in-out 0.75s forwards;
}

.bubbly-button.animate:after {
  display: block;
  animation: bottomBubbles ease-in-out 0.75s forwards;
}
```

**触发方式**（JavaScript）：
```typescript
export function animateButton(e: MouseEvent) {
  if (e.target && e.target instanceof Element) {
    const target = e.target
    target.classList.remove('animate')
    target.classList.add('animate')
    setTimeout(() => {
      target.classList.remove('animate')
    }, 700)
  }
}
```

---

## 关键依赖与配置

### 依赖

- **SCSS 预处理器** - 支持嵌套和变量
- **无外部 CSS 框架** - 纯自定义样式

### 构建配置

**Vite 配置**：
- SCSS 自动编译为 CSS
- 通过 `vite-plugin-monkey` 注入到用户脚本

---

## 样式使用示例

### 示例 1：创建操作面板

```typescript
// main.ts
const div = document.createElement('div')
div.className = 'led-box'

const button = document.createElement('button')
button.className = 'bubbly-button'
button.textContent = '一键认领'

const ulbox = document.createElement('ul')

div.appendChild(button)
div.appendChild(ulbox)
document.body.appendChild(div)
```

### 示例 2：添加消息项

```typescript
// 添加操作结果消息
const li = document.createElement('li')
li.textContent = '领取成功: 10'
ulbox.appendChild(li)
```

### 示例 3：触发按钮动画

```typescript
button.addEventListener('click', (e) => {
  animateButton(e)  // 添加 .animate 类
  // 0.75 秒后自动移除 .animate 类
})
```

---

## 样式定制指南

### 修改主题色

**当前主色**：`#ff0081` (粉红色)

**修改位置**：
```scss
// 全局替换颜色变量
background-color: #your-color;
box-shadow: 0 2px 25px rgba(your-r, your-g, your-b, 0.5);
```

### 调整容器位置

**当前位置**：`top: 80px; left: 20px`

**修改示例**：
```scss
.led-box {
  top: 100px;      // 距离顶部更远
  left: 50%;       // 水平居中
  transform: translateX(-50%);
}
```

### 调整按钮尺寸

**当前尺寸**：`font-size: 20px; padding: 8px 10px`

**修改示例**：
```scss
.bubbly-button {
  font-size: 16px;   // 更小的字体
  padding: 6px 12px; // 调整内边距
}
```

---

## 浏览器兼容性

### 支持的特性

- ✅ `position: fixed`
- ✅ `flexbox`
- ✅ `transition`
- ✅ `animation`
- ✅ `radial-gradient`
- ✅ `::before` / `::after` 伪元素

### 前缀要求

现代浏览器无需前缀，自动处理。

---

## 性能考虑

### 动画性能

**优化点**：
1. 使用 `transform` 和 `opacity` 进行动画（GPU 加速）
2. 避免动画 `width` / `height`（触发重排）
3. 动画结束后及时清理 `.animate` 类

**当前实现**：
```typescript
setTimeout(() => {
  target.classList.remove('animate')
}, 700)  // 略小于动画时间（750ms）
```

---

## 常见问题 (FAQ)

### Q1: 如何禁用按钮动画？

**方法 1**：移除 `.animate` 类触发
```typescript
// 注释掉动画调用
// animateButton(e)
```

**方法 2**：修改样式
```scss
.bubbly-button.animate:before,
.bubbly-button.animate:after {
  display: none !important;
}
```

### Q2: 消息列表过长怎么办？

**方法**：限制高度并添加滚动
```scss
.led-box ul {
  max-height: 300px;
  overflow-y: auto;
}
```

### Q3: 如何适配移动端？

**响应式修改**：
```scss
@media (max-width: 768px) {
  .led-box {
    top: auto;
    bottom: 20px;
    left: 10px;
    right: 10px;
  }

  .bubbly-button {
    width: 100%;
  }
}
```

---

## 相关文件清单

### 样式文件

- `styles/led-torrent.scss` - 212 行

**代码结构**：
- 容器样式：11 行
- 列表样式：27 行
- 按钮基础样式：54 行
- 气泡渐变定义：77 行
- 动画关键帧：88 行
- 其他：5 行

---

## 设计灵感

该按钮样式参考了 "Bubbly Button" 设计：
- 创意的气泡动画效果
- 平滑的过渡动画
- 吸引用户注意的视觉效果

---

## 变更记录

### 2026-01-14
- 初始化 styles 模块文档
- 完成样式详解与定制指南
- 补充动画原理说明
