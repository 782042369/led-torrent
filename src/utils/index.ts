/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 15:56:38
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-03 15:10:43
 * @Description:
 */
export function getvl(name: string) {
  var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
  if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, ' '));
  return '';
}
