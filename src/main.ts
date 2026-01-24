import { SiteFactory } from '@/services/site.factory'
import { TorrentService } from '@/services/torrent.service'
import { getUrlParam } from '@/utils/common/dom'
import { animateButton, buildMessageList, buildProgressText } from '@/utils/common/ui'
import { ActionType } from '@/utils/constants'
import '@/styles/led-torrent.scss'

class LoadingState {
  private _loading = false

  get isLoading(): boolean {
    return this._loading
  }

  start(): void {
    this._loading = true
  }

  stop(): void {
    this._loading = false
  }
}

class UIManager {
  private button: HTMLButtonElement
  private messageList: HTMLUListElement
  private loadingState: LoadingState

  constructor(button: HTMLButtonElement, messageList: HTMLUListElement) {
    this.button = button
    this.messageList = messageList
    this.loadingState = new LoadingState()
  }

  setupButtonListener(handler: () => Promise<void>): void {
    this.button.addEventListener('click', async (e) => {
      if (this.loadingState.isLoading) {
        e.preventDefault()
        return
      }

      this.loadingState.start()
      animateButton(e)
      this.button.disabled = true

      try {
        await handler()
      }
      catch (error) {
        console.error('Error:', error)
        this.showError(error)
      }
      finally {
        this.loadingState.stop()
        this.button.disabled = false
      }
    })
  }

  private showError(error: unknown): void {
    const message = error instanceof Error ? error.message : '未知错误'
    this.button.textContent = message
  }

  setText(text: string): void {
    this.button.textContent = text
  }

  updateMessages(messages: Record<string, number>): void {
    this.messageList.innerHTML = buildMessageList(messages)
  }

  addMessage(message: string): void {
    this.messageList.innerHTML += `<li>${message}</li>`
  }
}

class AppController {
  private ui: UIManager
  private service: TorrentService | null = null

  constructor(ui: UIManager) {
    this.ui = ui
  }

  init(): void {
    const url = window.location.href
    const adapter = SiteFactory.getAdapter(url)

    if (!adapter) {
      this.ui.setText('当前站点不支持')
      this.ui.addMessage('未找到适配当前站点的处理器')
      return
    }

    this.service = new TorrentService(adapter)

    if (url.includes('claim.php')) {
      this.setupAbandonButton()
    }
    else {
      this.setupClaimButton()
    }
  }

  private setupClaimButton(): void {
    if (!this.service)
      return

    this.ui.setText('一键认领')
    this.ui.addMessage('点击按钮开始认领种子')

    this.ui.setupButtonListener(async () => {
      const userId = getUrlParam('id')
      if (!userId)
        throw new Error('无法获取用户ID')

      this.ui.setText('正在加载种子数据...')
      const data = await this.service!.loadUserTorrents(userId, msg => this.ui.addMessage(msg))

      if (data.claimed.length > 0)
        this.ui.updateMessages({ 已经认领过: data.claimed.length })

      if (data.claimable.length === 0) {
        this.ui.setText('没有可认领的种子')
        return
      }

      const confirmed = confirm(`找到 ${data.claimable.length} 个可认领种子，是否开始认领？`)
      if (!confirmed)
        return

      this.ui.setText('开始认领...')
      const stats = await this.service!.batchPerformAction(
        data.claimable,
        ActionType.CLAIM,
        (current, total) => {
          this.ui.setText(buildProgressText(total, current))
        },
      )

      this.ui.setText('认领完成，刷新查看')
      this.ui.updateMessages(stats)
    })
  }

  private setupAbandonButton(): void {
    if (!this.service)
      return

    this.ui.setText('一键弃种')
    this.ui.addMessage('放弃本人没在做种的种子')

    this.ui.setupButtonListener(async () => {
      const userId = getUrlParam('uid')
      if (!userId)
        throw new Error('无法获取用户ID')

      const confirmed = confirm('真的要弃种吗?')
      if (!confirmed)
        return

      // 第一步：获取做种数据
      this.ui.setText('正在获取做种数据...')
      const seedingData = await this.service!.loadUserTorrents(userId, msg => this.ui.addMessage(msg))
      this.ui.addMessage(`获取所有在做种且领取状态的数据一共 ${seedingData.claimed.length} 个`)

      // 第二步：获取历史领种数据（不在做种的种子）
      this.ui.setText('正在获取历史领种数据...')
      const notSeeding = await this.service!.loadUserTorrentsHistory(
        userId,
        seedingData.claimed,
        msg => this.ui.addMessage(msg),
      )

      if (notSeeding.length === 0) {
        this.ui.setText('没有需要弃种的种子')
        return
      }

      this.ui.addMessage(`获取所有没在做种且领取状态的数据一共 ${notSeeding.length} 个`)

      // 第三步：确认弃种
      const confirmed2 = confirm(
        `目前有 ${notSeeding.length} 个可能不在做种状态，真的要放弃领种吗?`,
      )
      if (!confirmed2)
        return

      // 第四步：执行弃种操作
      this.ui.setText('开始弃种...')
      const stats = await this.service!.batchPerformAction(
        notSeeding,
        ActionType.ABANDON,
        (current, total) => {
          this.ui.setText(buildProgressText(total, current))
        },
      )

      this.ui.setText('弃种完成')
      this.ui.updateMessages(stats)
    })
  }
}

function bootstrap(): void {
  const button = document.createElement('button')
  button.className = 'bubbly-button'

  const messageList = document.createElement('ul')
  const container = document.createElement('div')
  container.className = 'led-box'
  container.appendChild(button)
  container.appendChild(messageList)

  const ui = new UIManager(button, messageList)
  const controller = new AppController(ui)
  controller.init()

  document.body.appendChild(container)
}

bootstrap()
