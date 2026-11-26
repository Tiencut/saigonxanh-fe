import { OrganizationLogo, OrganizationName } from '../../organizations/OrganizationBrand';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  LogOut,
  Mail,
  Map,
  Phone,
  UserRound,
} from 'lucide-react';
import { post, useAuth } from '../../api';
import { sgxApi } from '../api';
import type { PublicConfig } from '../../App';
import { AccountActivityHistory, type AccountProfile } from './AccountActivityHistory';
import { SgxNavbar } from './SgxNavbar';
import '../saigonxanh.css';
import './account.css';
import { MobileAccountCenter } from '../mobile/account/MobileAccountCenter';
import type { AccountPage } from '../mobile/account/accountTypes';
import { AuthMobileNav } from './AuthMobileNav';

export function SgxAccountPage({ config }: { config: PublicConfig }) {
  const { user, logout, reload } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const view = params.get('view');
  const activeView =
    view &&
    [
      'edit',
      'gifts',
      'orders',
      'notifications',
      'privacy',
      'permissions',
      'registrations',
    ].includes(view)
      ? (view as AccountPage)
      : null;
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setProfile(null);
    setError('');
    if (user)
      sgxApi
        .getProfile()
        .then((p) => {
          if (active) setProfile(p);
        })
        .catch(() => {
          if (active) setError('Không tải được hồ sơ. Vui lòng thử lại.');
        });
    return () => {
      active = false;
    };
  }, [user?.id, attempt]);
  if (!user)
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent('/account' + (activeView ? `?view=${activeView}` : ''))}`}
        replace
      />
    );
  const verify = async () => {
    setBusy(true);
    setNotice('');
    try {
      await post('/auth/verify/request', { email: user.email });
      setNotice('Đã yêu cầu gửi email xác minh. Vui lòng kiểm tra hộp thư.');
    } catch {
      setNotice('Không thể gửi email lúc này. Vui lòng thử lại sau.');
    } finally {
      setBusy(false);
    }
  };
  const refreshVerification = async () => {
    try {
      await reload();
      setNotice('Đã cập nhật trạng thái email.');
    } catch {
      setNotice('Không thể cập nhật lúc này. Vui lòng thử lại.');
    }
  };
  const signOut = async () => {
    setBusy(true);
    try {
      await logout();
    } catch {
      navigate('/login');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="sgx-web-container sgx-account-shell">
      <SgxNavbar
        currentPage="account"
        onNavClick={(page) => navigate(page === 'home' ? '/' : `/${page}`)}
      />
      <main className="sgx-account-page" id="account-overview">
        <header className="account-page-heading">
          <div>
            <Link className="account-back-link" to="/">
              <ArrowLeft size={15} /> Trang chủ
            </Link>
            <h1>Tài khoản của bạn</h1>
            <p>Thông tin cá nhân và những hoạt động bạn đã tham gia.</p>
          </div>
          <Link className="account-button" to="/map">
            <Map size={17} /> Bản đồ môi trường
          </Link>
        </header>
        <div className="account-layout">
          <aside className="account-identity" aria-label="Thông tin tài khoản">
            <div className="account-identity-heading">
              <div className="account-avatar" aria-hidden="true">
                <UserRound size={32} />
              </div>
              <div>
                <h2>{user.name}</h2>
                <div
                  className={`account-verification ${user.emailVerifiedAt ? 'is-verified' : ''}`}
                >
                  <CheckCircle2 size={16} />
                  <span>
                    {user.emailVerifiedAt ? 'Email đã được xác minh' : 'Email chưa được xác minh'}
                  </span>
                </div>
              </div>
            </div>
            {!user.emailVerifiedAt && (
              <div className="account-verification-actions">
                {config.authentication?.emailDelivery ? (
                  <>
                    <button
                      className="account-text-button"
                      type="button"
                      disabled={busy}
                      onClick={verify}
                    >
                      {busy ? 'Đang gửi…' : 'Gửi email xác minh'}
                    </button>
                    <button
                      className="account-text-button"
                      type="button"
                      onClick={refreshVerification}
                    >
                      Tôi đã xác minh
                    </button>
                  </>
                ) : (
                  <p>Chức năng gửi email xác minh chưa được bật.</p>
                )}
              </div>
            )}
            {notice && (
              <p className="account-notice" role="status">
                {notice}
              </p>
            )}
            <dl className="account-contact">
              <div>
                <dt>
                  <Mail size={15} /> Email
                </dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>
                  <Phone size={15} /> Điện thoại
                </dt>
                <dd>{profile ? profile.phone || 'Chưa cập nhật' : 'Đang tải…'}</dd>
              </div>
            </dl>
            <nav className="account-shortcuts" aria-label="Các mục tài khoản">
              <Link to="/account" aria-current={!activeView ? 'page' : undefined}>Tổng quan tài khoản</Link>
              <Link to="/account?view=edit" aria-current={activeView === 'edit' ? 'page' : undefined}>Sửa thông tin cá nhân</Link>
              <Link to="/account?view=notifications" aria-current={activeView === 'notifications' ? 'page' : undefined}>Thông báo</Link>
              <Link to="/account?view=gifts" aria-current={activeView === 'gifts' ? 'page' : undefined}>Quà của tôi</Link>
              <Link to="/account?view=orders" aria-current={activeView === 'orders' ? 'page' : undefined}>Quản lý đơn đổi quà</Link>
              <Link to="/account#account-history">Lịch sử đổi rác & quà</Link>
              <Link to="/account?view=registrations" aria-current={activeView === 'registrations' ? 'page' : undefined}>Hoạt động đã đăng ký</Link>
              <Link to="/account?view=permissions" aria-current={activeView === 'permissions' ? 'page' : undefined}>Quyền của ứng dụng</Link>
              <Link to="/account?view=privacy" aria-current={activeView === 'privacy' ? 'page' : undefined}>Yêu cầu xóa tài khoản</Link>
            </nav>
            <button className="account-logout" type="button" disabled={busy} onClick={signOut}>
              <LogOut size={17} /> Đăng xuất
            </button>
          </aside>
          <div className="account-main">
            {activeView ? (
              <MobileAccountCenter
                key={`${user.id}-${activeView}`}
                page={activeView}
                onBack={() => setParams({})}
                onSaved={() => setAttempt((value) => value + 1)}
              />
            ) : error ? (
              <div className="account-feedback" role="alert">
                <p>{error}</p>
                <button
                  className="account-button"
                  type="button"
                  onClick={() => setAttempt((n) => n + 1)}
                >
                  Thử lại
                </button>
              </div>
            ) : !profile ? (
              <div className="account-feedback" role="status">
                <p>Đang tải hồ sơ và lịch sử hoạt động…</p>
              </div>
            ) : (
              <>
                <section className="account-summary" aria-label="Hoạt động của bạn">
                  <p>HOẠT ĐỘNG CỦA BẠN</p>
                  <dl className="sgx-account-stats">
                    <div>
                      <dt>Điểm hiện có</dt>
                      <dd>
                        {profile.points.toLocaleString('vi-VN')}
                        <span>điểm</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Giờ tình nguyện</dt>
                      <dd>
                        {profile.volunteerHours.toLocaleString('vi-VN')}
                        <span>giờ</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Chiến dịch hoàn thành</dt>
                      <dd>
                        {profile.completedCampaigns.toLocaleString('vi-VN')}
                        <span>chiến dịch</span>
                      </dd>
                    </div>
                  </dl>
                </section>
                <AccountActivityHistory profile={profile} />
                <section
                  className="account-section account-campaigns"
                  id="account-campaigns"
                  aria-labelledby="account-campaign-title"
                >
                  <div className="account-section-heading">
                    <div>
                      <h2 id="account-campaign-title">Hoạt động đã đăng ký</h2>
                      <p>Các chiến dịch gắn với tài khoản của bạn.</p>
                    </div>
                    <Link to="/trophy">
                      Xem chiến dịch <ArrowRight size={16} />
                    </Link>
                  </div>
                  {profile.registrations.length ? (
                    <ul className="account-registration-list">
                      {profile.registrations.map((reg) => (
                        <li key={reg.id}>
                          <CalendarDays size={19} />
                          <div>
                            <h3>{reg.campaign.title}</h3>
                            <p>
                              {new Date(reg.campaign.startDate || reg.createdAt).toLocaleDateString(
                                'vi-VN',
                              )}
                            </p>
                          </div>
                          <span>
                            {(
                              {
                                REGISTERED: 'Đã đăng ký',
                                CHECKED_IN: 'Đã tham gia',
                                COMPLETED: 'Hoàn thành',
                                CANCELLED: 'Đã hủy',
                              } as Record<string, string>
                            )[reg.status] || reg.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="account-registration-empty">
                      Bạn chưa đăng ký hoạt động nào.{' '}
                      <Link to="/trophy">
                        Khám phá các chiến dịch sắp tới <ArrowRight size={14} />
                      </Link>
                    </p>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
        <footer className="account-footer">
          <OrganizationLogo alt="" />
          <span><OrganizationName /> · Chung tay vì môi trường xanh, sạch.</span>
        </footer>
      </main>
      <AuthMobileNav />
    </div>
  );
}
