/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 16:02:41
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 18:57:50
 * @Description: PT API 类型定义
 */

export namespace PTAPI {
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
}
