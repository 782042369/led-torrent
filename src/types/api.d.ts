/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 16:02:41
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 18:57:50
 * @Description:
 */
namespace PTAPI {
  /** 用户做种列表 */
  interface TorrentList {
    data?: {
      id: string;
    }[];
    meta?: {
      to: number;
      total: number;
    };
  }
  /** 领取种子结果详情 */
  interface LedTorrentDetails {
    msg: string | 'OK';
    ret: -1 | 0;
  }
}
