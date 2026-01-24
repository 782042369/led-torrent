import type {
  ActionContext,
  ActionResult,
  LoadContext,
  SiteAdapter,
  TorrentData,
} from '@/types'
import type { ActionType, SiteType } from '@/utils/constants'

import { processWithConcurrencyAndDelay } from '@/utils/concurrency'

const CONCURRENCY_LIMIT = 5
const DELAY_AFTER_REQUEST_MS = 1000

export abstract class BaseAdapter implements SiteAdapter {
  abstract readonly name: string
  abstract readonly type: SiteType

  abstract supports(url: string): boolean
  abstract loadUserTorrents(
    userId: string,
    context?: LoadContext
  ): Promise<TorrentData>
  abstract performAction(
    torrentId: string,
    action: ActionType,
    context?: ActionContext
  ): Promise<ActionResult>

  protected hasNextPage(doc: Document, selector: string): boolean {
    return Boolean(doc.querySelector(selector))
  }

  protected parseHTML(html: string): Document {
    const parser = new DOMParser()
    return parser.parseFromString(html, 'text/html')
  }

  /**
   * 批量执行操作 - 使用并发控制和请求延迟
   * @param torrentIds - 种子ID数组
   * @param action - 操作类型
   * @param context - 执行上下文
   * @param concurrency - 并发数量，默认5
   * @param delayMs - 延迟时间（毫秒），默认1000
   * @returns 操作结果数组
   */
  async batchPerformAction(
    torrentIds: string[],
    action: ActionType,
    context?: ActionContext,
    concurrency: number = CONCURRENCY_LIMIT,
    delayMs: number = DELAY_AFTER_REQUEST_MS,
  ): Promise<ActionResult[]> {
    return processWithConcurrencyAndDelay(
      torrentIds,
      (torrentId) => this.performAction(torrentId, action, context),
      concurrency,
      delayMs,
      context?.onProgress,
    )
  }
}
