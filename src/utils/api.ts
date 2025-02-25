/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:15:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-04-02 16:18:38
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

export const getNPHPPterUsertorrentlistajax = async (params: {
  page: number;
  userid: string;
}) => {
  return request<string>(
    `getusertorrentlist.php?page=${params.page}&userid=${params.userid}&type=seeding`,
    {
      method: 'GET'
    }
  );
};
export const getNPHPPterLedTorrent = (id: string) => {
  const body = new FormData();

  return request<Boolean>(id, {
    method: 'POST',
    body
  });
};

/** 春天认领种子 */
export const getSSDLedTorrent = (id: string) => {
  const body = new FormData();
  body.append('action', 'add');
  body.append('id', id + '');
  return request<PTAPI.LedTorrentDetails>(`/adopt.php`, {
    method: 'POST',
    body
  });
};
/** 学校认领种子 */
export const getSchLedTorrent = (id: string) => {
  const body = new FormData();
  body.append('action', 'add');
  body.append('id', id + '');
  return request<PTAPI.LedTorrentDetails>(
    `/viewclaims.php?add_torrent_id=${id}`,
    {
      method: 'GET'
    }
  );
};
