/*
 * @Author: yanghongxuan
 * @Date: 2024-12-23 12:50:14
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-12-23 12:50:14
 * @Description: Springsunday 站点相关功能
 */

import type { TorrentDataIdsType } from '@/types'

import { getNPHPUsertorrentlistajax, getSSDLedTorrent } from '../api'
import { checkForNextPage } from '../common'

/** 查找春天站历史做种且领种数据 */
export async function loadSpringsundayUserTorrents(
  userid: string,
  allData: TorrentDataIdsType,
  ledlist: string[],
) {
  let page = 0
  let hasMore = true
  do {
    const details = await getNPHPUsertorrentlistajax({
      page,
      userid,
      type: 'seeding',
    })
    const parser = new DOMParser()
    const doc = parser.parseFromString(details, 'text/html')
    const claimDoms = doc.querySelectorAll('.btn')
    const removeDoms = doc.querySelectorAll('.nowrap')
    claimDoms.forEach((v) => {
      const id = v.getAttribute('id')?.replace('btn', '') || ''
      if (!allData.includes(id)) {
        allData.push(id)
      }
    })
    removeDoms.forEach((v) => {
      if (v.innerHTML === '已认领') {
        const id = v.getAttribute('id')?.replace('btn', '') || ''
        if (!ledlist.includes(id)) {
          ledlist.push(id)
        }
      }
    })
    page++
    // 在传入的文档中查找下一页链接
    hasMore = checkForNextPage(
      doc,
      `a[href*="?userid=${userid}&type=seeding&page=${page}"]`,
    )
  } while (hasMore)
}

// 春天站认领种子接口
export async function handleLedSpringsundayTorrent(
  arr: TorrentDataIdsType,
  button: HTMLButtonElement,
  json: { [key in string]: number },
) {
  for (let i = 0; i < arr.length; i++) {
    button.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`
    try {
      const data = await getSSDLedTorrent(arr[i])
      const msg = data ? '领取成功' : '领取失败'
      json[msg] = (json[msg] || 0) + 1
    }
    catch (error) {
      console.error('handleLedSpringsundayTorrent error: ', error)
    }
  }
}
