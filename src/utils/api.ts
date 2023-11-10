/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:15:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-10 12:20:07
 * @Description:
 */

import request from './request';

/** 认领种子 */
export const getNPHPLedTorrent = (id: string) => {
  const body = new FormData();
  body.append('action', 'addClaim');
  body.append('params[torrent_id]', id + '');
  return request<PTAPI.LedTorrentDetails>(`/ajax.php`, {
    method: 'POST',
    body
  });
};

/** 获取用户种子详情 */
export const getNPHPUsertorrentlistajax = async (params: {
  page: number;
  userid: string;
}) => {
  return request<string>(
    `getusertorrentlistajax.php?page=${params.page}&userid=${params.userid}&type=seeding`,
    {
      method: 'GET'
    }
  );
};
