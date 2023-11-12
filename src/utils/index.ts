/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 15:56:38
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-12 15:48:21
 * @Description:
 */
export function getvl(name: string) {
  var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
  if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, ' '));
  return '';
}
/** 检查是否有下一页 */
export function checkForNextPage(
  doc: Document,
  nextPageLinkSelector: string
): boolean {
  return Boolean(doc.querySelector(nextPageLinkSelector));
}
/** 按钮动画效果 */
export function animateButton(e: MouseEvent) {
  e.preventDefault;
  if (e.target && e.target instanceof Element) {
    const target = e.target;
    target.classList.remove('animate');
    target.classList.add('animate');
    setTimeout(() => {
      target.classList.remove('animate');
    }, 700);
  }
}
/** 提示信息拼接 */
export function getLedMsg(msglist: Record<string, number>) {
  let msgLi = '';
  Object.keys(msglist).forEach((e) => {
    msgLi += `<li>${e}: ${msglist[e]}</li>`;
  });
  return msgLi;
}
