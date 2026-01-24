import type { ActionContext, ActionResult, LoadContext, TorrentData } from '@/types'

import {
  getNPHPLedTorrent,
  getNPHPUsertorrentHistory,
  getNPHPUsertorrentlistajax,
} from '@/utils/api'
import { hasNextPage, parseHTML } from '@/utils/common/dom'
import { ActionType, SiteType } from '@/utils/constants'

import { BaseAdapter } from './base.adapter'

/**
 * 通用NPHP站点适配器
 */
export class GenericAdapter extends BaseAdapter {
  readonly name = '通用站点'
  readonly type = SiteType.GENERIC

  supports(url: string): boolean {
    return url.includes('userdetails.php') && !url.includes('pterclub.com')
  }

  async loadUserTorrents(
    userId: string,
    context?: LoadContext,
  ): Promise<TorrentData> {
    const claimable: string[] = []
    const claimed: string[] = []
    let page = 0

    do {
      // 报告加载进度
      context?.onPageLoad?.(page)

      // 获取当前页数据
      const html = await getNPHPUsertorrentlistajax({
        page,
        userid: userId,
        type: 'seeding',
      })

      // 解析HTML
      const doc = parseHTML(html)

      // 查找所有td元素
      const tdList = doc.querySelectorAll('td')
      tdList.forEach((td) => {
        const buttons = td.querySelectorAll('button')
        if (buttons.length < 2)
          return

        const button0 = buttons[0]
        const button1 = buttons[1]

        const torrentId = button0.getAttribute('data-torrent_id')
        if (!torrentId)
          return

        const text0 = button0.textContent || ''
        const text1 = button1.textContent || ''
        const display0 = button0.style.display
        const display1 = button1.style.display

        // 需要认领的种子
        const isClaimable
          = (text0.includes('领') || text0.includes('領'))
            && display1 === 'none'
            && !claimable.includes(torrentId)

        if (isClaimable) {
          claimable.push(torrentId)
        }

        // 已认领的种子
        const isClaimed
          = display0 === 'none'
            && (text1.includes('弃') || text1.includes('棄'))
            && !claimed.includes(torrentId)

        if (isClaimed) {
          claimed.push(torrentId)
        }
      })

      page++

      // 检查是否有下一页
      const hasMore = hasNextPage(
        doc,
        `a[href*="getusertorrentlistajax.php?page=${page}"]`,
      )

      if (!hasMore)
        break
    } while (true)

    return { claimable, claimed }
  }

  async loadUserTorrentsHistory(
    uid: string,
    claimed: string[],
    context?: LoadContext,
  ): Promise<string[]> {
    const notSeeding: string[] = []
    let page = 0

    do {
      context?.onPageLoad?.(page)

      const html = await getNPHPUsertorrentHistory({ page, uid })
      const doc = parseHTML(html)

      const tdList = doc.querySelectorAll('#claim-table td')
      tdList.forEach((td) => {
        const buttons = td.querySelectorAll('button')
        if (buttons.length < 2)
          return

        const button0 = buttons[0]
        const button1 = buttons[1]

        const torrentId = button1.getAttribute('data-torrent_id')
        const claimId = button1.getAttribute('data-claim_id')
        const display0 = button0.style.display
        const text1 = button1.textContent || ''

        const shouldAdd
          = display0 === 'none'
            && (text1.includes('弃') || text1.includes('棄'))
            && torrentId
            && !claimed.includes(torrentId)
            && claimId
            && !notSeeding.includes(claimId)

        if (shouldAdd && claimId) {
          notSeeding.push(claimId)
        }
      })

      page++

      const hasMore = hasNextPage(doc, `a[href*="?uid=${uid}&page=${page}"]`)
      if (!hasMore)
        break
    } while (true)

    return notSeeding
  }

  async performAction(
    torrentId: string,
    action: ActionType,
    _context?: ActionContext,
  ): Promise<ActionResult> {
    try {
      const data = await getNPHPLedTorrent(
        torrentId,
        action === ActionType.CLAIM ? 'addClaim' : 'removeClaim',
      )

      return {
        success: true,
        message: data.msg || '操作成功',
      }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '操作失败',
      }
    }
  }
}
