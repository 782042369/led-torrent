/*
 * @Author: yanghongxuan
 * @Date: 2026-01-14 23:50:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:50:00
 * @Description: 路由配置 - 定义各个 PT 站点的路由规则
 */

import type { TorrentDataIdsType } from '@/core/types'

/**
 * 路由动作类型
 */
export type RouteAction = 'claim' | 'abandon' | 'claimPter' | 'claimSpring'

/**
 * 路由配置接口
 */
export interface RouteConfig {
  /** 路由名称 */
  name: string
  /** URL 匹配模式 */
  pattern: string | string[]
  /** 按钮文本 */
  buttonText: string
  /** 初始消息 */
  initMessage?: string
  /** 动作类型 */
  action: RouteAction
  /** 用户 ID 参数名 */
  userIdParam: 'id' | 'uid' | 'userid'
}

/**
 * 路由配置列表
 * 按优先级排序（越靠前优先级越高）
 */
export const ROUTES: RouteConfig[] = [
  {
    name: '猫站领种',
    pattern: 'pterclub.com/getusertorrentlist.php',
    buttonText: '一键认领',
    action: 'claimPter',
    userIdParam: 'userid',
  },
  {
    name: '春天站领种',
    pattern: 'springsunday.net/userdetails.php',
    buttonText: '一键认领',
    action: 'claimSpring',
    userIdParam: 'id',
  },
  {
    name: '通用站点领种',
    pattern: 'userdetails.php',
    buttonText: '一键认领',
    action: 'claim',
    userIdParam: 'id',
  },
  {
    name: '通用站点弃种',
    pattern: 'claim.php',
    buttonText: '一键弃种',
    initMessage: '<li>放弃本人没在做种的种子</li>',
    action: 'abandon',
    userIdParam: 'uid',
  },
]

/**
 * 路由处理器接口
 */
export interface RouteHandler {
  /** 加载用户种子数据 */
  loadUserTorrents: (
    userid: string,
    allData: TorrentDataIdsType,
    ledlist: string[]
  ) => Promise<void>
  /** 执行领种/弃种操作 */
  handleLedTorrent: (
    arr: TorrentDataIdsType,
    button: HTMLButtonElement,
    json: { [key in string]: number }
  ) => Promise<void>
  /** 加载历史领种数据（可选，用于弃种功能） */
  loadUserTorrentsHistory?: (
    uid: string,
    allData: TorrentDataIdsType,
    ledlist: string[]
  ) => Promise<void>
}
