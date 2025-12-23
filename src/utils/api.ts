/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 12:15:00
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-04-02 16:18:38
 * @Description:
 */

import request from './request'

/** 认领种子 */
export function getNPHPLedTorrent(id: string, type: 'removeClaim' | 'addClaim') {
  const body = new FormData()
  if (type === 'addClaim') {
    body.append('action', 'addClaim')
    body.append('params[torrent_id]', `${id}`)
  }
  else {
    body.append('action', 'removeClaim')
    body.append('params[id]', `${id}`)
  }
  return request<PTAPI.LedTorrentDetails>(`/ajax.php`, {
    method: 'POST',
    body,
  })
}

/** 获取用户种子详情 */
export async function getNPHPUsertorrentlistajax(params: {
  page: number
  userid: string
  type: 'seeding'
}) {
  return request<string>(
    'getusertorrentlistajax.php',
    {
      method: 'GET',
      params,
    },
  )
}

/** 获取用户领取过的种子详情 */
export async function getNPHPUsertorrentHistory(params: {
  page: number
  uid: string
}) {
  return request<string>('claim.php', {
    method: 'GET',
    params,
  })
}
/** 猫站种子列表 */
export async function getNPHPPterUsertorrentlistajax(params: {
  page: number
  userid: string
  type: 'seeding'
}) {
  return request<string>(
    'getusertorrentlist.php',
    {
      method: 'GET',
      params,
    },
  )
}
/** 猫站领取种子 */
export function getNPHPPterLedTorrent(id: string) {
  const body = new FormData()

  return request<boolean>(id, {
    method: 'POST',
    body,
  })
}

/** 春天认领种子 */
export function getSSDLedTorrent(id: string) {
  const body = new FormData()
  body.append('action', 'add')
  body.append('id', `${id}`)
  return request<PTAPI.LedTorrentDetails>(`/adopt.php`, {
    method: 'POST',
    body,
  })
}
/** 学校认领种子 */
// export function getSchLedTorrent(id: string) {
//   const body = new FormData()
//   body.append('action', 'add')
//   body.append('id', `${id}`)
//   return request<PTAPI.LedTorrentDetails>(
//     `/viewclaims.php?add_torrent_id=${id}`,
//     {
//       method: 'GET',
//       params:{

//       }
//     },
//   )
// }
