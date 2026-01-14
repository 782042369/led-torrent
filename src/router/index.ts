/*
 * @Author: yanghongxuan
 * @Date: 2026-01-14 23:50:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:55:00
 * @Description: 路由主入口 - 初始化和分发路由
 */

import type { TorrentDataIdsType } from '@/core/types'

import { ButtonAnimator, UICreator } from '@/ui'
import { getLedMsg, getvl } from '@/utils'

import type { RouteConfig } from './routes'

import { ROUTES } from './routes'

// 导入所有适配器函数
import {
  handleLedPterTorrent,
  handleLedSpringsundayTorrent,
  handleLedTorrent,
  loadPterUserTorrents,
  loadSpringsundayUserTorrents,
  loadUserTorrents,
  loadUserTorrentsHistory,
} from '@/adapters'

// 初始化加载状态
let loading = false

/**
 * 设置按钮监听器，处理领种/弃种操作
 *
 * @param button - 操作按钮元素
 * @param action - 异步操作函数，执行具体的领种或弃种逻辑
 */
function setupButtonListener(
  button: HTMLButtonElement,
  action: () => Promise<void>,
) {
  button.addEventListener('click', async (e: MouseEvent) => {
    if (loading) {
      e.preventDefault()
      return
    }
    loading = true
    ButtonAnimator.animate(e)
    button.disabled = true
    button.textContent = '开始工作，为了网站和你自己的电脑速度调的很慢~~~'

    try {
      await action()
    }
    catch (error: any) {
      console.error('Error: ', error)
      button.textContent = error.message
    }
    finally {
      loading = false
      button.disabled = false
    }
  })
}

/**
 * 处理不同站点的种子操作（认领、放弃等）
 *
 * @param button - 操作按钮元素，用于显示状态信息
 * @param ulbox - 显示操作消息的列表元素
 * @param userId - 用户ID，用于获取用户相关的种子数据
 * @param action - 操作类型，指定要执行的具体操作
 */
async function handleTorrentsActions(
  button: HTMLButtonElement,
  ulbox: HTMLElement,
  userId: string,
  action: 'claim' | 'abandon' | 'claimPter' | 'claimSpring',
) {
  const msglist: { [key in string]: number } = {}
  const ledlist: string[] = []
  const allData: TorrentDataIdsType = []

  // 根据不同的操作调用不同的函数获取种子数据
  if (action === 'claim' || action === 'abandon') {
    await loadUserTorrents(userId, allData, ledlist)
  }
  else if (action === 'claimPter') {
    await loadPterUserTorrents(userId, allData, ledlist)
  }
  else if (action === 'claimSpring') {
    await loadSpringsundayUserTorrents(userId, allData, ledlist)
  }

  if (!allData.length) {
    button.textContent = `该站点可能不支持领种子。`
  }

  if (ledlist.length > 0) {
    msglist['已经认领过'] = ledlist.length
  }
  ulbox.innerHTML = getLedMsg(msglist)

  // 根据操作执行相应的处理
  if (action === 'claim') {
    await handleLedTorrent(allData, button, msglist, 'addClaim')
  }
  else if (action === 'abandon') {
    // 特殊处理：弃种需要先加载历史数据
    if (confirm('真的要弃种吗?')) {
      button.textContent = '获取所有数据，请稍等。'
      await loadUserTorrentsHistory(userId, allData, ledlist)
      ulbox.innerHTML += `<li>获取所有没在做种且领取状态的数据一共${allData.length}个</li>`
      if (allData.length) {
        if (confirm(`目前有${allData.length}个可能不在做种状态，真的要放弃领种吗?`)) {
          await handleLedTorrent(allData, button, msglist, 'removeClaim')
        }
        else {
          loading = false
        }
      }
    }
    else {
      loading = false
    }
  }
  else if (action === 'claimPter') {
    await handleLedPterTorrent(allData, button, msglist)
  }
  else if (action === 'claimSpring') {
    await handleLedSpringsundayTorrent(allData, button, msglist)
  }

  button.textContent = `一键操作完毕，刷新查看。`
  ulbox.innerHTML = getLedMsg(msglist)
}

/**
 * 匹配当前路由
 *
 * @returns 匹配的路由配置，如果没有匹配则返回 null
 */
function matchRoute(): RouteConfig | null {
  const currentUrl = location.href

  for (const route of ROUTES) {
    const patterns = Array.isArray(route.pattern) ? route.pattern : [route.pattern]

    for (const pattern of patterns) {
      if (currentUrl.includes(pattern)) {
        return route
      }
    }
  }

  return null
}

/**
 * 初始化应用
 * 创建 UI 并匹配路由，设置对应的事件处理
 */
export function initApp() {
  // 使用 UICreator 创建面板
  const { container: div, button, messageList: ulbox } = UICreator.createPanel()

  // 匹配路由
  const route = matchRoute()

  if (route) {
    // 设置按钮文本和初始消息
    button.textContent = route.buttonText
    if (route.initMessage) {
      ulbox.innerHTML = route.initMessage
    }

    // 设置按钮监听器
    setupButtonListener(button, () =>
      handleTorrentsActions(button, ulbox, getvl(route.userIdParam), route.action))
  }
  else {
    // 没有匹配的路由，隐藏面板
    div.style.display = 'none'
  }

  // 将面板添加到页面
  document.body.appendChild(div)
}
