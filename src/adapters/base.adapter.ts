import type { ActionContext, ActionResult, LoadContext, SiteAdapter, TorrentData } from '@/types'
import type { ActionType, SiteType } from '@/utils/constants'

export abstract class BaseAdapter implements SiteAdapter {
  abstract readonly name: string
  abstract readonly type: SiteType

  abstract supports(url: string): boolean
  abstract loadUserTorrents(userId: string, context?: LoadContext): Promise<TorrentData>
  abstract performAction(torrentId: string, action: ActionType, context?: ActionContext): Promise<ActionResult>

  protected hasNextPage(doc: Document, selector: string): boolean {
    return Boolean(doc.querySelector(selector))
  }

  protected parseHTML(html: string): Document {
    const parser = new DOMParser()
    return parser.parseFromString(html, 'text/html')
  }

  protected async batchPerformAction(
    torrentIds: string[],
    action: ActionType,
    context?: ActionContext,
  ): Promise<ActionResult[]> {
    const results: ActionResult[] = []

    for (let i = 0; i < torrentIds.length; i++) {
      const result = await this.performAction(torrentIds[i], action, context)
      results.push(result)
      context?.onProgress?.(i + 1, torrentIds.length)
    }

    return results
  }
}
