/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:15:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-04-02 16:18:38
 * @Description: API 接口定义 - 包含各个PT站点的API接口
 */

import type { LedTorrentDetails } from '@/types'

import {
  API_PARAM_VALUES,
  API_PARAMS,
  API_PATHS,
} from './constants'
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
    body.append(API_PARAMS.ACTION, API_PARAM_VALUES.CLAIM)
    body.append(API_PARAMS.TORRENT_ID_PARAM, `${id}`)
  }
  else {
    body.append(API_PARAMS.ACTION, API_PARAM_VALUES.REMOVE_CLAIM)
    body.append(API_PARAMS.ID_PARAM, `${id}`)
  }
  return request<LedTorrentDetails>(API_PATHS.AJAX, {
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
    API_PATHS.USER_TORRENT_LIST_AJAX,
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
  return request<string>(API_PATHS.CLAIM_HISTORY, {
    method: 'GET',
    params,
  })
}
/**
 * 获取Pter站点用户种子列表
 *
 * @param params - 请求参数对象
 * @param params.do_ajax - 默认参数，固定为1
 * @param params.userid - 用户ID
 * @param params.type - 类型，固定为'seeding'
 * @returns 返回Pter站点用户种子列表的字符串响应
 */
export async function getNPHPPterUsertorrentlistajax(
  params: {
    do_ajax: 1
    userid: string
    type: 'seeding'
  },
) {
  return request<string>(
    API_PATHS.USER_TORRENT_LIST,
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
  body.append(API_PARAMS.ACTION, API_PARAM_VALUES.SSD_CLAIM)
  body.append(API_PARAMS.ID, `${id}`)
  return request<LedTorrentDetails>(API_PATHS.SSD_ADOPT, {
    method: 'POST',
    body,
  })
}
