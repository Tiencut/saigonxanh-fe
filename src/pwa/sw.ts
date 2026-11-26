/// <reference lib="webworker" />
import { setCacheNameDetails, clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkOnly } from 'workbox-strategies';
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};
setCacheNameDetails({ prefix: 'fullstack-base-pwa', suffix: self.registration.scope });
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
clientsClaim();
// Authenticated/API traffic never falls back to data from another session.
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin && /^\/(api|socket\.io|uploads)(\/|$)/.test(url.pathname),
  new NetworkOnly(),
);
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [/^\/api(?:\/|$)/, /^\/socket\.io(?:\/|$)/, /^\/uploads(?:\/|$)/],
  }),
);
// Only build-generated immutable assets are cached. User uploads and arbitrary images are excluded.
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    /^\/assets\/[\w-]+-[\w-]+\.(js|css|woff2?)$/.test(url.pathname),
  new CacheFirst({ cacheName: 'fullstack-base-pwa-static' }),
);
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('push', (event) => {
  let payload: { title?: string; body?: string; url?: string; tag?: string } = {};
  try {
    payload = event.data?.json() || {};
  } catch {
    /* Invalid payload still produces a generic notification. */
  }
  const target = new URL(payload.url || '/notifications', self.location.origin);
  const url =
    target.origin === self.location.origin ? target.href : self.location.origin + '/notifications';
  event.waitUntil(
    self.registration.showNotification((payload.title || 'New notification').slice(0, 100), {
      body: (payload.body || 'Open the application to view details.').slice(0, 300),
      icon: '/pwa/icon-192.png',
      badge: '/pwa/icon-192.png',
      tag: payload.tag?.slice(0, 100),
      data: { url },
    }),
  );
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/notifications', self.location.origin),
    url =
      target.origin === self.location.origin
        ? target.href
        : self.location.origin + '/notifications';
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of windows) {
        if (new URL(client.url).origin === self.location.origin) {
          await client.navigate(url);
          await client.focus();
          return;
        }
      }
      await self.clients.openWindow(url);
    })(),
  );
});
