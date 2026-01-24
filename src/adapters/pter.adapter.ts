import type { ActionContext, ActionResult, LoadContext, TorrentData } from '@/types'

import {
  getNPHPPterLedTorrent,
  getNPHPPterUsertorrentlistajax,
} from '@/utils/api'
import { hasNextPage, parseHTML } from '@/utils/common/dom'
import {
  ActionType,
  API_PARAMS,
  API_PATHS,
  MESSAGES,
  SELECTORS,
  SITE_DOMAINS,
  SiteType,
} from '@/utils/constants'

import { BaseAdapter } from './base.adapter'

/**
 * 猫站适配器
 */
export class PterAdapter extends BaseAdapter {
  readonly name = '猫站'
  readonly type = SiteType.PTER

  supports(url: string): boolean {
    return url.includes(`${SITE_DOMAINS.PTER}/${API_PATHS.USER_TORRENT_LIST}`)
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
      const claimDoms = doc.querySelectorAll(SELECTORS.PTER_CLAIM_CONFIRM)
      claimDoms.forEach((dom) => {
        const id = dom.getAttribute('data-url') || ''
        if (id && !claimable.includes(id)) {
          claimable.push(id)
        }
      })

      // 查找已认领的种子
      const removeDoms = doc.querySelectorAll(SELECTORS.PTER_REMOVE_CONFIRM)
      removeDoms.forEach((dom) => {
        const id = dom.getAttribute('data-url') || ''
        if (id && !claimed.includes(id)) {
          claimed.push(id)
        }
      })

      page++

      const hasMore = hasNextPage(
        doc,
        `a[href*="?${API_PARAMS.USER_ID}=${userId}&${API_PARAMS.TYPE}=seeding&${API_PARAMS.PAGE}=${page}"]`,
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
        message: MESSAGES.ABANDON_NOT_SUPPORTED.pter,
      }
    }

    try {
      const success = await getNPHPPterLedTorrent(torrentId)

      return {
        success,
        message: success ? MESSAGES.SUCCESS.claim : MESSAGES.FAILURE.claim,
      }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : MESSAGES.FAILURE.claim,
      }
    }
  }
}
