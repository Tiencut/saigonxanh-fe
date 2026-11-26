import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const configPath = process.env.APP_CONFIG_PATH || new URL('./app.config.json', import.meta.url);
const config = JSON.parse(readFileSync(configPath, 'utf8'));
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env };
  const apiTarget = process.env.API_PROXY_URL || env.VITE_API_URL || 'https://chungtayxanh.id.vn';
  const enabled = config.modules.pwa && env.VITE_ENABLE_PWA !== 'false';
  return {
    define: {
      __PWA_ENABLED__: JSON.stringify(enabled),
      __PROJECT_SLUG__: JSON.stringify(config.project_name),
    },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'base-brand',
        generateBundle() {
          if (!enabled)
            this.emitFile({
              type: 'asset',
              fileName: 'sw.js',
              source: `// PWA disabled: replace older workers without touching unrelated origin caches.
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('fullstack-base-pwa-'))await caches.delete(key);await self.clients.claim();await self.registration.unregister();})()));`,
            });
        },
        transformIndexHtml(html) {
          return html.replace(
            '<title>Fullstack Base</title>',
            `<title>${config.display_name.replace(/[<>&"']/g, '')}</title>`,
          );
        },
      },
      ...(enabled
        ? [
            VitePWA({
              strategies: 'injectManifest',
              srcDir: 'src/pwa',
              filename: 'sw.ts',
              registerType: 'prompt',
              injectRegister: false,
              includeAssets: ['pwa/*.png', 'icon.svg'],
              manifest: {
                id: '/',
                name: config.display_name,
                short_name: config.display_name.slice(0, 20),
                start_url: '/',
                scope: '/',
                display: 'standalone',
                background_color: config.theme.background,
                theme_color: config.theme.primary,
                lang: 'vi',
                icons: [
                  { src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                  { src: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                  {
                    src: '/pwa/maskable-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                  },
                ],
              },
              injectManifest: {
                globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
                maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
              },
              devOptions: { enabled: false },
            }),
          ]
        : []),
    ],
    server: {
      allowedHosts: ['chungtayxanh.id.vn','www.chungtayxanh.id.vn','saigonxanh.chungtayxanh.id.vn'],
      proxy: {
        '/api': {
          target: apiTarget,
          bypass(req) {
            if (req.url?.startsWith('/api-docs')) return '/index.html';
          },
        },
        '/socket.io': { target: apiTarget, ws: true },
      },
    },
  };
});
