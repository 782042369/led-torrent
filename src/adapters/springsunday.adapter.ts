import type { ActionContext, ActionResult, LoadContext, TorrentData } from '@/types'

import { getNPHPUsertorrentlistajax, getSSDLedTorrent } from '@/utils/api'
import { hasNextPage, parseHTML } from '@/utils/common/dom'
import { ActionType, SiteType } from '@/utils/constants'

import { BaseAdapter } from './base.adapter'

/**
 * 春天站适配器
 */
export class SpringSundayAdapter extends BaseAdapter {
  readonly name = '春天站'
  readonly type = SiteType.SPRING_SUNDAY

  supports(url: string): boolean {
    return url.includes('springsunday.net/userdetails.php')
  }

  async loadUserTorrents(
    userId: string,
    context?: LoadContext,
  ): Promise<TorrentData> {
    const claimable: string[] = []
    const claimed: string[] = []
    let page = 0

    do {
      context?.onPageLoad?.(page)

      const html = await getNPHPUsertorrentlistajax({
        page,
        userid: userId,
        type: 'seeding',
      })

      const doc = parseHTML(html)

      // 查找可认领的种子
      const claimDoms = doc.querySelectorAll('.btn')
      claimDoms.forEach((dom) => {
        const id = dom.getAttribute('id')?.replace('btn', '') || ''
        if (id && !claimable.includes(id)) {
          claimable.push(id)
        }
      })

      // 查找已认领的种子
      const removeDoms = doc.querySelectorAll('.nowrap')
      removeDoms.forEach((dom) => {
        if (dom.innerHTML === '已认领') {
          const id = dom.getAttribute('id')?.replace('btn', '') || ''
          if (id && !claimed.includes(id)) {
            claimed.push(id)
          }
        }
      })

      page++

      const hasMore = hasNextPage(
        doc,
        `a[href*="?userid=${userId}&type=seeding&page=${page}"]`,
      )

      if (!hasMore)
        break
    } while (true)

    return { claimable, claimed }
  }

  async performAction(
    torrentId: string,
    action: ActionType,
    _context?: ActionContext,
  ): Promise<ActionResult> {
    if (action !== ActionType.CLAIM) {
      return {
        success: false,
        message: '春天站不支持弃种操作',
      }
    }

    try {
      const data = await getSSDLedTorrent(torrentId)

      return {
        success: true,
        message: data.msg || '领取成功',
      }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '领取失败',
      }
    }
  }
}
