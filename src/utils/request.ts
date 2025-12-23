/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 16:11:59
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-01-20 20:49:26
 * @Description:
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  params?: Record<string, any>
}

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
 * 发起HTTP请求
 *
 * @template T - 响应数据的类型
 * @param url - 请求的URL
 * @param options - 请求选项
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
    if (url.includes('viewclaims.php')) {
      try {
        await response.json()
        return Promise.resolve(true as T)
      }
      catch {
        return Promise.resolve(false as T)
      }
    }
    // 尝试请求用户领取种子接口时，如果登录失效 500 404 403 或者重定向到 login 时，直接返回错误
    if (
      url.includes('user-seeding-torrent')
      && (response.status === 500
        || response.status === 404
        || response.status === 403
        || response.url.includes('/login'))
    ) {
      return Promise.reject(response)
    }
    if (
      url.includes('getusertorrentlistajax')
      || url.includes('claim.php')
      || url.includes('getusertorrentlist.php')
    ) {
      return (await response.text()) as T
    }
    return await response.json()
  }
  catch (error: any) {
    console.error('Fetch error: ', error)
    return error
  }
}
export default request
