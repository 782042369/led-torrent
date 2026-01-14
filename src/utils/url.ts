/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 15:56:38
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:45:00
 * @Description: URL 工具函数
 */

/**
 * 解析 URL 参数
 *
 * @param name - 参数名称
 * @returns 参数值，如果不存在则返回空字符串
 */
export function getvl(name: string) {
  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result[name] ?? ''
}
