/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 14:46:20
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-11 22:00:37
 * @Description:
 */
/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:48:49
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 15:56:10
 * @Description:
 */
import {
  getNPHPLedTorrent,
  getNPHPUsertorrentHistory,
  getNPHPUsertorrentlistajax
} from '@/utils/api';
import '@/utils/led-torrent.scss';
import { getvl } from './utils';
export type torrentDataIdsType = {
  id: string;
}[];

/** 按钮动画效果 */
function animateButton(e: MouseEvent) {
  e.preventDefault;
  if (e.target && e.target instanceof Element) {
    const target = e.target;
    target.classList.remove('animate');
    target.classList.add('animate');
    setTimeout(() => {
      target.classList.remove('animate');
    }, 700);
  }
}
/** 认领、放弃种子 */
async function handleLedTorrent(
  arr: torrentDataIdsType,
  button: HTMLButtonElement,
  json: { [key in string]: number },
  type: 'removeClaim' | 'addClaim'
) {
  for (let i = 0; i < arr.length; i++) {
    button.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`;
    try {
      let data = await getNPHPLedTorrent(arr[i].id, type);
      const msg = data.msg || '领种接口返回信息错误';
      json[msg] = (json[msg] || 0) + 1;
    } catch (error) {
      console.error('handleLedTorrent error: ', error);
    }
  }
}
function getLedMsg(msglist: Record<string, number>) {
  let msgLi = '';
  Object.keys(msglist).forEach((e) => {
    msgLi += `<li>${e}: ${msglist[e]}</li>`;
  });
  return msgLi;
}
async function loadUserTorrents(
  userid: string,
  allData: torrentDataIdsType,
  ledlist: string[]
) {
  let page = 0;
  let hasMore = true;
  do {
    const details = await getNPHPUsertorrentlistajax({
      page,
      userid
    });
    const parser = new DOMParser();
    const doc = parser.parseFromString(details, 'text/html');
    const tdList = doc.querySelectorAll('td');
    tdList.forEach((v) => {
      const buttons = v.querySelectorAll('button');
      if (buttons.length > 0) {
        const {
          innerText: innerText0,
          style: { display: display0 }
        } = buttons[0];
        const torrent_id = buttons[0].getAttribute('data-torrent_id')!;
        const {
          innerText: innerText1,
          style: { display: display1 }
        } = buttons[1];
        // 需要认领的种子
        if (innerText0.includes('领') && display1 === 'none' && torrent_id) {
          allData.push({ id: torrent_id });
        }
        if (display0 === 'none' && innerText1.includes('弃')) {
          ledlist.push(torrent_id);
        }
      }
    });
    page++;
    const nextPageLinkSelector = `a[href*="getusertorrentlistajax.php?page=${page}"]`;
    // 在传入的文档中查找下一页链接
    hasMore = Boolean(doc.querySelector(nextPageLinkSelector));
  } while (hasMore);
}
async function loadUserTorrentsHistory(
  uid: string,
  allData: torrentDataIdsType,
  ledlist: string[]
) {
  let page = 0;
  let hasMore = true;
  do {
    const details = await getNPHPUsertorrentHistory({
      page,
      uid
    });
    const parser = new DOMParser();
    const doc = parser.parseFromString(details, 'text/html');
    const tdList = doc.querySelectorAll('#claim-table td');
    tdList.forEach((v) => {
      const buttons = v.querySelectorAll('button');
      if (buttons.length > 0) {
        const {
          style: { display: display0 }
        } = buttons[0];
        const torrent_id = buttons[1].getAttribute('data-torrent_id')!;
        const claim_id = buttons[1].getAttribute('data-claim_id')!;

        const { innerText: innerText1 } = buttons[1];
        // 已经认领的种子 但是目前没有在做种的数据 代表可能删除了 所以 可以让用户判断是否删除该领种
        if (
          display0 === 'none' &&
          innerText1.includes('弃') &&
          !ledlist.includes(torrent_id)
        ) {
          allData.push({ id: claim_id });
        }
      }
    });
    page++;
    const nextPageLinkSelector = `a[href*="?uid=${uid}&page=${page}"]`;
    // 在传入的文档中查找下一页链接
    hasMore = Boolean(doc.querySelector(nextPageLinkSelector));
  } while (hasMore);
}
async function loadTorrents(ledlist: string[]) {
  const allData: torrentDataIdsType = [];
  const userid = getvl('id') || getvl('uid');
  await loadUserTorrents(userid, allData, ledlist);
  return allData;
}

// 初始化
let loading = false;
const button = document.createElement('button');
const ulbox = document.createElement('ul');
button.className = 'bubbly-button';
const div = document.createElement('div');
div.className = 'led-box';

div.appendChild(button);
div.appendChild(ulbox);
if (location.href.includes('userdetails.php')) {
  button.innerText = '一键认领';
  button.addEventListener('click', async (e: MouseEvent) => {
    if (loading) {
      e.preventDefault();
      return; // 防止重复点击
    }
    loading = true;
    button.disabled = true; // 禁用按钮以防重复点击
    button.innerText = '开始工作，为了网站和你自己的电脑速度调的很慢~~~';
    try {
      const msglist: { [key in string]: number } = {};
      const ledlist: string[] = [];
      animateButton(e);
      // 获取所有做种数据
      const allData: {
        id: string;
      }[] = await loadTorrents(ledlist);
      if (!allData.length) {
        button.innerText = '该站点可能不支持领种子。';
      }
      if (ledlist.length > 0) {
        msglist['已经认领过'] = ledlist.length;
      }
      ulbox.innerHTML = getLedMsg(msglist);
      // 开始领种 返回领种结果
      await handleLedTorrent(allData, button, msglist, 'addClaim');
      button.innerText = '一键认领完毕，刷新查看。';
      ulbox.innerHTML = getLedMsg(msglist);
    } catch (error: any) {
      console.error('Error: ', error);
      button.innerText = error.message;
    } finally {
      loading = false;
      button.disabled = false;
    }
  });
}

if (location.href.includes('claim.php')) {
  button.innerText = '一键弃种';
  ulbox.innerHTML = `<li>放弃本人没在做种的种子</li>`;
  button.addEventListener('click', async (e) => {
    if (confirm('真的要弃种吗?')) {
      button.innerText = '获取所有数据，请稍等。';
      // 获取所有在做种领取状态的数据
      const ledlist: string[] = [];
      const msglist: { [key in string]: number } = {};
      // 获取所有做种数据
      await loadTorrents(ledlist);
      ulbox.innerHTML =
        ulbox.innerHTML += `<li>获取所有在做种且领取状态的数据一共${ledlist.length}个</li>`;
      const uid = getvl('uid');
      const allData: torrentDataIdsType = [];
      button.innerText = '获取所有领种的数据';
      await loadUserTorrentsHistory(uid, allData, ledlist);
      ulbox.innerHTML += `<li>获取所有没在做种且领取状态的数据一共${allData.length}个</li>`;
      if (allData.length) {
        if (
          confirm(
            `目前有${allData.length}个可能不在做种状态，真的要放弃领种吗?`
          )
        ) {
          await handleLedTorrent(allData, button, msglist, 'removeClaim');
        }
      }
    }
  });
}
document.body.appendChild(div);
