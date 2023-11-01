/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:15:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 14:08:44
 * @Description:
 */

/** 获取用户种子详情 */
export const getNPHPUserTorrent = (params: { page: number }) => {
  return fetch(`/api/user-seeding-torrent?page=${params.page}`, {
    method: 'get'
  });
};
/** 认领种子 */
export const getLedTorrent = (id: number) => {
  const body = new FormData();
  body.append('action', 'addClaim'), body.append('params[torrent_id]', id + '');
  return fetch(`/ajax.php`, {
    method: 'post',
    body
  });
};
