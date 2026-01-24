import type { ActionType, SiteType } from '@/utils/constants'

import type { LoadContext, TorrentData } from './torrent'

/**
 * 站点适配器接口
 */
export interface SiteAdapter {
  /**
   * 站点名称
   */
  readonly name: string

  /**
   * 站点类型
   */
  readonly type: SiteType

  /**
   * 检查是否支持当前URL
   */
  supports: (url: string) => boolean

  /**
   * 加载用户种子数据
   */
  loadUserTorrents: (
    userId: string,
    context?: LoadContext,
  ) => Promise<TorrentData>

  /**
   * 执行操作（领种/弃种）
   */
  performAction: (
    torrentId: string,
    action: ActionType,
    context?: ActionContext,
  ) => Promise<ActionResult>

  /**
   * 批量执行操作 - 使用并发控制和请求延迟
   */
  batchPerformAction: (
    torrentIds: string[],
    action: ActionType,
    context?: ActionContext,
    concurrency?: number,
    delayMs?: number,
  ) => Promise<ActionResult[]>
}

/**
 * 操作上下文
 */
export interface ActionContext {
  onProgress?: (current: number, total: number) => void
}

/**
 * 操作结果
 */
export interface ActionResult {
  success: boolean
  message: string
}
