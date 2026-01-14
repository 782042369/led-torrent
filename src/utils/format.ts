/*
 * @Author: yanghongxuan
 * @Date: 2023-11-01 15:56:38
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2026-01-14 23:45:00
 * @Description: 格式化工具函数
 */

/**
 * 拼接提示信息为 HTML 列表
 *
 * @param msglist - 消息统计对象
 * @returns HTML 字符串
 */
export function getLedMsg(msglist: Record<string, number>) {
  let msgLi = ''
  Object.keys(msglist).forEach((e) => {
    msgLi += `<li>${e}: ${msglist[e]}</li>`
  })
  return msgLi
}
