/*
 * @Author: yanghongxuan
 * @Date: 2026-01-14 23:10:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:45:00
 * @Description: 站点适配器基类 - 消除重复代码，遵循 DRY 原则
 */

import type { TorrentDataIdsType } from '@/core/types'

import { BatchTaskExecutor } from '@/core/concurrent'

/**
 * UI 管理器接口（临时定义，完整版本在 ui/ 目录）
 */
export interface UIManager {
  updateButton: (text: string) => void
  updateProgress: (current: number, total: number) => void
  addMessage: (message: string) => void
  flush: () => void
  clearMessages: () => void
  showStats: (stats: Record<string, number>) => void
  setDisabled: (disabled: boolean) => void
}

/**
 * 站点适配器接口
 * 所有站点适配器必须实现此接口
 */
export interface ISiteAdapter {
  /**
   * 站点名称
   */
  siteName: string

  /**
   * 加载用户种子数据
   *
   * @param userid - 用户 ID
   * @param allData - 可认领种子数组
   * @param ledlist - 已认领种子数组
   */
  loadUserTorrents: (
    userid: string,
    allData: TorrentDataIdsType,
    ledlist: string[]
  ) => Promise<void>

  /**
   * 执行领种操作
   *
   * @param arr - 种子 ID 数组
   * @param ui - UI 管理器
   * @param stats - 统计对象
   */
  handleLedTorrent: (
    arr: TorrentDataIdsType,
    ui: UIManager,
    stats: Record<string, number>
  ) => Promise<void>
}

/**
 * 站点适配器基类
 * 提供通用的分页加载和批量处理逻辑
 */
export abstract class BaseSiteAdapter implements ISiteAdapter {
  abstract siteName: string

  /**
   * 子类实现：获取指定页的 HTML 数据
   *
   * @param page - 页码
   * @param userid - 用户 ID
   * @returns Promise<string> - HTML 文本
   */
  protected abstract fetchPageData(page: number, userid: string): Promise<string>

  /**
   * 子类实现：解析 HTML 提取种子数据
   *
   * @param html - HTML 文本
   * @param allData - 可认领种子数组（输出）
   * @param ledlist - 已认领种子数组（输出）
   */
  protected abstract parsePageData(
    html: string,
    allData: TorrentDataIdsType,
    ledlist: string[]
  ): void

  /**
   * 子类实现：检查是否有下一页
   *
   * @param doc - 解析后的 DOM 文档
   * @param page - 下一页页码
   * @param userid - 用户 ID
   * @returns boolean
   */
  protected abstract hasNextPage(
    doc: Document,
    page: number,
    userid: string
  ): boolean

  /**
   * 子类实现：执行单个种子的领种操作
   *
   * @param id - 种子 ID
   * @returns Promise<string> - 操作结果消息
   */
  protected abstract claimOneTorrent(id: string): Promise<string>

  /**
   * 加载用户种子数据（带分页）
   *
   * @param userid - 用户 ID
   * @param allData - 可认领种子数组
   * @param ledlist - 已认领种子数组
   */
  async loadUserTorrents(
    userid: string,
    allData: TorrentDataIdsType,
    ledlist: string[],
  ): Promise<void> {
    let page = 0
    let hasMore = true

    do {
      const html = await this.fetchPageData(page, userid)
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      this.parsePageData(html, allData, ledlist)
      hasMore = this.hasNextPage(doc, page + 1, userid)
      page++
    } while (hasMore)
  }

  /**
   * 执行批量领种操作（使用并发控制）
   *
   * @param arr - 种子 ID 数组
   * @param ui - UI 管理器
   * @param stats - 统计对象
   */
  async handleLedTorrent(
    arr: TorrentDataIdsType,
    ui: UIManager,
    stats: Record<string, number>,
  ): Promise<void> {
    if (arr.length === 0) {
      ui.addMessage('没有需要操作的种子')
      ui.flush()
      return
    }

    // 创建任务执行器
    const executor = new BatchTaskExecutor(5, 35)

    // 创建任务数组
    const tasks = arr.map(id => () => this.claimOneTorrent(id))

    // 执行所有任务
    await executor.executeAll(
      tasks,
      (current, total) => {
        ui.updateProgress(current, total)
      },
    )

    // 统计结果
    const results = await Promise.allSettled(
      arr.map(id => this.claimOneTorrent(id)),
    )

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const msg = result.value
        stats[msg] = (stats[msg] || 0) + 1
      }
      else {
        stats['操作失败'] = (stats['操作失败'] || 0) + 1
      }
    })

    ui.showStats(stats)
  }
}

/**
 * DOM 解析工具类
 * 提供常用的 DOM 解析方法
 */
export class DOMHelper {
  /**
   * 检查是否有下一页
   *
   * @param doc - DOM 文档
   * @param selector - 下一页链接选择器
   * @returns boolean
   */
  static checkNextPage(doc: Document, selector: string): boolean {
    const nextLink = doc.querySelector(selector)
    return nextLink !== null
  }

  /**
   * 提取元素属性值
   *
   * @param element - DOM 元素
   * @param attrName - 属性名
   * @param defaultValue - 默认值
   * @returns string
   */
  static getAttr(
    element: Element,
    attrName: string,
    defaultValue = '',
  ): string {
    return element.getAttribute(attrName) || defaultValue
  }

  /**
   * 检查元素文本是否包含指定内容
   *
   * @param element - DOM 元素
   * @param searchText - 搜索文本
   * @returns boolean
   */
  static textContains(element: Element, searchText: string): boolean {
    return element.textContent?.includes(searchText) || false
  }

  /**
   * 检查元素是否可见
   *
   * @param element - DOM 元素
   * @returns boolean
   */
  static isVisible(element: Element): boolean {
    const style = (element as HTMLElement).style
    return style.display !== 'none'
  }
}
