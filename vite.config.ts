/*
 * @Author: yanghongxuan
 * @Date: 2023-11-03 14:45:13
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2025-02-20 13:54:08
 * @Description:
 */
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://lsky.939593.xyz:11111/Y7bbx9.jpg',
        namespace: '方便用户一键领种、弃种',
        match: [
          'http*://*/userdetails.php?id=*',
          'http*://*/claim.php?uid=*',
          'http*://pterclub.com/getusertorrentlist.php?*',
        ],
        version: '1.6',
        name: '一键领种、弃种',
        author: 'waibuzheng',
        description:
          '努力支持多个站点一键领种、一键放弃本人没在做种的种子（慎用、测试可用）',
      },
      build: {
        externalGlobals: {},
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
