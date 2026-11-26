import { create } from 'zustand';
import { detachPush } from './pwa/push-client';
export type UserView = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  locale: string;
  active: boolean;
  roles: string[];
  permissions: string[];
  totpEnabled: boolean;
  emailVerifiedAt?: string | null;
};
export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
    public details?: any,
  ) {
    super(code);
  }
}
let accessToken = '';
export const authEvents = new EventTarget();
function setAccessToken(value: string) {
  accessToken = value;
  authEvents.dispatchEvent(new Event('token'));
}
let refreshPromise: Promise<void> | undefined;
const storageKey = 'base.csrf';
async function refresh() {
  const csrf = sessionStorage.getItem(storageKey);
  if (!csrf) throw new ApiError('UNAUTHENTICATED', 401);
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    headers: { 'X-CSRF-Token': csrf },
  });
  const result = await response.json();
  if (!response.ok) throw new ApiError(result.error?.code || 'UNAUTHENTICATED', response.status);
  setAccessToken(result.data.accessToken);
}
const RESERVED_PLATFORM_PREFIXES = new Set([
  'organizations',
  'activities',
  'join',
  'login',
  'register',
  'account',
  'reset',
  'verify',
  'forgot',
  'legal',
  'api',
  'assets',
  'images',
  'admin',
  'map',
]);

export function getActiveOrgSlug(): string | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  if (!segments.length) return null;
  const first = segments[0].toLowerCase();
  if (RESERVED_PLATFORM_PREFIXES.has(first)) return null;
  if (/^[a-z0-9_-]{2,50}$/.test(first)) {
    return first;
  }
  return null;
}

export async function request<T = any>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<{ data: T; meta?: { page: number; pageSize: number; total: number } }> {
  const orgSlug = getActiveOrgSlug();
  const response = await fetch('/api' + path, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: 'Bearer ' + accessToken } : {}),
      ...(orgSlug ? { 'X-Organization-Slug': orgSlug } : {}),
      ...options.headers,
    },
  });
  if (
    response.status === 401 &&
    retry &&
    !path.startsWith('/auth/login') &&
    !path.startsWith('/auth/register') &&
    sessionStorage.getItem(storageKey)
  ) {
    try {
      refreshPromise ??= refresh().finally(() => {
        refreshPromise = undefined;
      });
      await refreshPromise;
      return request<T>(path, options, false);
    } catch (error) {
      if (error instanceof ApiError && [401, 403].includes(error.status))
        useAuth.getState().clear();
    }
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw Object.assign(new ApiError(
      result.error?.code || 'REQUEST_FAILED',
      response.status,
      result.error?.details,
    ), { message: result.error?.message || result.error?.code || 'Không thể xử lý yêu cầu' });
  return result;
}
export const api = async <T = any>(path: string, options: RequestInit = {}) => {
  const result: any = await request<T>(path, options);
  return result && typeof result === 'object' && 'data' in result ? result.data : result;
};
export const post = <T = any>(path: string, body: unknown = {}) =>
  api<T>(path, { method: 'POST', body: JSON.stringify(body) });
export const patch = <T = any>(path: string, body: unknown) =>
  api<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
export const getAccessToken = () => accessToken;
export const useAuth = create<{
  user: UserView | null;
  loading: boolean;
  login: (body: unknown, register?: boolean) => Promise<void>;
  acceptSession: (result: { accessToken: string; csrfToken: string; user: UserView }) => void;
  init: () => Promise<void>;
  reload: () => Promise<void>;
  logout: () => Promise<void>;
  clear: () => void;
}>((set, get) => ({
  user: null,
  loading: true,
  acceptSession: (result) => {
    setAccessToken(result.accessToken);
    sessionStorage.setItem(storageKey, result.csrfToken);
    set({ user: result.user, loading: false });
  },
  clear: () => {
    setAccessToken('');
    sessionStorage.removeItem(storageKey);
    set({ user: null, loading: false });
  },
  login: async (body, register = false) => {
    const result = await post('/auth/' + (register ? 'register' : 'login'), body);
    get().acceptSession(result);
  },
  init: async () => {
    try {
      if (sessionStorage.getItem(storageKey)) {
        refreshPromise ??= refresh().finally(() => {
          refreshPromise = undefined;
        });
        await refreshPromise;
        await get().reload();
      }
    } catch (error) {
      if (error instanceof ApiError && [401, 403].includes(error.status)) get().clear();
    } finally {
      set({ loading: false });
    }
  },
  reload: async () => set({ user: await api('/auth/me') }),
  logout: async () => {
    try {
      await detachPush((endpoint) => post('/push/unsubscribe', { endpoint })).catch(() => {});
      await post('/auth/logout');
    } finally {
      get().clear();
    }
  },
}));
export async function fileUrl(id: string) {
  const response = await fetch('/api/files/' + id + '/content', {
    headers: { Authorization: 'Bearer ' + accessToken },
  });
  if (!response.ok) throw new Error('Image unavailable');
  return URL.createObjectURL(await response.blob());
}

export async function downloadExport(format: 'csv' | 'xlsx') {
  async function fetchFile() {
    return fetch('/api/transfers/items/export?format=' + format, {
      credentials: 'include',
      cache: 'no-store',
      headers: { Authorization: 'Bearer ' + accessToken },
    });
  }
  let response = await fetchFile();
  if (response.status === 401 && sessionStorage.getItem(storageKey)) {
    refreshPromise ??= refresh().finally(() => {
      refreshPromise = undefined;
    });
    await refreshPromise;
    response = await fetchFile();
  }
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new ApiError(result.error?.code || 'REQUEST_FAILED', response.status);
  }
  const url = URL.createObjectURL(await response.blob()),
    anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'items.' + format;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
