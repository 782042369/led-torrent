/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:15:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 16:17:10
 * @Description:
 */

import request from './utils/request';

/** 获取用户种子详情 */
export const getNPHPUserTorrent = async (params: { page: number }) => {
  return request<PTAPI.TorrentList>(
    `/api/user-seeding-torrent?page=${params.page}`,
    {
      method: 'GET'
    }
  );
};
/** 认领种子 */
export const getLedTorrent = (id: number) => {
  const body = new FormData();
  body.append('action', 'addClaim'), body.append('params[torrent_id]', id + '');
  return request<PTAPI.LedTorrentDetails>(`/ajax.php`, {
    method: 'POST',
    body
  });
};
