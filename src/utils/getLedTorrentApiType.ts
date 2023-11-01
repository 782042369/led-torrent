/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 18:26:37
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-01 18:48:11
 * @Description:
 */
type ApiType = 'api' | 'getusertorrentlistajax';
const json = {
  /** api */
  api: ['zmpt.cc'],
  /** 页面爬取 */
  getusertorrentlistajax: ['hdfans.org']
};
// 支持哪种类型的领种
export default function () {
  console.log('window.location.origin: ', window.location.host);
  return (Object.keys(json) as ApiType[]).find((v) => {
    if (json[v].includes(window.location.host)) {
      return v;
    }
    return false;
  });
}
export function getvl(name: string) {
  var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
  if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, ' '));
  return '';
}
