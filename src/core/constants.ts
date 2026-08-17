/*
 * @Author: yanghongxuan
 * @Date: 2026-08-17 04:00:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-08-17 04:00:00
 * @Description: API 路径常量 - 统一收口，别到处写魔法字符串
 */

/**
 * 各站点 API 路径
 */
export const API_PATHS = {
  /** 通用站点 AJAX 操作接口（领种/弃种） */
  AJAX: '/ajax.php',
  /** 通用站点做种列表 */
  USER_TORRENT_LIST_AJAX: 'getusertorrentlistajax.php',
  /** 通用站点领取记录 */
  CLAIM_HISTORY: 'claim.php',
  /** 猫站做种列表 */
  PTER_USER_TORRENT_LIST: 'getusertorrentlist.php',
  /** 春天站领种接口 */
  SSD_ADOPT: '/adopt.php',
} as const

/**
 * 返回 HTML 文本（非 JSON）的接口路径列表
 * 请求层据此走 text() 解析而不是 json()
 */
export const TEXT_RESPONSE_APIS: readonly string[] = [
  API_PATHS.USER_TORRENT_LIST_AJAX,
  API_PATHS.CLAIM_HISTORY,
  API_PATHS.PTER_USER_TORRENT_LIST,
]
