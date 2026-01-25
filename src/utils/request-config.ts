/*
 * @Description: HTTP 请求配置 - 配置拦截器和请求头
 */

import { httpClient } from './request'

/**
 * 配置 HTTP 请求拦截器
 */
export function setupRequestInterceptors(): void {
  // 请求拦截器 - 添加必要的请求头
  httpClient.useRequest((config) => {
    // 获取当前页面URL作为Referer
    const referer = window.location.href

    return {
      ...config,
      headers: {
        ...config.headers,
        // 关键：告诉服务器这是AJAX请求
        'X-Requested-With': 'XMLHttpRequest',
        // 设置Referer，避免403错误
        'Referer': referer,
        // 设置来源
        'Origin': window.location.origin,
      },
    }
  })
}
