import { useEffect, useSyncExternalStore, useState } from 'react';
import { Button, ConfirmDialog } from '@base/ui';
import { api, post, useAuth } from '../api';
import { useI18n } from '../i18n';
interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
type State = {
  online: boolean;
  installed: boolean;
  prompt: InstallPrompt | null;
  waiting: ServiceWorker | null;
  error: string;
  ready: boolean;
};
let state: State = {
  online: navigator.onLine,
  installed: matchMedia('(display-mode: standalone)').matches || !!(navigator as any).standalone,
  prompt: null,
  waiting: null,
  error: '',
  ready: false,
};
const listeners = new Set<() => void>();
function update(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((fn) => fn());
}
function usePwa() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => state,
  );
}
let initialized: Promise<void> | undefined;
function watch(reg: ServiceWorkerRegistration) {
  const inspect = () => {
    if (reg.waiting && navigator.serviceWorker.controller) update({ waiting: reg.waiting });
  };
  inspect();
  reg.addEventListener('updatefound', () => {
    const next = reg.installing;
    next?.addEventListener('statechange', inspect);
  });
  const check = () => {
    if (navigator.onLine) reg.update().catch(() => update({ error: 'updateFailed' }));
  };
  setInterval(check, 60 * 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) check();
  });
  window.addEventListener('online', check);
}
export async function cleanupPwa(projectName: string) {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter(
        (reg) =>
          reg.scope === location.origin + '/' &&
          [reg.active, reg.waiting, reg.installing].some(
            (w) => w && new URL(w.scriptURL).pathname === '/sw.js',
          ),
      )
      .map((reg) => reg.unregister()),
  );
  if ('caches' in window)
    await Promise.all(
      (await caches.keys())
        .filter((key) => key.startsWith('fullstack-base-pwa-') || key.startsWith(projectName + '-'))
        .map((key) => caches.delete(key)),
    );
}
export function initializePwa(projectName: string) {
  initialized ??= (async () => {
    window.addEventListener('online', () => update({ online: true }));
    window.addEventListener('offline', () => update({ online: false }));
    if (!__PWA_ENABLED__) {
      await cleanupPwa(projectName);
      return;
    }
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      update({ prompt: event as InstallPrompt });
    });
    window.addEventListener('appinstalled', () => update({ installed: true, prompt: null }));
    if (!isSecureContext || !('serviceWorker' in navigator)) {
      update({ error: 'unsupported' });
      return;
    }
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
      watch(reg);
      await navigator.serviceWorker.ready;
      update({ ready: true });
    } catch {
      update({ error: 'registrationFailed' });
    }
  })();
  return initialized;
}
const copy = {
  vi: {
    offline: 'Bạn đang ngoại tuyến. Các thay đổi cần kết nối mạng để lưu.',
    offlineTitle: 'Không có kết nối mạng',
    offlineBody: 'Ứng dụng đã mở được, nhưng cần kết nối mạng để đăng nhập và tải dữ liệu.',
    retry: 'Thử lại',
    update: 'Đã có phiên bản mới',
    refresh: 'Cập nhật',
    later: 'Để sau',
    confirm: 'Làm mới ứng dụng?',
    confirmBody:
      'Hãy lưu nội dung đang chỉnh sửa trước khi làm mới. Những thay đổi chưa lưu có thể bị mất.',
    install: 'Cài đặt ứng dụng',
    installed: 'Ứng dụng đã được cài đặt',
    installHint:
      'Nếu chưa có nút cài đặt, hãy mở menu trình duyệt và chọn cài đặt hoặc thêm vào màn hình chính.',
    ios: 'Trên iPhone/iPad: mở bằng Safari, chọn Chia sẻ → Thêm vào Màn hình chính.',
    push: 'Thông báo trên thiết bị',
    enable: 'Bật thông báo',
    disable: 'Tắt thông báo',
    denied: 'Thông báo đã bị chặn. Bạn có thể đổi quyền trong cài đặt trình duyệt.',
    unsupported: 'Trình duyệt hoặc môi trường này chưa hỗ trợ tính năng này.',
    notConfigured: 'Thông báo đẩy chưa được cấu hình trên máy chủ.',
    enabled: 'Thông báo đang bật trên thiết bị này.',
    disabled: 'Thông báo chưa bật trên thiết bị này.',
    registrationFailed: 'Không thể đăng ký chế độ ngoại tuyến. Hãy thử lại khi có mạng.',
    updateFailed: 'Chưa kiểm tra được phiên bản mới.',
    operationFailed: 'Không thể hoàn tất. Vui lòng thử lại.',
    dismissed: 'Bạn có thể cài đặt lại từ mục này bất cứ lúc nào.',
  },
  en: {
    offline: 'You are offline. Saving changes requires a connection.',
    offlineTitle: 'No network connection',
    offlineBody: 'The app shell is available. Connect to sign in and load your data.',
    retry: 'Try again',
    update: 'A new version is available',
    refresh: 'Update',
    later: 'Later',
    confirm: 'Refresh the application?',
    confirmBody: 'Save your work before refreshing. Unsaved changes may be lost.',
    install: 'Install application',
    installed: 'Application installed',
    installHint:
      'If no install button is available, open your browser menu and choose install or add to home screen.',
    ios: 'On iPhone/iPad: open in Safari, choose Share → Add to Home Screen.',
    push: 'Device notifications',
    enable: 'Enable notifications',
    disable: 'Disable notifications',
    denied: 'Notifications are blocked. Change permission in browser settings.',
    unsupported: 'This browser or environment does not support this feature.',
    notConfigured: 'Web push has not been configured on the server.',
    enabled: 'Notifications are enabled on this device.',
    disabled: 'Notifications are off on this device.',
    registrationFailed: 'Could not register offline support. Try again when connected.',
    updateFailed: 'Could not check for a new version.',
    operationFailed: 'Unable to complete. Please try again.',
    dismissed: 'You can install from this section later.',
  },
};
const useCopy = () => {
  const { locale } = useI18n();
  return copy[locale];
};
export function OfflineFallback() {
  const text = useCopy();
  return (
    <main className="offline-fallback">
      <h1>{text.offlineTitle}</h1>
      <p>{text.offlineBody}</p>
      <Button onClick={() => location.reload()}>{text.retry}</Button>
    </main>
  );
}
export function PwaUpdate() {
  const state = usePwa(),
    text = useCopy(),
    [confirm, setConfirm] = useState(false),
    [dismissed, setDismissed] = useState<ServiceWorker | null>(null);
  const apply = () => {
    if (!state.waiting) return;
    let done = false;
    const listener = () => {
      if (!done) {
        done = true;
        location.reload();
      }
    };
    navigator.serviceWorker.addEventListener('controllerchange', listener, { once: true });
    state.waiting.postMessage({ type: 'SKIP_WAITING' });
    setTimeout(() => {
      if (!done) {
        navigator.serviceWorker.removeEventListener('controllerchange', listener);
        update({ error: 'updateFailed' });
      }
    }, 15000);
    setConfirm(false);
  };
  return (
    <>
      {!state.online && (
        <div className="offline-banner" role="status">
          {text.offline}
        </div>
      )}
      {state.waiting && dismissed !== state.waiting && (
        <div className="pwa-update" role="status">
          <span>{text.update}</span>
          <Button onClick={() => setConfirm(true)}>{text.refresh}</Button>
          <Button variant="secondary" onClick={() => setDismissed(state.waiting)}>
            {text.later}
          </Button>
        </div>
      )}
      <ConfirmDialog
        open={confirm}
        title={text.confirm}
        description={text.confirmBody}
        variant="primary"
        confirmLabel={text.refresh}
        cancelLabel={text.later}
        onClose={() => setConfirm(false)}
        onConfirm={apply}
      />
    </>
  );
}
function keyBytes(value: string) {
  return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
}
export function PwaSettings() {
  const state = usePwa(),
    text = useCopy(),
    user = useAuth((s) => s.user),
    [push, setPush] = useState<PushSubscription | null>(null),
    [available, setAvailable] = useState(false),
    [publicKey, setKey] = useState(''),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [denied, setDenied] = useState(
      'Notification' in window && Notification.permission === 'denied',
    );
  const supported =
    'Notification' in window &&
    'PushManager' in window &&
    isSecureContext &&
    'serviceWorker' in navigator;
  useEffect(() => {
    if (!__PWA_ENABLED__ || !supported || !user || !state.ready) return;
    let active = true;
    Promise.all([
      api('/push/config'),
      navigator.serviceWorker.ready.then((reg) => reg.pushManager.getSubscription()),
    ])
      .then(([config, subscription]) => {
        if (active) {
          setAvailable(config.enabled);
          setKey(config.publicKey || '');
          setPush(subscription);
        }
      })
      .catch(() => {
        if (active) setMessage(text.operationFailed);
      });
    return () => {
      active = false;
    };
  }, [user?.id, supported, state.ready, text.operationFailed]);
  async function toggle() {
    setBusy(true);
    setMessage('');
    try {
      const reg = await navigator.serviceWorker.ready;
      if (push) {
        await post('/push/unsubscribe', { endpoint: push.endpoint });
        await push.unsubscribe();
        setPush(null);
      } else {
        const permission = await Notification.requestPermission();
        setDenied(permission === 'denied');
        if (permission !== 'granted') return;
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: keyBytes(publicKey),
        });
        try {
          await post('/push/subscribe', subscription.toJSON());
          setPush(subscription);
        } catch (error) {
          await subscription.unsubscribe();
          throw error;
        }
      }
    } catch {
      setMessage(text.operationFailed);
    } finally {
      setBusy(false);
    }
  }
  if (!__PWA_ENABLED__) return null;
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return (
    <section className="pwa-settings">
      <h2>{text.install}</h2>
      {state.installed ? (
        <p>{text.installed}</p>
      ) : state.prompt ? (
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            const event = state.prompt!;
            update({ prompt: null });
            await event.prompt();
            const choice = await event.userChoice;
            if (choice.outcome === 'dismissed') setMessage(text.dismissed);
          }}
        >
          {text.install}
        </Button>
      ) : (
        <p className="muted">{ios ? text.ios : text.installHint}</p>
      )}
      {state.error && (
        <p role="status" className="muted">
          {text[state.error as keyof typeof text] || text.operationFailed}
        </p>
      )}
      <h3>{text.push}</h3>
      {!supported ? (
        <p className="muted">{text.unsupported}</p>
      ) : !available ? (
        <p className="muted">{text.notConfigured}</p>
      ) : denied ? (
        <p className="muted">{text.denied}</p>
      ) : (
        <>
          <p className="muted">{push ? text.enabled : text.disabled}</p>
          <Button
            type="button"
            variant="secondary"
            loading={busy}
            disabled={!state.ready || !state.online}
            onClick={toggle}
          >
            {push ? text.disable : text.enable}
          </Button>
        </>
      )}
      {message && <p role="status">{message}</p>}
    </section>
  );
}
