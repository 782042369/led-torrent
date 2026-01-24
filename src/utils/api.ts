/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:15:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-04-02 16:18:38
 * @Description: API 接口定义 - 包含各个PT站点的API接口
 */

import type { PTAPI } from '@/types/api'

import request from './request'

/**
 * 执行认领或弃种操作
 *
 * @param id - 种子ID
 * @param type - 操作类型，'addClaim'为认领，'removeClaim'为弃种
 * @returns 请求的响应数据，包含认领结果详情
 */
export function getNPHPLedTorrent(
  id: string,
  type: 'removeClaim' | 'addClaim',
) {
  const body = new FormData()
  if (type === 'addClaim') {
    body.append('action', 'addClaim')
    body.append('params[torrent_id]', `${id}`)
  }
  else {
    body.append('action', 'removeClaim')
    body.append('params[id]', `${id}`)
  }
  return request<PTAPI.LedTorrentDetails>(`/ajax.php`, {
    method: 'POST',
    body,
  })
}

/**
 * 获取用户种子详情
 *
 * @param params - 请求参数对象
 * @param params.page - 页码
 * @param params.userid - 用户ID
 * @param params.type - 类型，固定为'seeding'
 * @returns 返回用户种子详情的字符串响应
 */
export async function getNPHPUsertorrentlistajax(
  params: {
    page: number
    userid: string
    type: 'seeding'
  },
) {
  return request<string>(
    'getusertorrentlistajax.php',
    {
      method: 'GET',
      params,
    },
  )
}

/**
 * 获取用户领取过的种子详情
 *
 * @param params - 请求参数对象
 * @param params.page - 页码
 * @param params.uid - 用户ID
 * @returns 返回用户领取过的种子详情的字符串响应
 */
export async function getNPHPUsertorrentHistory(
  params: {
    page: number
    uid: string
  },
) {
  return request<string>('claim.php', {
    method: 'GET',
    params,
  })
}
/**
 * 获取Pter站点用户种子列表
 *
 * @param params - 请求参数对象
 * @param params.page - 页码
 * @param params.userid - 用户ID
 * @param params.type - 类型，固定为'seeding'
 * @returns 返回Pter站点用户种子列表的字符串响应
 */
export async function getNPHPPterUsertorrentlistajax(
  params: {
    page: number
    userid: string
    type: 'seeding'
  },
) {
  return request<string>(
    'getusertorrentlist.php',
    {
      method: 'GET',
      params,
    },
  )
}
/**
 * Pter站点领取种子
 *
 * @param id - 种子ID
 * @returns 返回领取操作的结果布尔值
 */
export function getNPHPPterLedTorrent(
  id: string,
) {
  const body = new FormData()

  return request<boolean>(id, {
    method: 'POST',
    body,
  })
}

/**
 * Springsunday站点认领种子
 *
 * @param id - 种子ID
 * @returns 返回认领操作的结果详情
 */
export function getSSDLedTorrent(
  id: string,
) {
  const body = new FormData()
  body.append('action', 'add')
  body.append('id', `${id}`)
  return request<PTAPI.LedTorrentDetails>(`/adopt.php`, {
    method: 'POST',
    body,
  })
}
