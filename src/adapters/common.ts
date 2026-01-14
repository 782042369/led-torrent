/*
 * @Author: yanghongxuan
 * @Date: 2024-12-23 12:50:14
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:45:00
 * @Description: 通用站点适配器（Nexus PHP 标准 PT 站点）
 */

import type { TorrentDataIdsType } from '@/core/types'

import { getNPHPLedTorrent, getNPHPUsertorrentHistory, getNPHPUsertorrentlistajax } from '@/core/api'
import { checkForNextPage } from '@/utils'

/**
 * 认领、放弃种子（通用站点）
 *
 * @param arr - 种子 ID 数组
 * @param button - 操作按钮元素
 * @param json - 统计对象
 * @param type - 操作类型：'removeClaim' 弃种 / 'addClaim' 领种
 */
export async function handleLedTorrent(
  arr: TorrentDataIdsType,
  button: HTMLButtonElement,
  json: { [key in string]: number },
  type: 'removeClaim' | 'addClaim',
) {
  for (let i = 0; i < arr.length; i++) {
    button.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`
    try {
      const data = await getNPHPLedTorrent(arr[i], type)
      const msg = data.msg || '领种接口返回信息错误'
      json[msg] = (json[msg] || 0) + 1
    }
    catch (error) {
      console.error('handleLedTorrent error: ', error)
    }
  }
}

/**
 * 查找历史做种且领种数据（通用站点）
 *
 * @param userid - 用户 ID
 * @param allData - 可认领种子数组（输出）
 * @param ledlist - 已认领种子数组（输出）
 */
export async function loadUserTorrents(
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
    const tdList = doc.querySelectorAll('td')
    tdList.forEach((v) => {
      const buttons = v.querySelectorAll('button')
      if (buttons.length > 0) {
        const {
          textContent: innerText0,
          style: { display: display0 },
        } = buttons[0]
        const torrent_id = buttons[0].getAttribute('data-torrent_id')!
        const {
          textContent: innerText1,
          style: { display: display1 },
        } = buttons[1]
        // 需要认领的种子
        if (
          (innerText0?.includes('领') || innerText0?.includes('領'))
          && display1 === 'none'
          && torrent_id
          && !allData.includes(torrent_id)
        ) {
          allData.push(torrent_id)
        }
        if (
          display0 === 'none'
          && (innerText1?.includes('弃') || innerText1?.includes('棄'))
          && !ledlist.includes(torrent_id)
        ) {
          ledlist.push(torrent_id)
        }
      }
    })
    page++
    // 在传入的文档中查找下一页链接
    hasMore = checkForNextPage(
      doc,
      `a[href*="getusertorrentlistajax.php?page=${page}"]`,
    )
  } while (hasMore)
}

/**
 * 查找历史领种数据（通用站点 - 用于弃种功能）
 *
 * @param uid - 用户 ID
 * @param allData - 可弃种数组（输出）
 * @param ledlist - 已认领种子数组（输出）
 */
export async function loadUserTorrentsHistory(
  uid: string,
  allData: TorrentDataIdsType,
  ledlist: string[],
) {
  let page = 0
  let hasMore = true
  do {
    const details = await getNPHPUsertorrentHistory({
      page,
      uid,
    })
    const parser = new DOMParser()
    const doc = parser.parseFromString(details, 'text/html')
    const tdList = doc.querySelectorAll('#claim-table td')
    tdList.forEach((v) => {
      const buttons = v.querySelectorAll('button')
      if (buttons.length > 0) {
        const {
          style: { display: display0 },
        } = buttons[0]
        // 种子ID
        const torrent_id = buttons[1].getAttribute('data-torrent_id')!
        // 放弃领种ID
        const claim_id = buttons[1].getAttribute('data-claim_id')!

        const { textContent: innerText1 } = buttons[1]
        // 已经认领的种子 但是目前没有在做种的数据 代表可能删除了 所以 可以让用户判断是否删除该领种
        if (
          display0 === 'none'
          && (innerText1?.includes('弃') || innerText1?.includes('棄'))
          && !ledlist.includes(torrent_id)
          && !allData.includes(claim_id)
        ) {
          allData.push(claim_id)
        }
      }
    })
    page++
    // 在传入的文档中查找下一页链接
    hasMore = checkForNextPage(doc, `a[href*="?uid=${uid}&page=${page}"]`)
  } while (hasMore)
}
