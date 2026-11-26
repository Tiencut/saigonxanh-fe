import { useEffect, useRef, useState } from 'react';
import { api, post, useAuth } from '../../api';

type GoogleClient = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        nonce: string;
        callback: (response: { credential: string }) => void;
      }) => void;
      renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
    };
  };
};
let scriptPromise: Promise<void> | undefined;
function loadGoogle() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    if ((window as any).google?.accounts?.id) return resolve();
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = undefined;
      script.remove();
      reject(new Error('Không tải được Google. Vui lòng dùng email và mật khẩu.'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function GoogleSignIn({
  termsVersion,
  totp,
  onSuccess,
  onError,
}: {
  termsVersion: string;
  totp: string;
  onSuccess: () => void;
  onError: (error: unknown) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const latest = useRef({ onSuccess, onError, totp });
  latest.current = { onSuccess, onError, totp };
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setLoadError('');
    let active = true;
    let observer: ResizeObserver | undefined;
    Promise.all([api<{ clientId: string; nonce: string }>('/auth/google/challenge'), loadGoogle()])
      .then(([challenge]) => {
        if (!active || !container.current) return;
        const google = (window as unknown as { google: GoogleClient }).google;
        google.accounts.id.initialize({
          client_id: challenge.clientId,
          nonce: challenge.nonce,
          callback: async (response) => {
            if (!active) return;
            setBusy(true);
            try {
              const session = await post('/auth/google', {
                credential: response.credential,
                acceptTerms: true,
                termsVersion,
                totp: latest.current.totp,
              });
              useAuth.getState().acceptSession(session);
              latest.current.onSuccess();
            } catch (error) {
              if (active) latest.current.onError(error);
            } finally {
              if (active) setBusy(false);
            }
          },
        });
        const render = () => {
          if (!container.current) return;
          container.current.replaceChildren();
          google.accounts.id.renderButton(container.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            locale: 'vi',
            width: Math.min(400, Math.floor(container.current.clientWidth) || 280),
          });
        };
        render();
        observer = new ResizeObserver(render);
        observer.observe(container.current);
      })
      .catch((error) => {
        if (active)
          setLoadError(
            error instanceof Error ? error.message : 'Không tải được Google. Vui lòng thử lại.',
          );
      });
    return () => {
      active = false;
      observer?.disconnect();
      container.current?.replaceChildren();
    };
  }, [attempt, termsVersion]);
  return (
    <div className="sgx-google-signin" aria-busy={busy}>
      <div ref={container} className="sgx-google-button-host" />
      {loadError && (
        <div role="alert">
          <p>{loadError}</p>
          <button type="button" className="sgx-auth-link" onClick={() => setAttempt((n) => n + 1)}>
            Thử lại Google
          </button>
        </div>
      )}
      {busy && <p role="status">Đang đăng nhập…</p>}
    </div>
  );
}
