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

  async batchPerformAction(
    torrentIds: string[],
    action: ActionType,
    onProgress?: (current: number, total: number, message: string) => void,
  ): Promise<Record<string, number>> {
    const stats: Record<string, number> = {}

    for (let i = 0; i < torrentIds.length; i++) {
      try {
        const result = await this.adapter.performAction(torrentIds[i], action, {
          onProgress: (current, total) => onProgress?.(current, total, result.message),
        })
        stats[result.message] = (stats[result.message] || 0) + 1
      }
      catch (error) {
        const message = getUserMessage(error)
        stats[message] = (stats[message] || 0) + 1
      }

      onProgress?.(i + 1, torrentIds.length, '处理中...')
    }

    return stats
  }

  getAdapterName(): string {
    return this.adapter.name
  }
}
