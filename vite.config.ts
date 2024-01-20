/*
 * @Author: yanghongxuan
 * @Date: 2023-11-03 14:45:13
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2024-01-20 16:01:46
 * @Description:
 */
import { resolve } from 'path';
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://image.zmpt.cc/imgs/2023/11/5c60a64ce9d1104a.png',
        namespace: '方便用户一键领种、弃种',
        match: [
          'http*://*/userdetails.php?id=*',
          'http*://*/claim.php?uid=*',
          'http*://pterclub.com/getusertorrentlist.php?*'
        ],
        version: '1.0',
        name: '一键领种、弃种',
        author: 'waibuzheng',
        description:
          '努力支持多个站点一键领种、一键放弃本人没在做种的种子（慎用、测试可用）'
      },
      build: {
        externalGlobals: {}
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
