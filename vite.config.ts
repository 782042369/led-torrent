import webExtension from '@samrum/vite-plugin-web-extension';
import { resolve } from 'path';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';
import manifest from './src/manifest';
// https://vitejs.dev/config/
export default ({ mode, command }) => {
  console.log(mode, command);
  return defineConfig({
    root: './src/',
    base: '/',
    envDir: '../',
    publicDir: '../public',
    plugins: [
      webExtension({
        manifest: {
          ...manifest
        }
      })
    ],
    define: {
      'process.env': {}
    },
    server: {
      host: '0.0.0.0',
      port: 9999,
      strictPort: true,
      open: true
    },
    css: {
      devSourcemap: true
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      cssCodeSplit: true,
      sourcemap: true,
      rollupOptions: {
        plugins: [nodePolyfills()],
        input: {
          main: resolve(__dirname, './src/index.html')
        },
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/name-[hash].[ext]'
        }
      }
    }
  });
};
