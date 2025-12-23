/*
 * @Author: yanghongxuan
 * @Date: 2024-12-23 12:50:14
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-12-23 12:50:14
 * @Description: Pter 站点相关功能
 */

import type { TorrentDataIdsType } from '@/types'

import { getNPHPPterLedTorrent, getNPHPPterUsertorrentlistajax } from '../api'
import { checkForNextPage } from '../common'

/**
 * 加载Pter站点用户做种数据，获取可以认领和已认领的种子列表
 *
 * @param userid - 用户ID
 * @param allData - 用于存储可以认领的种子ID数组
 * @param ledlist - 用于存储已认领的种子ID数组
 */
export async function loadPterUserTorrents(
  userid: string,
  allData: TorrentDataIdsType,
  ledlist: string[],
) {
  let page = 0
  let hasMore = true
  do {
    const details = await getNPHPPterUsertorrentlistajax({
      page,
      userid,
      type: 'seeding',
    })
    const parser = new DOMParser()
    const doc = parser.parseFromString(details, 'text/html')
    const claimDoms = doc.querySelectorAll('.claim-confirm')
    const removeDoms = doc.querySelectorAll('.remove-confirm')
    claimDoms.forEach((v) => {
      const id = v.getAttribute('data-url') || ''
      if (!allData.includes(id)) {
        allData.push(id)
      }
    })
    removeDoms.forEach((v) => {
      const id = v.getAttribute('data-url') || ''
      if (!ledlist.includes(id)) {
        ledlist.push(id)
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

/**
 * 执行Pter站点的领种操作
 *
 * @param arr - 包含种子ID的数组
 * @param button - 操作按钮元素，用于显示进度
 * @param json - 用于统计结果的消息对象
 */
export async function handleLedPterTorrent(
  arr: TorrentDataIdsType,
  button: HTMLButtonElement,
  json: { [key in string]: number },
) {
  for (let i = 0; i < arr.length; i++) {
    button.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`
    try {
      const data = await getNPHPPterLedTorrent(arr[i])
      const msg = data ? '领取成功' : '领取失败'
      json[msg] = (json[msg] || 0) + 1
    }
    catch (error) {
      console.error('handleLedPterTorrent error: ', error)
    }
  }
}
