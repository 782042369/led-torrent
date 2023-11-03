/*
 * @Author: yanghongxuan
 * @Date: 2023-11-03 14:45:13
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-11-03 14:58:44
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
        namespace: '一键领种',
        match:'http*://*/userdetails.php?id=*',
        version: '0.5',
        name: '一键领种',
        author: 'waibuzheng',
        description: '一键领种',
      },
      build: {
        externalGlobals: {
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
});
