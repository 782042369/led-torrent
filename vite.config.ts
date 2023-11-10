/*
 * @Author: yanghongxuan
 * @Date: 2023-11-03 14:45:13
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-10 12:25:13
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
        namespace: '方便用户一键领种',
        match: 'http*://*/userdetails.php?id=*',
        version: '0.7',
        name: '一键领种',
        author: 'waibuzheng',
        description: '努力支持多个站点一键领种'
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
