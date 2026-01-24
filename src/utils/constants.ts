/**
 * 站点枚举
 */
export enum SiteType {
  GENERIC = 'generic',
  PTER = 'pter',
  SPRING_SUNDAY = 'spring_sunday',
}

/**
 * 操作类型枚举
 */
export enum ActionType {
  CLAIM = 'claim',
  ABANDON = 'abandon',
}

/**
 * 请求超时时间（毫秒）
 */
export const REQUEST_TIMEOUT = 30000

/**
 * 分页大小
 */
export const PAGE_SIZE = 50
