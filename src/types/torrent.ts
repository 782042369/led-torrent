/**
 * 种子数据ID类型
 */
export type TorrentId = string

/**
 * 种子ID数组
 */
export type TorrentIdList = TorrentId[]

/**
 * 种子数据
 */
export interface TorrentData {
  // 可认领的种子
  claimable: TorrentIdList
  // 已认领的种子
  claimed: TorrentIdList
}

/**
 * 加载上下文
 */
export interface LoadContext {
  onPageLoad?: (page: number) => void
  onProgress?: (current: number, total: number) => void
}
