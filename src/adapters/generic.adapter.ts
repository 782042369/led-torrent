import type { ActionContext, ActionResult, LoadContext, TorrentData } from '@/types'

import {
  getNPHPLedTorrent,
  getNPHPUsertorrentHistory,
  getNPHPUsertorrentlistajax,
} from '@/utils/api'
import { hasNextPage, parseHTML } from '@/utils/common/dom'
import {
  ActionType,
  API_PARAM_VALUES,
  API_PARAMS,
  API_PATHS,
  CSS_VALUES,
  MESSAGES,
  SELECTORS,
  SITE_DOMAINS,
  SiteType,
  TEXT_CONTENT,
} from '@/utils/constants'

import { BaseAdapter } from './base.adapter'

/**
 * 通用NPHP站点适配器
 */
export class GenericAdapter extends BaseAdapter {
  readonly name = '通用站点'
  readonly type = SiteType.GENERIC

  supports(url: string): boolean {
    return url.includes(API_PATHS.USER_DETAILS) && !url.includes(SITE_DOMAINS.PTER)
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
      const tdList = doc.querySelectorAll(SELECTORS.TORRENT_LIST_CELL)
      tdList.forEach((td) => {
        const buttons = td.querySelectorAll(SELECTORS.BUTTON)
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
          = (text0.includes(TEXT_CONTENT.CLAIM_BUTTON_CN) || text0.includes(TEXT_CONTENT.CLAIM_BUTTON_TW))
            && display1 === CSS_VALUES.DISPLAY_NONE
            && !claimable.includes(torrentId)

        if (isClaimable) {
          claimable.push(torrentId)
        }

        // 已认领的种子
        const isClaimed
          = display0 === CSS_VALUES.DISPLAY_NONE
            && (text1.includes(TEXT_CONTENT.ABANDON_BUTTON_CN) || text1.includes(TEXT_CONTENT.ABANDON_BUTTON_TW))
            && !claimed.includes(torrentId)

        if (isClaimed) {
          claimed.push(torrentId)
        }
      })

      page++

      // 检查是否有下一页
      const hasMore = hasNextPage(
        doc,
        `a[href*="${API_PATHS.USER_TORRENT_LIST_AJAX}?${API_PARAMS.PAGE}=${page}"]`,
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

      const tdList = doc.querySelectorAll(SELECTORS.CLAIM_TABLE_CELL)
      tdList.forEach((td) => {
        const buttons = td.querySelectorAll(SELECTORS.BUTTON)
        if (buttons.length < 2)
          return

        const button0 = buttons[0]
        const button1 = buttons[1]

        const torrentId = button1.getAttribute('data-torrent_id')
        const claimId = button1.getAttribute('data-claim_id')
        const display0 = button0.style.display
        const text1 = button1.textContent || ''

        const shouldAdd
          = display0 === CSS_VALUES.DISPLAY_NONE
            && (text1.includes(TEXT_CONTENT.ABANDON_BUTTON_CN) || text1.includes(TEXT_CONTENT.ABANDON_BUTTON_TW))
            && torrentId
            && !claimed.includes(torrentId)
            && claimId
            && !notSeeding.includes(claimId)

        if (shouldAdd && claimId) {
          notSeeding.push(claimId)
        }
      })

      page++

      const hasMore = hasNextPage(doc, `a[href*="?${API_PARAMS.UID}=${uid}&${API_PARAMS.PAGE}=${page}"]`)
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
        action === ActionType.CLAIM ? API_PARAM_VALUES.CLAIM : API_PARAM_VALUES.REMOVE_CLAIM,
      )

      return {
        success: true,
        message: data.msg || MESSAGES.SUCCESS.operation,
      }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : MESSAGES.FAILURE.operation,
      }
    }
  }
}
