/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 15:56:38
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:45:00
 * @Description: DOM 工具函数 - 纯函数，无状态
 */

/**
 * 检查是否有下一页
 *
 * @param doc - DOM 文档对象
 * @param nextPageLinkSelector - 下一页链接选择器
 * @returns 是否存在下一页
 */
export function checkForNextPage(
  doc: Document,
  nextPageLinkSelector: string,
): boolean {
  return Boolean(doc.querySelector(nextPageLinkSelector))
}
