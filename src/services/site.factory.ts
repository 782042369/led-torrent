import type { SiteAdapter } from '@/types'

import { GenericAdapter } from '@/adapters/generic.adapter'
import { PterAdapter } from '@/adapters/pter.adapter'
import { SpringSundayAdapter } from '@/adapters/springsunday.adapter'

export class SiteFactory {
  private static adapters: SiteAdapter[] = [
    new PterAdapter(),
    new SpringSundayAdapter(),
    new GenericAdapter(),
  ]

  static getAdapter(url: string): SiteAdapter | null {
    return this.adapters.find(adapter => adapter.supports(url)) || null
  }

  static registerAdapter(adapter: SiteAdapter): void {
    this.adapters.unshift(adapter)
  }
}
