/*
 * @Author: yanghongxuan
 * @Date: 2024-04-02 16:26:37
 * @Description:
 * @LastEditTime: 2024-04-02 17:09:57
 * @LastEditors: yanghongxuan
 */
import type { TorrentDataIdsType } from '@/types'

import { checkForNextPage } from '.'
import { getNPHPLedTorrent, getNPHPUsertorrentHistory } from './api'

/** 认领、放弃种子 */
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

/** 查找历史领种数据 */
export async function loadSchTorrentsHistory(
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
          && (innerText1.includes('弃') || innerText1.includes('棄'))
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
