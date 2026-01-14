/*
 * @Author: yanghongxuan
 * @Date: 2026-01-14 23:00:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:00:00
 * @Description: 并发控制和速率限制器 - 防止把 PT 站点搞炸了
 */

/**
 * 并发控制池
 * 限制同时运行的任务数量，防止请求过多导致站点压力
 */
export class ConcurrentPool {
  private maxConcurrency: number
  private runningCount = 0
  private queue: Array<() => Promise<any>> = []

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency
  }

  /**
   * 添加任务到队列
   *
   * @param task - 要执行的异步任务
   * @returns Promise<T> - 任务执行结果
   */
  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task()
          resolve(result)
        }
        catch (error) {
          reject(error)
        }
      })

      this.runNext()
    })
  }

  /**
   * 执行下一个任务
   */
  private runNext() {
    if (this.runningCount >= this.maxConcurrency || this.queue.length === 0)
      return

    this.runningCount++
    const task = this.queue.shift()!

    task()
      .finally(() => {
        this.runningCount--
        this.runNext()
      })
  }

  /**
   * 等待所有任务完成
   */
  async waitAll() {
    while (this.runningCount > 0 || this.queue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
}

/**
 * 速率限制器
 * 控制单位时间内的请求次数，防止超过站点限制
 */
export class RateLimiter {
  private minInterval: number
  private lastRequestTime = 0

  /**
   * 创建速率限制器
   *
   * @param requestsPerMinute - 每分钟最多请求数
   */
  constructor(requestsPerMinute: number) {
    // 计算每个请求之间的最小间隔（毫秒）
    this.minInterval = (60 * 1000) / requestsPerMinute
  }

  /**
   * 等待直到可以发送下一个请求
   */
  async wait(): Promise<void> {
    const now = Date.now()
    const elapsed = now - this.lastRequestTime

    if (elapsed < this.minInterval) {
      const waitTime = this.minInterval - elapsed
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }

    this.lastRequestTime = Date.now()
  }

  /**
   * 重置速率限制器
   */
  reset() {
    this.lastRequestTime = 0
  }
}

/**
 * 批量任务执行器
 * 结合并发控制和速率限制，智能执行批量任务
 */
export class BatchTaskExecutor {
  private pool: ConcurrentPool
  private limiter: RateLimiter

  constructor(
    maxConcurrency: number,
    requestsPerMinute: number,
  ) {
    this.pool = new ConcurrentPool(maxConcurrency)
    this.limiter = new RateLimiter(requestsPerMinute)
  }

  /**
   * 批量执行任务
   *
   * @param tasks - 任务数组
   * @param onProgress - 进度回调 (current, total)
   * @returns Promise<T[]> - 所有任务的执行结果
   */
  async executeAll<T>(
    tasks: Array<() => Promise<T>>,
    onProgress?: (current: number, total: number) => void,
  ): Promise<T[]> {
    const results: T[] = []
    let completed = 0

    // 将所有任务添加到并发池
    const promises = tasks.map((task, index) =>
      this.pool.add(async () => {
        await this.limiter.wait()

        const result = await task()
        results[index] = result
        completed++

        if (onProgress) {
          onProgress(completed, tasks.length)
        }

        return result
      }),
    )

    await Promise.all(promises)
    await this.pool.waitAll()

    return results
  }

  /**
   * 等待所有任务完成
   */
  async waitAll() {
    await this.pool.waitAll()
  }
}

/**
 * 创建默认的任务执行器
 * 最多5个并发，每分钟35个请求
 */
export function createDefaultExecutor(): BatchTaskExecutor {
  return new BatchTaskExecutor(5, 35)
}

/**
 * 导出默认实例，方便直接使用
 */
export const defaultExecutor = new BatchTaskExecutor(5, 35)
