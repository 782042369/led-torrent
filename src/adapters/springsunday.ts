/*
 * @Author: yanghongxuan
 * @Date: 2024-12-23 12:50:14
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:45:00
 * @Description: Springsunday 站点适配器 - 适配春天站（springsunday.net）
 */

import type { TorrentDataIdsType } from '@/core/types'

import { getNPHPUsertorrentlistajax, getSSDLedTorrent } from '@/core/api'

import type { UIManager } from './base'

import { BaseSiteAdapter, DOMHelper } from './base'

/**
 * 春天站适配器
 * 继承基类，实现春天站特定的解析和操作逻辑
 */
class SpringSiteAdapter extends BaseSiteAdapter {
  siteName = '春天站'

  protected async fetchPageData(page: number, userid: string): Promise<string> {
    return getNPHPUsertorrentlistajax({
      page,
      userid,
      type: 'seeding',
    })
  }

  protected parsePageData(
    html: string,
    allData: TorrentDataIdsType,
    ledlist: string[],
  ): void {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const claimDoms = doc.querySelectorAll('.btn')
    const removeDoms = doc.querySelectorAll('.nowrap')

    claimDoms.forEach((v) => {
      const id = DOMHelper.getAttr(v, 'id', '').replace('btn', '')
      if (id && !allData.includes(id)) {
        allData.push(id)
      }
    })

    removeDoms.forEach((v) => {
      if (v.innerHTML === '已认领') {
        const id = DOMHelper.getAttr(v, 'id', '').replace('btn', '')
        if (id && !ledlist.includes(id)) {
          ledlist.push(id)
        }
      }
    })
  }

  protected hasNextPage(doc: Document, page: number, userid: string): boolean {
    return DOMHelper.checkNextPage(
      doc,
      `a[href*="?userid=${userid}&type=seeding&page=${page}"]`,
    )
  }

  protected async claimOneTorrent(id: string): Promise<string> {
    try {
      const data = await getSSDLedTorrent(id)
      return data && data.ret === 0 ? '领取成功' : '领取失败'
    }
    catch {
      console.error('handleLedSpringsundayTorrent error: ')
      return '领取失败'
    }
  }
}

/**
 * 春天站适配器实例
 */
export const springAdapter = new SpringSiteAdapter()

/**
 * 加载春天站用户做种数据
 *
 * @param userid - 用户ID
 * @param allData - 用于存储所有种子ID的数组
 * @param ledlist - 用于存储已领种子ID的数组
 */
export async function loadSpringsundayUserTorrents(
  userid: string,
  allData: TorrentDataIdsType,
  ledlist: string[],
): Promise<void> {
  await springAdapter.loadUserTorrents(userid, allData, ledlist)
}

/**
 * 春天站领种处理函数
 *
 * @param arr - 种子ID数组
 * @param button - 操作按钮元素，用于显示进度
 * @param json - 用于统计结果的消息对象
 */
export async function handleLedSpringsundayTorrent(
  arr: TorrentDataIdsType,
  button: HTMLButtonElement,
  json: { [key in string]: number },
): Promise<void> {
  // 临时创建简单的 UIManager（后续会迁移到 ui/ 目录）
  const messageList = button.nextElementSibling as HTMLUListElement
  const ui: UIManager = {
    updateButton: (text: string) => { button.textContent = text },
    updateProgress: (current: number, total: number) => {
      button.textContent = `努力再努力 ${total} / ${current}`
    },
    addMessage: (message: string) => {
      const li = document.createElement('li')
      li.textContent = message
      messageList.appendChild(li)
    },
    flush: () => {},
    clearMessages: () => { messageList.innerHTML = '' },
    showStats: (stats: Record<string, number>) => {
      messageList.innerHTML = Object.entries(stats)
        .map(([key, value]) => `<li>${key}: ${value}</li>`)
        .join('')
    },
    setDisabled: (disabled: boolean) => { button.disabled = disabled },
  }

  await springAdapter.handleLedTorrent(arr, ui, json)
}
