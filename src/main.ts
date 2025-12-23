/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 14:46:20
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2025-05-13 15:00:00
 * @Description: LED Torrent 主入口文件，用于在各大PT站点实现一键领种/弃种功能
 */
import {
  animateButton,
  getLedMsg,
  getvl,
  handleLedPterTorrent,
  handleLedSpringsundayTorrent,
  handleLedTorrent,
  loadPterUserTorrents,
  loadSpringsundayUserTorrents,
  loadUserTorrents,
  loadUserTorrentsHistory,
} from '@/utils'
import '@/styles/led-torrent.scss'

import type { TorrentDataIdsType } from './types'

// 初始化加载状态
let loading = false
// 优化事件监听器的设置
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
    animateButton(e)
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

const button = document.createElement('button')
const ulbox = document.createElement('ul')
button.className = 'bubbly-button'
const div = document.createElement('div')
div.className = 'led-box'

div.appendChild(button)
div.appendChild(ulbox)

if (location.href.includes('claim.php')) {
  button.textContent = '一键弃种'
  ulbox.innerHTML = `<li>放弃本人没在做种的种子</li>`

  setupButtonListener(button, async () => {
    if (confirm('真的要弃种吗?')) {
      button.textContent = '获取所有数据，请稍等。'
      const msglist: { [key in string]: number } = {}
      // 获取所有做种领种数据
      const uid = getvl('uid')
      const ledlist: string[] = []
      await loadUserTorrents(uid, [], ledlist)
      ulbox.innerHTML += `<li>获取所有在做种且领取状态的数据一共${ledlist.length}个</li>`
      const allData: TorrentDataIdsType = []
      button.textContent = '获取所有领种的数据'
      await loadUserTorrentsHistory(uid, allData, ledlist)
      ulbox.innerHTML += `<li>获取所有没在做种且领取状态的数据一共${allData.length}个</li>`
      if (allData.length) {
        if (
          confirm(
            `目前有${allData.length}个可能不在做种状态，真的要放弃领种吗?`,
          )
        ) {
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
  })
}

// 定义一些通用的函数来处理重复的逻辑

/**
 * 处理不同站点的种子操作（认领、放弃等）
 *
 * @param button - 操作按钮元素，用于显示状态信息
 * @param ulbox - 显示操作消息的列表元素
 * @param userId - 用户ID，用于获取用户相关的种子数据
 * @param action - 操作类型，指定要执行的具体操作
 * @returns Promise<void> - 异步操作完成后的Promise
 */
async function handleTorrentsActions(
  button: HTMLButtonElement,
  ulbox: HTMLElement,
  userId: string,
  action: 'claim' | 'abandon' | 'claimPter' | 'claimSpring' | 'claimSCH',
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
  if (action === 'claim' || action === 'abandon') {
    await handleLedTorrent(
      allData,
      button,
      msglist,
      action === 'claim' ? 'addClaim' : 'removeClaim',
    )
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
if (location.href.includes('pterclub.com/getusertorrentlist.php')) {
  // 猫站领取种子按钮
  button.textContent = '一键认领'
  setupButtonListener(button, () =>
    handleTorrentsActions(button, ulbox, getvl('userid'), 'claimPter'))
}
else if (location.href.includes('springsunday.net/userdetails.php')) {
  // 春天领取种子
  button.textContent = '一键认领'
  setupButtonListener(button, () =>
    handleTorrentsActions(button, ulbox, getvl('id'), 'claimSpring'))
}
else if (location.href.includes('pt.btschool.club/userdetails.php')) {
  // 学校领取种子
  button.textContent = '一键认领'
  setupButtonListener(button, () =>
    handleTorrentsActions(button, ulbox, getvl('id'), 'claimSCH'))
}
else if (location.href.includes('userdetails.php')) {
  // 通用站点领取种子
  button.textContent = '一键认领'
  setupButtonListener(button, () =>
    handleTorrentsActions(button, ulbox, getvl('id'), 'claim'))
}
else if (location.href.includes('claim.php')) {
  // 通用站点放弃本地没在做种的领种
  button.textContent = '一键弃种'
  ulbox.innerHTML = `<li>放弃本人没在做种的种子</li>`
  setupButtonListener(button, () =>
    handleTorrentsActions(button, ulbox, getvl('uid'), 'abandon'))
}

document.body.appendChild(div)
