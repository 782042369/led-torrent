/*
 * @Author: yanghongxuan
 * @Date: 2024-03-27 09:52:03
 * @Description:
 * @LastEditTime: 2024-03-27 09:52:24
 * @LastEditors: yanghongxuan
 */

import { torrentDataIdsType } from './main';
import { checkForNextPage } from './utils';
import {
  getNPHPPterLedTorrent,
  getNPHPPterUsertorrentlistajax
} from './utils/api';

/** 查找猫站历史做种且领种数据 */
export async function loadPterUserTorrents(
  userid: string,
  allData: torrentDataIdsType,
  ledlist: string[]
) {
  let page = 0;
  let hasMore = true;
  do {
    const details = await getNPHPPterUsertorrentlistajax({
      page,
      userid
    });
    const parser = new DOMParser();
    const doc = parser.parseFromString(details, 'text/html');
    const claimDoms = doc.querySelectorAll('.claim-confirm');
    const removeDoms = doc.querySelectorAll('.remove-confirm');
    claimDoms.forEach((v) => {
      const id = v.getAttribute('data-url') || '';
      if (!allData.includes(id)) {
        allData.push(id);
      }
    });
    removeDoms.forEach((v) => {
      const id = v.getAttribute('data-url') || '';
      if (!ledlist.includes(id)) {
        ledlist.push(id);
      }
    });
    page++;
    // 在传入的文档中查找下一页链接
    hasMore = checkForNextPage(
      doc,
      `a[href*="?userid=${userid}&type=seeding&page=${page}"]`
    );
  } while (hasMore);
}
// 猫站认领种子接口
export async function handleLedPterTorrent(
  arr: torrentDataIdsType,
  button: HTMLButtonElement,
  json: { [key in string]: number }
) {
  for (let i = 0; i < arr.length; i++) {
    button.innerHTML = `努力再努力 ${arr.length} / ${i + 1}`;
    try {
      let data = await getNPHPPterLedTorrent(arr[i]);
      const msg = data ? '领取成功' : '领取失败';
      json[msg] = (json[msg] || 0) + 1;
    } catch (error) {
      console.error('handleLedTorrent error: ', error);
    }
  }
}
