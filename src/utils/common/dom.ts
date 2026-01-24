/**
 * DOM 工具函数模块
 *
 * 注意：本模块中的 hasNextPage 函数将替换 index.ts 中的 checkForNextPage 函数
 * 该替换将在代码优化清理阶段（Task 17）完成
 */

/**
 * 从URL查询参数中获取指定参数值
 * @param name 参数名
 * @returns 参数值，不存在时返回空字符串
 */
export function getUrlParam(name: string): string {
  const params = new URLSearchParams(window.location.search)
  return params.get(name) ?? ''
}

/**
 * 检查文档中是否存在下一页链接
 * @param doc 文档对象
 * @param selector 下一页链接选择器
 * @returns 是否存在下一页
 */
export function hasNextPage(
  doc: Document,
  selector: string,
): boolean {
  return Boolean(doc.querySelector(selector))
}

/**
 * 解析HTML字符串为文档对象
 * @param html HTML字符串
 * @returns 文档对象
 */
export function parseHTML(html: string): Document {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}

/**
 * 批量查询选择器
 * @param doc 文档对象
 * @param selector CSS选择器
 * @returns 元素数组
 */
export function querySelectorAll(
  doc: Document | Element,
  selector: string,
): Element[] {
  return Array.from(doc.querySelectorAll(selector))
}
