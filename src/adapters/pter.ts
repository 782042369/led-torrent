/*
 * @Author: yanghongxuan
 * @Date: 2024-12-23 12:50:14
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:45:00
 * @Description: Pter 站点适配器 - 适配猫站（pterclub.com）
 */

import type { TorrentDataIdsType } from '@/core/types'

import { getNPHPPterLedTorrent, getNPHPPterUsertorrentlistajax } from '@/core/api'

import type { UIManager } from './base'

import { BaseSiteAdapter, DOMHelper } from './base'

/**
 * 猫站适配器
 * 继承基类，实现猫站特定的解析和操作逻辑
 */
class PterSiteAdapter extends BaseSiteAdapter {
  siteName = '猫站'

  protected async fetchPageData(page: number, userid: string): Promise<string> {
    return getNPHPPterUsertorrentlistajax({
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

    const claimDoms = doc.querySelectorAll('.claim-confirm')
    const removeDoms = doc.querySelectorAll('.remove-confirm')

    claimDoms.forEach((v) => {
      const id = DOMHelper.getAttr(v, 'data-url')
      if (id && !allData.includes(id)) {
        allData.push(id)
      }
    })

    removeDoms.forEach((v) => {
      const id = DOMHelper.getAttr(v, 'data-url')
      if (id && !ledlist.includes(id)) {
        ledlist.push(id)
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
      const data = await getNPHPPterLedTorrent(id)
      return data ? '领取成功' : '领取失败'
    }
    catch {
      console.error('handleLedPterTorrent error: ')
      return '领取失败'
    }
  }
}

/**
 * 猫站适配器实例
 */
export const pterAdapter = new PterSiteAdapter()

/**
 * 加载猫站用户做种数据
 *
 * @param userid - 用户ID
 * @param allData - 用于存储可以认领的种子ID数组
 * @param ledlist - 用于存储已认领的种子ID数组
 */
export async function loadPterUserTorrents(
  userid: string,
  allData: TorrentDataIdsType,
  ledlist: string[],
): Promise<void> {
  await pterAdapter.loadUserTorrents(userid, allData, ledlist)
}

/**
 * 执行猫站的领种操作
 *
 * @param arr - 包含种子ID的数组
 * @param button - 操作按钮元素，用于显示进度
 * @param json - 用于统计结果的消息对象
 */
export async function handleLedPterTorrent(
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

  await pterAdapter.handleLedTorrent(arr, ui, json)
}
