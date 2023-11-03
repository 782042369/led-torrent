/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 14:46:20
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-03 15:17:16
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
  getNPHPUserTorrent,
  getNPHPUsertorrentlistajax
} from '@/utils/api';
import '@/utils/led-torrent.scss';
import { getvl } from './utils';
import getLedTorrentApiType from './utils/getLedTorrentApiType';

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
/** 支持 api 获取详情 */
/** 获取当前用户种子数据 */
async function getUserTorrent(page: number) {
  try {
    return await getNPHPUserTorrent({ page });
  } catch (error) {
    console.error('getUserTorrent error: ', error);
    throw new Error('查询用户领种信息异常');
  }
}
/** 支持 getusertorrentlistajax 获取详情 */
async function getUsertorrentlistajax(page: number, userid: string) {
  try {
    return await getNPHPUsertorrentlistajax({ page, userid });
  } catch (error) {
    console.error('getUsertorrentlistajax error: ', error);
    throw new Error('查询用户领种信息异常');
  }
}

/** 认领种子 */
async function handleLedTorrent(
  arr: {
    id: string;
  }[],
  button: HTMLButtonElement
) {
  const json: { [key in string]: number } = {};
  for (let i = 0; i < arr.length; i++) {
    button.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`;
    let data = await getNPHPLedTorrent(arr[i].id);
    if (!json[data.msg]) {
      json[data.msg] = 0;
    }
    json[data.msg] += 1;
  }
  return json;
}

// 初始化
let loading = false;
const button = document.createElement('button');
const ulbox = document.createElement('ul');
button.className = 'bubbly-button';
const div = document.createElement('div');
div.className = 'led-box';
button.addEventListener('click', async (e) => {
  if (loading) return;
  loading = true;
  button.innerText = '尝试多种方案请求中~~~';
  const type = await getLedTorrentApiType();
  button.innerText = '开始工作，为了网站和你自己的电脑速度调的很慢~~~';
  const allData: PTAPI.TorrentList['data'] = [];
  try {
    animateButton(e);
    let num = 1;
    if (type === 'api') {
      const list = await getUserTorrent(num);
      allData.push(...(list.data || []));
      while (list?.meta && list.meta.total > allData.length) {
        num++;
        const moreList = await getUserTorrent(num);
        if (moreList?.data) {
          allData.push(...moreList.data);
        }
      }
    }
    if (type === 'getusertorrentlistajax') {
      const userid = getvl('id');
      const onePoolarr: string[] = [];
      const fn = async (page: number) => {
        const list = await getUsertorrentlistajax(page, userid);
        const regex = /data-torrent_id="(\d+)"/g;
        let matches;
        while ((matches = regex.exec(list)) !== null) {
          !onePoolarr.includes(matches[1]) &&
            allData.push({
              id: matches[1]
            }),
            onePoolarr.push(matches[1]); // 提取捕获组中的值
        }
        if (regex.exec(list) !== null) {
          await fn(page + 1);
        }
      };
      await fn(0);
    }
    if (!allData.length) {
      button.innerText = '该站点可能不支持领种子。';
      return;
    }
    const msglist = await handleLedTorrent(allData, button);
    console.log('msglist: ', msglist);
    let msgLi = '';
    Object.keys(msglist).forEach((e) => {
      msgLi += `<li>${e}: ${msglist[e]}</li>`;
    });
    button.innerText = '一键认领完毕，刷新查看。';
    ulbox.innerHTML = msgLi;
  } catch (error: any) {
    console.error('Error: ', error);
    button.innerText = error.message;
  } finally {
    loading = false;
  }
});
button.innerText = '一键认领';
div.appendChild(button);
div.appendChild(ulbox);
document.body.appendChild(div);
