/**
 * 按钮动画效果
 * @param event 鼠标事件
 */
export function animateButton(event: MouseEvent): void {
  event.preventDefault()

  const target = event.target as HTMLElement | null
  if (!target)
    return

  target.classList.remove('animate')
  void target.offsetWidth // 触发重绘
  target.classList.add('animate')

  setTimeout(() => {
    target.classList.remove('animate')
  }, 700)
}

/**
 * 生成消息列表HTML
 * @param messages 消息对象
 * @returns HTML字符串
 */
export function buildMessageList(messages: Record<string, number>): string {
  return Object.entries(messages)
    .map(([key, value]) => `<li>${key}: ${value}</li>`)
    .join('')
}

/**
 * 更新按钮文本和状态
 * @param button 按钮元素
 * @param text 按钮文本
 * @param disabled 是否禁用
 */
export function updateButton(
  button: HTMLButtonElement,
  text: string,
  disabled = false,
): void {
  button.textContent = text
  button.disabled = disabled
}

/**
 * 创建进度文本
 * @param total 总数
 * @param current 当前数
 * @returns 进度文本
 */
export function buildProgressText(total: number, current: number): string {
  return `努力再努力 ${total} / ${current}`
}
