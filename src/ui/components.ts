/*
 * @Author: yanghongxuan
 * @Date: 2026-01-14 23:05:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:45:00
 * @Description: UI 组件 - 管理操作面板的 UI 更新，减少频繁 DOM 操作
 */

/**
 * UI 管理器
 * 管理操作面板的 UI 更新，减少频繁 DOM 操作
 */
export class UIManager {
  private button: HTMLButtonElement
  private messageList: HTMLUListElement
  private messageCache: string[] = []
  private updateTimer: number | null = null

  constructor(button: HTMLButtonElement, messageList: HTMLUListElement) {
    this.button = button
    this.messageList = messageList
  }

  /**
   * 更新按钮文本
   *
   * @param text - 按钮文本
   */
  updateButton(text: string): void {
    this.button.textContent = text
  }

  /**
   * 更新进度显示
   *
   * @param current - 当前进度
   * @param total - 总数
   */
  updateProgress(current: number, total: number): void {
    this.button.textContent = `努力再努力 ${total} / ${current}`
  }

  /**
   * 添加消息到队列（批量更新，减少 DOM 操作）
   *
   * @param message - 消息内容
   */
  addMessage(message: string): void {
    this.messageCache.push(message)

    // 防抖，100ms 后批量更新
    if (this.updateTimer !== null) {
      clearTimeout(this.updateTimer)
    }

    this.updateTimer = window.setTimeout(() => {
      this.flushMessages()
    }, 100)
  }

  /**
   * 批量更新消息列表
   */
  private flushMessages(): void {
    if (this.messageCache.length === 0)
      return

    const fragment = document.createDocumentFragment()

    this.messageCache.forEach((message) => {
      const li = document.createElement('li')
      li.textContent = message
      fragment.appendChild(li)
    })

    this.messageList.appendChild(fragment)
    this.messageCache = []
  }

  /**
   * 立即刷新所有缓存的消息
   */
  flush(): void {
    if (this.updateTimer !== null) {
      clearTimeout(this.updateTimer)
      this.updateTimer = null
    }
    this.flushMessages()
  }

  /**
   * 清空消息列表
   */
  clearMessages(): void {
    this.messageList.innerHTML = ''
    this.messageCache = []
  }

  /**
   * 批量显示统计结果
   *
   * @param stats - 统计对象 { key: count }
   */
  showStats(stats: Record<string, number>): void {
    this.clearMessages()

    Object.entries(stats).forEach(([key, value]) => {
      this.addMessage(`${key}: ${value}`)
    })

    this.flush()
  }

  /**
   * 设置按钮禁用状态
   *
   * @param disabled - 是否禁用
   */
  setDisabled(disabled: boolean): void {
    this.button.disabled = disabled
  }

  /**
   * 获取按钮元素
   *
   * @returns 按钮元素
   */
  getButton(): HTMLButtonElement {
    return this.button
  }

  /**
   * 获取消息列表元素
   *
   * @returns 消息列表元素
   */
  getMessageList(): HTMLUListElement {
    return this.messageList
  }
}

/**
 * UI 元素创建器
 * 快速创建标准 UI 元素
 */
export class UICreator {
  /**
   * 创建操作面板
   *
   * @returns 包含容器、按钮和消息列表的对象
   */
  static createPanel(): {
    container: HTMLDivElement
    button: HTMLButtonElement
    messageList: HTMLUListElement
  } {
    const container = document.createElement('div')
    container.className = 'led-box'

    const button = document.createElement('button')
    button.className = 'bubbly-button'

    const messageList = document.createElement('ul')

    container.appendChild(button)
    container.appendChild(messageList)

    return { container, button, messageList }
  }

  /**
   * 创建带文本的消息项
   *
   * @param text - 消息文本
   * @returns HTMLLIElement
   */
  static createMessageItem(text: string): HTMLLIElement {
    const li = document.createElement('li')
    li.textContent = text
    return li
  }
}

/**
 * 按钮动画控制器
 * 管理按钮的气泡动画效果
 */
export class ButtonAnimator {
  /**
   * 触发按钮动画
   *
   * @param event - 鼠标事件
   */
  static animate(event: MouseEvent): void {
    if (event.target && event.target instanceof Element) {
      const target = event.target

      // 移除动画类（如果存在）
      target.classList.remove('animate')

      // 强制重绘
      void target.offsetWidth

      // 添加动画类
      target.classList.add('animate')

      // 动画结束后移除类
      setTimeout(() => {
        target.classList.remove('animate')
      }, 750)
    }
  }
}
