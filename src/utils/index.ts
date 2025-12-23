/*
 * @Author: yanghongxuan
 * @Date: 2024-12-23 12:50:14
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-12-23 12:50:14
 * @Description: 工具函数入口文件
 */

// 导出通用工具函数
export * from './common'

// 导出站点处理函数
export * from './common/site'
export * from './sites/pter'
export * from './sites/springsunday'

export function getvl(name: string) {
  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result[name] ?? ''
}
/** 检查是否有下一页 */
export function checkForNextPage(
  doc: Document,
  nextPageLinkSelector: string,
): boolean {
  return Boolean(doc.querySelector(nextPageLinkSelector))
}
/** 按钮动画效果 */
export function animateButton(e: MouseEvent) {
  e.preventDefault()
  if (e.target && e.target instanceof Element) {
    const target = e.target
    target.classList.remove('animate')
    target.classList.add('animate')
    setTimeout(() => {
      target.classList.remove('animate')
    }, 700)
  }
}
/** 提示信息拼接 */
export function getLedMsg(msglist: Record<string, number>) {
  let msgLi = ''
  Object.keys(msglist).forEach((e) => {
    msgLi += `<li>${e}: ${msglist[e]}</li>`
  })
  return msgLi
}
