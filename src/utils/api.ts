/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:15:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-11 21:31:01
 * @Description:
 */

import request from './request';

/** 认领种子 */
export const getNPHPLedTorrent = (
  id: string,
  type: 'removeClaim' | 'addClaim'
) => {
  const body = new FormData();
  if (type === 'addClaim') {
    body.append('action', 'addClaim');
    body.append('params[torrent_id]', id + '');
  } else {
    body.append('action', 'removeClaim');
    body.append('params[id]', id + '');
  }
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

/** 获取用户领取过的种子详情 */
export const getNPHPUsertorrentHistory = async (params: {
  page: number;
  uid: string;
}) => {
  return request<string>(`claim.php?page=${params.page}&uid=${params.uid}`, {
    method: 'GET'
  });
};
