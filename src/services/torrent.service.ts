import type { SiteAdapter, TorrentData } from '@/types'
import type { ActionType } from '@/utils/constants'

import { getUserMessage } from '@/utils/errors'

export class TorrentService {
  constructor(private adapter: SiteAdapter) {}

  async loadUserTorrents(
    userId: string,
    onProgress?: (message: string) => void,
  ): Promise<TorrentData> {
    try {
      onProgress?.('正在加载种子数据...')

      const data = await this.adapter.loadUserTorrents(userId, {
        onPageLoad: page => onProgress?.(`正在加载第 ${page + 1} 页...`),
      })

      const total = data.claimable.length + data.claimed.length
      onProgress?.(`加载完成，共找到 ${total} 个种子`)

      return data
    }
    catch (error) {
      const message = getUserMessage(error)
      onProgress?.(`加载失败: ${message}`)
      throw error
    }
  }

  /**
   * 批量执行操作 - 使用并发控制和请求延迟
   * @param torrentIds - 种子ID数组
   * @param action - 操作类型
   * @param onProgress - 进度回调
   * @returns 统计结果
   */
  async batchPerformAction(
    torrentIds: string[],
    action: ActionType,
    onProgress?: (current: number, total: number) => void,
  ): Promise<Record<string, number>> {
    const results = await this.adapter.batchPerformAction(
      torrentIds,
      action,
      { onProgress },
    )

    const stats: Record<string, number> = {}
    for (const result of results) {
      stats[result.message] = (stats[result.message] ?? 0) + 1
    }

    return stats
  }

  getAdapterName(): string {
    return this.adapter.name
  }
}
