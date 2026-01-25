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

// ==================== 数值常量 ====================

/**
 * 请求超时时间（毫秒）
 */
export const REQUEST_TIMEOUT = 30000

/**
 * 分页大小
 */
export const PAGE_SIZE = 50

/**
 * 默认并发数量
 */
export const DEFAULT_CONCURRENCY_LIMIT = 2

/**
 * 请求延迟时间（毫秒） - 防止被PT站点封IP
 */
export const DEFAULT_DELAY_AFTER_REQUEST_MS = 1000

// ==================== URL 路径常量 ====================

/**
 * API 路径常量
 */
export const API_PATHS = {
  /** 通用NPHP站点种子列表 */
  USER_TORRENT_LIST_AJAX: 'getusertorrentlistajax.php',
  /** 通用NPHP站点种子列表（备用） */
  USER_TORRENT_LIST: 'getusertorrentlist.php',
  /** 通用NPHP站点领取记录 */
  CLAIM_HISTORY: 'claim.php',
  /** 通用NPHP站点AJAX接口 */
  AJAX: '/ajax.php',
  /** 查看认领页面 */
  VIEW_CLAIMS: 'viewclaims.php',
  /** 用户详情页面 */
  USER_DETAILS: 'userdetails.php',
  /** 登录页面 */
  LOGIN: '/login',
  /** SpringSunday站点领种接口 */
  SSD_ADOPT: '/adopt.php',
} as const

/**
 * 站点域名常量
 */
export const SITE_DOMAINS = {
  /** 猫站 */
  PTER: 'pterclub.net',
  /** 春天站 */
  SPRING_SUNDAY: 'springsunday.net',
} as const

// ==================== API 参数常量 ====================

/**
 * API 请求参数键名
 */
export const API_PARAMS = {
  /** 页码 */
  PAGE: 'page',
  /** 用户ID（通用站点） */
  USER_ID: 'userid',
  /** 用户ID（其他站点） */
  UID: 'uid',
  /** 类型（做种/下载/上传等） */
  TYPE: 'type',
  /** 操作动作 */
  ACTION: 'action',
  /** 种子ID参数（NPHP格式） */
  TORRENT_ID_PARAM: 'params[torrent_id]',
  /** ID参数（NPHP格式） */
  ID_PARAM: 'params[id]',
  /** ID参数（通用格式） */
  ID: 'id',
} as const

/**
 * API 请求参数值
 */
export const API_PARAM_VALUES = {
  /** 做种类型 */
  SEEDING: 'seeding',
  /** 认领操作 */
  CLAIM: 'addClaim',
  /** 弃种操作 */
  REMOVE_CLAIM: 'removeClaim',
  /** SpringSunday认领操作 */
  SSD_CLAIM: 'add',
} as const

// ==================== HTML/CSS 选择器常量 ====================

/**
 * CSS 选择器常量
 */
export const SELECTORS = {
  /** SpringSunday站点 - 按钮 */
  SSD_BUTTON: '.btn',
  /** SpringSunday站点 - 不可换行元素 */
  SSD_NOWRAP: '.nowrap',
  /** 通用站点 - 领取记录表格单元格 */
  CLAIM_TABLE_CELL: '#claim-table td',
  /** 通用站点 - 种子列表单元格 */
  TORRENT_LIST_CELL: 'td',
  /** 猫站 - 认领确认按钮 */
  PTER_CLAIM_CONFIRM: '.claim-confirm',
  /** 猫站 - 弃种确认按钮 */
  PTER_REMOVE_CONFIRM: '.remove-confirm',
  /** 按钮 */
  BUTTON: 'button',
  /** 链接 */
  LINK: 'a',
} as const

// ==================== HTML 文本内容常量 ====================

/**
 * HTML 文本内容常量
 */
export const TEXT_CONTENT = {
  /** 已认领/已领取（简体中文） */
  CLAIMED_CN: '已认领',
  /** 已认领/已领取（繁体中文） */
  CLAIMED_TW: '已领取',
  /** 认领按钮文本（简体中文） */
  CLAIM_BUTTON_CN: '领',
  /** 认领按钮文本（繁体中文） */
  CLAIM_BUTTON_TW: '領',
  /** 弃种按钮文本（简体中文） */
  ABANDON_BUTTON_CN: '弃',
  /** 弃种按钮文本（繁体中文） */
  ABANDON_BUTTON_TW: '棄',
} as const

/**
 * CSS 样式值常量
 */
export const CSS_VALUES = {
  /** 隐藏元素 */
  DISPLAY_NONE: 'none',
} as const

// ==================== 用户消息常量（支持国际化） ====================

/**
 * 用户消息常量
 */
export const MESSAGES = {
  /** 站点不支持弃种操作 */
  ABANDON_NOT_SUPPORTED: {
    generic: '该站点不支持弃种操作',
    pter: '猫站不支持弃种操作',
    springsunday: '春天站不支持弃种操作',
  },
  /** 操作成功 */
  SUCCESS: {
    claim: '领取成功',
    abandon: '弃种成功',
    operation: '操作成功',
  },
  /** 操作失败 */
  FAILURE: {
    claim: '领取失败',
    abandon: '弃种失败',
    operation: '操作失败',
  },
  /** 错误消息 */
  ERROR: {
    /** 请求超时 */
    TIMEOUT: '请求超时，请检查网络连接后重试',
    /** 登录失效 */
    UNAUTHORIZED: '登录失效或无权限访问，请重新登录',
    /** 网络请求失败 */
    NETWORK_ERROR: '网络请求失败，请检查网络连接',
  },
} as const

// ==================== HTTP 状态码常量 ====================

/**
 * HTTP 状态码常量
 */
export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

/**
 * 错误状态码集合
 */
export const ERROR_STATUS_CODES = [
  HTTP_STATUS.INTERNAL_SERVER_ERROR,
  HTTP_STATUS.NOT_FOUND,
  HTTP_STATUS.FORBIDDEN,
] as const
