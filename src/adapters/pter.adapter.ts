import type { ActionContext, ActionResult, LoadContext, TorrentData } from '@/types'

import {
  getNPHPPterLedTorrent,
  getNPHPPterUsertorrentlistajax,
} from '@/utils/api'
import { hasNextPage, parseHTML } from '@/utils/common/dom'
import { ActionType, SiteType } from '@/utils/constants'

import { BaseAdapter } from './base.adapter'

/**
 * 猫站适配器
 */
export class PterAdapter extends BaseAdapter {
  readonly name = '猫站'
  readonly type = SiteType.PTER

  supports(url: string): boolean {
    return url.includes('pterclub.com/getusertorrentlist.php')
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

      const html = await getNPHPPterUsertorrentlistajax({
        page,
        userid: userId,
        type: 'seeding',
      })

      const doc = parseHTML(html)

      // 查找可认领的种子
      const claimDoms = doc.querySelectorAll('.claim-confirm')
      claimDoms.forEach((dom) => {
        const id = dom.getAttribute('data-url') || ''
        if (id && !claimable.includes(id)) {
          claimable.push(id)
        }
      })

      // 查找已认领的种子
      const removeDoms = doc.querySelectorAll('.remove-confirm')
      removeDoms.forEach((dom) => {
        const id = dom.getAttribute('data-url') || ''
        if (id && !claimed.includes(id)) {
          claimed.push(id)
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
        message: '猫站不支持弃种操作',
      }
    }

    try {
      const success = await getNPHPPterLedTorrent(torrentId)

      return {
        success,
        message: success ? '领取成功' : '领取失败',
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
