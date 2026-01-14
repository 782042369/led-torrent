/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 16:11:59
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:45:00
 * @Description: HTTP 请求封装 - 提供统一的请求接口，支持超时控制
 */

import type { RequestOptions } from './types'

/**
 * 带超时的 fetch 请求
 * 防止请求卡死，超过指定时间自动取消
 *
 * @param input - 请求 URL 或 Request 对象
 * @param init - 请求初始化配置
 * @param timeout - 超时时间（毫秒），默认 100 秒
 * @returns Promise<Response> - 响应对象
 */
async function fetchWithTimeout(
  input: RequestInfo,
  init?: RequestInit,
  timeout = 100000,
): Promise<Response> {
  return Promise.race([
    fetch(input, init),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request Timeout')), timeout),
    ),
  ])
}

/**
 * 构建带查询参数的完整 URL
 *
 * @param url - 基础 URL
 * @param params - 查询参数对象
 * @returns 完整 URL 字符串
 */
function buildURL(url: string, params?: Record<string, any>): string {
  let fullUrl = url

  // 添加查询参数
  if (params) {
    const searchParams = new URLSearchParams()
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, params[key])
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString
    }
  }

  return fullUrl
}

/**
 * 发起 HTTP 请求
 * 统一的请求方法，支持 GET/POST、超时控制、参数构建
 *
 * @template T - 响应数据的类型
 * @param url - 请求的 URL
 * @param options - 请求选项
 * @returns Promise<T> - 响应数据
 */
async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', headers = {}, body, timeout, params } = options

  try {
    const response = await fetchWithTimeout(
      method === 'GET' ? buildURL(url, params) : url,
      {
        method,
        headers,
        body,
      },
      timeout,
    )

    // 特殊处理：viewclaims.php 接口
    if (url.includes('viewclaims.php')) {
      try {
        await response.json()
        return Promise.resolve(true as T)
      }
      catch {
        return Promise.resolve(false as T)
      }
    }

    // 特殊处理：user-seeding-torrent 接口错误检测
    // 如果登录失效（500/404/403）或重定向到登录页，直接返回错误
    if (
      url.includes('user-seeding-torrent')
      && (response.status === 500
        || response.status === 404
        || response.status === 403
        || response.url.includes('/login'))
    ) {
      return Promise.reject(response)
    }

    // 特殊处理：返回文本格式的接口
    if (
      url.includes('getusertorrentlistajax')
      || url.includes('claim.php')
      || url.includes('getusertorrentlist.php')
    ) {
      return (await response.text()) as T
    }

    // 默认返回 JSON
    return await response.json()
  }
  catch (error: any) {
    console.error('Fetch error: ', error)
    return error
  }
}

export default request
