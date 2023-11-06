/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 18:26:37
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-06 12:00:43
 * @Description:
 */
import { getNPHPUserTorrent } from './api';
export type ApiType = 'api' | 'getusertorrentlistajax' | '404';
export type torrentDataIds = {
  id: string;
}[];
// 支持哪种类型的领种
export default function () {
  return new Promise<ApiType>((resolve) => {
    getNPHPUserTorrent({
      page: 1
    })
      .then(() => {
        resolve('api');
      })
      .catch(() => {
        resolve('getusertorrentlistajax');
      });
  });
}
