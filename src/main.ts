/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 14:46:20
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-06 12:10:37
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
import getLedTorrentApiType, {
  ApiType,
  torrentDataIds
} from './utils/getLedTorrentApiType';
// 建立一个初始化函数来封装所有的逻辑
async function ledTorrentInit() {
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
    arr: torrentDataIds,
    button: HTMLButtonElement
  ) {
    const json: { [key in string]: number } = {};
    for (let i = 0; i < arr.length; i++) {
      button.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`;
      try {
        let data = await getNPHPLedTorrent(arr[i].id);
        const msg = data.msg || '领种接口返回信息错误';
        if (!json[msg]) {
          json[msg] = 0;
        }
        json[msg] += 1;
      } catch (error) {
        console.error('handleLedTorrent error: ', error);
      }
    }
    return json;
  }
  function getLedMsg(msglist: Record<string, number>) {
    let msgLi = '';
    Object.keys(msglist).forEach((e) => {
      msgLi += `<li>${e}: ${msglist[e]}</li>`;
    });
    return msgLi;
  }
  async function loadUserTorrents(userid: string, allData: torrentDataIds) {
    let page = 0;
    let hasMore = true;
    const onePoolarr = new Set(); // 使用 Set 来存储唯一值

    do {
      const list = await getUsertorrentlistajax(page, userid);
      const regex = /data-torrent_id="(\d+)"/g;
      let matches;
      while ((matches = regex.exec(list)) !== null) {
        if (!onePoolarr.has(matches[1])) {
          allData.push({ id: matches[1] });
          onePoolarr.add(matches[1]);
        }
      }
      // 检查是否存在更多的 torrent_id 来更新 hasMore 的状态
      hasMore = regex.test(list);
      page++;
    } while (hasMore);
  }
  async function loadUserTorrentsApi(allData: torrentDataIds) {
    let num = 1;
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
  async function loadTorrents(type: ApiType) {
    const allData: torrentDataIds = [];
    if (type === 'api') {
      await loadUserTorrentsApi(allData);
    }
    if (type === 'getusertorrentlistajax') {
      const userid = getvl('id');
      await loadUserTorrents(userid, allData);
    }
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
    button.innerText = '尝试多种方案请求中~~~';
    const type = await getLedTorrentApiType();
    button.innerText = '开始工作，为了网站和你自己的电脑速度调的很慢~~~';
    try {
      animateButton(e);
      // 获取所有做种数据
      const allData: {
        id: string;
      }[] = await loadTorrents(type);
      if (!allData.length) {
        button.innerText = '该站点可能不支持领种子。';
      }
      // 开始领种 返回领种结果
      const msglist = await handleLedTorrent(allData, button);
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
}
// 调用初始化函数
ledTorrentInit();
