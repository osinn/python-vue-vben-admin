import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        createSvgIconsPlugin({
          iconDirs: [
            path.resolve(process.cwd(),'src/assets/svg')
          ],
          symbolId: 'icon-[dir]-[name]'
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:9990/api',
            ws: true,
          },
        },
      },
    },
  };
});
