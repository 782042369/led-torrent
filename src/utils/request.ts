/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 16:11:59
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-01-20 20:49:26
 * @Description: HTTP请求封装 - 重构版
 */

import { ApiError, NetworkError } from './errors'

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: FormData | string
  timeout?: number
  params?: Record<string, any>
}

interface RequestInterceptor {
  (config: RequestConfig): RequestConfig
}

interface ResponseInterceptor {
  (response: Response): Response
}

class HttpClient {
  private timeout: number
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  constructor(timeout = 30000) {
    this.timeout = timeout
  }

  // 添加请求拦截器
  useRequest(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  // 添加响应拦截器
  useResponse(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  // 构建URL
  private buildURL(url: string, params?: Record<string, any>): string {
    if (!params)
      return url

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const queryString = searchParams.toString()
    if (!queryString)
      return url

    return url + (url.includes('?') ? '&' : '?') + queryString
  }

  // 超时控制
  private async fetchWithTimeout(
    input: RequestInfo,
    init?: RequestInit,
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    }
    catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError(
          'Request timeout',
          '请求超时，请检查网络连接后重试',
          error,
        )
      }
      throw error
    }
  }

  // 核心请求方法
  async request<T>(
    url: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout,
      params,
    } = config

    // 应用请求拦截器
    const finalConfig: RequestConfig = {
      method,
      headers,
      body,
      timeout,
      params,
    }
    const appliedConfig = this.requestInterceptors.reduce(
      (acc, interceptor) => interceptor(acc),
      finalConfig,
    )

    try {
      // 构建完整URL
      const fullURL = method === 'GET'
        ? this.buildURL(url, appliedConfig.params)
        : url

      // 发起请求
      const response = await this.fetchWithTimeout(fullURL, {
        method: appliedConfig.method,
        headers: appliedConfig.headers,
        body: appliedConfig.body,
      })

      // 应用响应拦截器
      const interceptedResponse = this.responseInterceptors.reduce(
        (acc, interceptor) => interceptor(acc),
        response,
      )

      // 处理特殊响应
      if (url.includes('viewclaims.php')) {
        try {
          await interceptedResponse.json()
          return true as T
        }
        catch {
          return false as T
        }
      }

      // 错误状态码处理
      if (url.includes('user-seeding-torrent')) {
        if (
          interceptedResponse.status === 500
          || interceptedResponse.status === 404
          || interceptedResponse.status === 403
          || interceptedResponse.url.includes('/login')
        ) {
          throw new ApiError(
            `API Error: ${interceptedResponse.status}`,
            '登录失效或无权限访问，请重新登录',
            interceptedResponse.status,
          )
        }
      }

      // 返回文本或JSON
      if (
        url.includes('getusertorrentlistajax')
        || url.includes('claim.php')
        || url.includes('getusertorrentlist.php')
      ) {
        return (await interceptedResponse.text()) as T
      }

      return await interceptedResponse.json()
    }
    catch (error) {
      // 网络错误
      if (error instanceof NetworkError) {
        throw error
      }

      // API错误
      if (error instanceof ApiError) {
        throw error
      }

      // 其他错误包装为NetworkError
      throw new NetworkError(
        `Fetch error: ${error}`,
        '网络请求失败，请检查网络连接',
        error,
      )
    }
  }
}

// 导出单例
export const httpClient = new HttpClient()

// 导出便捷方法
export function request<T>(url: string, config?: RequestConfig): Promise<T> {
  return httpClient.request<T>(url, config)
}

// 默认导出，保持向后兼容
export default request
