/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 14:46:20
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-10 13:39:48
 * @Description:
 */
/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:48:49
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 15:56:10
 * @Description:
 */
import { getNPHPLedTorrent, getNPHPUsertorrentlistajax } from '@/utils/api';
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
/** 认领种子 */
async function handleLedTorrent(
  arr: torrentDataIdsType,
  button: HTMLButtonElement,
  json: { [key in string]: number }
) {
  for (let i = 0; i < arr.length; i++) {
    button.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`;
    try {
      let data = await getNPHPLedTorrent(arr[i].id);
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
  msglist: { [key in string]: number }
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
        const torrent_id = buttons[0].getAttribute('data-torrent_id');
        const {
          innerText: innerText1,
          style: { display: display1 }
        } = buttons[1];
        // 需要认领的种子
        if (innerText0.includes('领') && display1 === 'none' && torrent_id) {
          allData.push({ id: torrent_id });
        }
        if (display0 === 'none' && innerText1.includes('弃')) {
          msglist['已经认领过'] = (msglist['已经认领过'] || 0) + 1;
        }
      }
    });
    page++;
    const nextPageLinkSelector = `a[href*="getusertorrentlistajax.php?page=${page}"]`;
    // 在传入的文档中查找下一页链接
    hasMore = Boolean(doc.querySelector(nextPageLinkSelector));
  } while (hasMore);
}
async function loadTorrents(msglist: { [key in string]: number }) {
  const allData: torrentDataIdsType = [];
  const userid = getvl('id');
  await loadUserTorrents(userid, allData, msglist);
  return allData;
}

// 初始化
let loading = false;
const button = document.createElement('button');
const ulbox = document.createElement('ul');
button.className = 'bubbly-button';
const div = document.createElement('div');
div.className = 'led-box';
async function onButtonClicked(e: MouseEvent) {
  if (loading) {
    e.preventDefault();
    return; // 防止重复点击
  }
  loading = true;
  button.disabled = true; // 禁用按钮以防重复点击
  button.innerText = '开始工作，为了网站和你自己的电脑速度调的很慢~~~';
  try {
    const msglist: { [key in string]: number } = {};
    animateButton(e);
    // 获取所有做种数据
    const allData: {
      id: string;
    }[] = await loadTorrents(msglist);
    if (!allData.length) {
      button.innerText = '该站点可能不支持领种子。';
    }
    ulbox.innerHTML = getLedMsg(msglist);
    // 开始领种 返回领种结果
    await handleLedTorrent(allData, button, msglist);
    button.innerText = '一键认领完毕，刷新查看。';
    ulbox.innerHTML = getLedMsg(msglist);
  } catch (error: any) {
    console.error('Error: ', error);
    button.innerText = error.message;
  } finally {
    loading = false;
    button.disabled = false;
  }
}
button.addEventListener('click', onButtonClicked);
button.innerText = '一键认领';
div.appendChild(button);
div.appendChild(ulbox);
document.body.appendChild(div);
