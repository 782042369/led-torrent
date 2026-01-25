/**
 * 并发控制器 - 智能控制并发数量和请求延迟
 * 防止被PT站点封IP
 */

/**
 * 带并发控制和延迟的数组处理器
 *
 * @param items - 要处理的数组
 * @param processor - 处理函数
 * @param concurrency - 并发数量
 * @param delayMs - 每个请求完成后的延迟时间（毫秒）
 * @param onProgress - 进度回调 (当前数量, 总数量)
 * @returns 处理结果数组
 *
 * @example
 * await processWithConcurrencyAndDelay(
 *   items,
 *   async (item) => fetchData(item),
 *   2,     // 2个并发
 *   1000   // 延迟1秒
 * )
 */
export async function processWithConcurrencyAndDelay<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number,
  delayMs: number,
  onProgress?: (current: number, total: number) => void,
): Promise<R[]> {
  if (items.length === 0) {
    return []
  }

  const results: R[] = []
  let index = 0
  let completed = 0

  const processItem = async (): Promise<void> => {
    const currentIndex = index++

    try {
      results.push(await processor(items[currentIndex]))
    }
    finally {
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
      completed++
      onProgress?.(completed, items.length)
    }
  }

  const worker = async (): Promise<void> => {
    while (index < items.length) {
      await processItem()
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  )

  await Promise.all(workers)

  return results
}
