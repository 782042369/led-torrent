// 向后兼容的类型别名
import type { TorrentIdList } from './torrent'

export * from './api'
export * from './error'
export * from './site'
// 统一导出所有类型
export * from './torrent'

export type TorrentDataIdsType = TorrentIdList
