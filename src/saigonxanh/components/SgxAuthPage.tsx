import { OrganizationLogo, OrganizationName } from '../../organizations/OrganizationBrand';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, LoaderCircle, ShieldCheck } from 'lucide-react';
import { api, ApiError, useAuth } from '../../api';
import type { PublicConfig } from '../../App';
import { GoogleSignIn } from './GoogleSignIn';
import { AuthField } from './AuthField';
import { AuthMobileNav } from './AuthMobileNav';
import { useAuthViewport } from './useAuthViewport';
import './sgxAuth.css';
import './ecoAuth.css';

function authError(error: unknown) {
  const code = error instanceof ApiError ? error.code : '';
  const messages: Record<string, string> = {
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
    ACCOUNT_THROTTLED: 'Bạn đã thử nhiều lần. Vui lòng chờ rồi thử lại.',
    TOTP_REQUIRED: 'Tài khoản đã bật xác thực hai bước. Vui lòng nhập mã xác thực.',
    TOTP_INVALID: 'Mã xác thực không đúng.',
    RATE_LIMITED: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
    ALREADY_EXISTS: 'Email này đã được đăng ký. Hãy đăng nhập hoặc đặt lại mật khẩu.',
    TERMS_CHANGED: 'Điều khoản đã thay đổi. Vui lòng tải lại trang.',
    GOOGLE_NOT_CONFIGURED: 'Đăng nhập Google chưa được cấu hình.',
    GOOGLE_TOKEN_INVALID: 'Không xác minh được tài khoản Google. Vui lòng thử lại.',
    GOOGLE_ACCOUNT_EXISTS: 'Email đã có tài khoản. Vui lòng đăng nhập bằng mật khẩu.',
  };
  return (
    messages[code] ||
    (error instanceof TypeError
      ? 'Không thể kết nối. Vui lòng thử lại.'
      : 'Không thể đăng nhập. Vui lòng kiểm tra thông tin và thử lại.')
  );
}

export function SgxAuthPanel({
  config: initialConfig,
  register: initialRegister = false,
  onSuccess,
}: {
  config?: PublicConfig;
  register?: boolean;
  onSuccess: () => void;
}) {
  const [config, setConfig] = useState(initialConfig),
    [register, setRegister] = useState(initialRegister);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    totp: '',
    acceptTerms: false,
  });
  const [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [needsTotp, setNeedsTotp] = useState(false);
  const keyboardOpen = useAuthViewport();
  useEffect(() => {
    setRegister(initialRegister);
    setError('');
  }, [initialRegister]);
  useEffect(() => {
    if (!initialConfig)
      api<PublicConfig>('/public/config')
        .then(setConfig)
        .catch(() => setError('Không tải được cấu hình. Vui lòng mở lại trang.'));
  }, [initialConfig]);
  const handleError = (err: unknown) => {
    setError(authError(err));
    if (err instanceof ApiError && err.code === 'TOTP_REQUIRED') setNeedsTotp(true);
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !config) return;
    setBusy(true);
    setError('');
    try {
      await useAuth
        .getState()
        .login(
          { ...form, email: form.email.trim().toLowerCase(), termsVersion: config.termsVersion },
          register,
        );
      onSuccess();
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="sgx-auth-panel sgx-eco-auth-panel" data-keyboard-open={keyboardOpen}>
      <Link to="/" className="sgx-auth-brand">
        <OrganizationLogo alt="" />
        <span>
          <strong><OrganizationName /></strong>
          <small>Vì một thành phố sạch và xanh hơn</small>
        </span>
      </Link>
      <h1>{register ? 'Tạo tài khoản' : 'Đăng nhập'}</h1>
      <p className="sgx-auth-intro">Dùng chung tài khoản trên website và ứng dụng mobile.</p>
      {config?.authentication?.google && (
        <>
          <GoogleSignIn
            termsVersion={config.termsVersion}
            totp={form.totp}
            onSuccess={onSuccess}
            onError={handleError}
          />
          <p className="sgx-auth-divider">Hoặc</p>
        </>
      )}
      <form onSubmit={submit} aria-busy={busy}>
        <fieldset disabled={busy || !config}>
          {register && (
            <AuthField
              name="name"
              label="Họ tên"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              placeholder="Nhập họ tên của bạn"
              value={form.name}
              onChange={(name) => setForm({ ...form, name })}
            />
          )}
          <AuthField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Nhập email của bạn"
            value={form.email}
            onChange={(email) => setForm({ ...form, email })}
          />
          <AuthField
            name="password"
            label="Mật khẩu"
            type="password"
            autoComplete={register ? 'new-password' : 'current-password'}
            minLength={8}
            maxLength={128}
            placeholder="Nhập mật khẩu"
            value={form.password}
            onChange={(password) => setForm({ ...form, password })}
          />
          {register && (
            <small className="sgx-auth-password-hint">Mật khẩu có ít nhất 8 ký tự.</small>
          )}
          {needsTotp && (
            <AuthField
              name="totp"
              label="Mã xác thực hai bước"
              autoComplete="one-time-code"
              required={false}
              value={form.totp}
              onChange={(totp) => setForm({ ...form, totp })}
            />
          )}
          {!register && config?.authentication?.emailDelivery && (
            <div className="sgx-auth-options">
              <Link to="/forgot">Quên mật khẩu?</Link>
            </div>
          )}
          {register && (
            <label className="sgx-auth-terms">
              <input
                type="checkbox"
                required
                checked={form.acceptTerms}
                onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
              />
              <span>
                Tôi đồng ý{' '}
                <Link to="/legal/terms" target="_blank">
                  điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link to="/legal/privacy" target="_blank">
                  chính sách bảo mật
                </Link>
                .
              </span>
            </label>
          )}
          {error && (
            <p role="alert" className="sgx-auth-error">
              {error}
            </p>
          )}
          <button className="sgx-auth-submit" type="submit">
            {busy && <LoaderCircle size={19} className="sgx-auth-spinner" aria-hidden="true" />}
            <span>{busy ? 'Đang xử lý…' : register ? 'Tạo tài khoản' : 'Đăng nhập'}</span>
            {!busy && <ArrowRight size={20} aria-hidden="true" />}
          </button>
        </fieldset>
      </form>
      {config?.authentication?.google && (
        <p className="sgx-auth-privacy">
          <ShieldCheck size={21} aria-hidden="true" />
          <span>
            Khi tiếp tục với Google, bạn đồng ý{' '}
            <Link to="/legal/terms" target="_blank">
              điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link to="/legal/privacy" target="_blank">
              chính sách bảo mật
            </Link>
            .
          </span>
        </p>
      )}
      <p className="sgx-auth-register-row">
        {register ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
        <button
          type="button"
          className="sgx-auth-link"
          onClick={() => {
            setRegister(!register);
            setError('');
            setForm({ ...form, password: '', totp: '' });
          }}
        >
          {register ? 'Đăng nhập' : 'Đăng ký'} <ArrowRight size={16} aria-hidden="true" />
        </button>
      </p>
    </div>
  );
}

export function SgxAuthPage({
  config,
  register = false,
}: {
  config: PublicConfig;
  register?: boolean;
}) {
  const user = useAuth((s) => s.user),
    navigate = useNavigate(),
    [params] = useSearchParams();
  const next = params.get('next');
  const target =
    next?.startsWith('/') &&
    !next.startsWith('//') &&
    !next.includes('\\') &&
    !/^\/(login|register)([/?#]|$)/.test(next)
      ? next
      : '/';
  if (user) return <Navigate to={target} replace />;
  return (
    <main className="sgx-auth-page sgx-eco-auth-page">
      <Link to="/" className="sgx-auth-back" aria-label="Quay về trang chủ">
        <ArrowLeft size={22} />
      </Link>
      <SgxAuthPanel
        config={config}
        register={register}
        onSuccess={() => navigate(target, { replace: true })}
      />
      {!config.platform && <AuthMobileNav />}
    </main>
  );
}
