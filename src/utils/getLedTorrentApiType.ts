/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 18:26:37
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-03 15:06:42
 * @Description:
 */
import { getNPHPUserTorrent } from './api';
type ApiType = 'api' | 'getusertorrentlistajax' | '404';

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
