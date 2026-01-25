// 错误类型枚举
export enum ErrorKind {
  NETWORK = 'network',
  API = 'api',
  PARSE = 'parse',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

// 基础错误类
export abstract class AppError extends Error {
  abstract readonly kind: ErrorKind
  readonly userMessage: string
  readonly timestamp: Date
  readonly originalError?: unknown

  constructor(
    message: string,
    userMessage: string,
    originalError?: unknown,
  ) {
    super(message)
    this.name = this.constructor.name

    // 修复原型链 - 使 instanceof 正常工作
    Object.setPrototypeOf(this, new.target.prototype)

    // 修复堆栈追踪 - 移除当前构造函数的堆栈帧
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.userMessage = userMessage
    this.timestamp = new Date()
    this.originalError = originalError
  }
}

// 具体错误类
export class NetworkError extends AppError {
  readonly kind = ErrorKind.NETWORK
}

export class ApiError extends AppError {
  readonly kind = ErrorKind.API
  readonly statusCode?: number

  constructor(
    message: string,
    userMessage: string,
    statusCode?: number,
    originalError?: unknown,
  ) {
    super(message, userMessage, originalError)
    this.statusCode = statusCode
  }
}

export class ParseError extends AppError {
  readonly kind = ErrorKind.PARSE
}

export class ValidationError extends AppError {
  readonly kind = ErrorKind.VALIDATION
}

export class UnknownError extends AppError {
  readonly kind = ErrorKind.UNKNOWN
}

// 错误工具函数
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function getUserMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.userMessage
  }
  return '发生未知错误，请稍后重试'
}
