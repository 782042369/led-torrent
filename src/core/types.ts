/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 16:02:41
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:58:00
 * @Description: 核心类型定义 - 统一管理所有类型定义
 */

/** 种子数据ID类型定义 */
export type TorrentDataIdsType = string[]

/** 用户做种列表 */
export interface TorrentList {
  data?: {
    id: string
  }[]
  meta?: {
    to: number
    total: number
  }
}

/** 领取种子结果详情 */
export interface LedTorrentDetails {
  msg: string | 'OK'
  ret: -1 | 0
}

/**
 * HTTP 请求选项
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  params?: Record<string, any>
}
