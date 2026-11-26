import { Menu } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Button, Select, Skeleton, ErrorState, Toast } from '@base/ui';
import { api, useAuth } from './api';
import { useI18n, errorMessage } from './i18n';
import {
  ResourcePage,
  ProfilePage,
  SessionsPage,
  FilesPage,
  SettingsPage,
  LegalEditor,
  SystemPage,
} from './pages';
import { PwaUpdate, OfflineFallback } from './pwa';
import { NotificationBridge } from './realtime';
import { OperationsPage } from './OperationsPages';
import { ApiDocsPage } from './ApiDocsPage';
import { SaiGonXanhApp } from './saigonxanh/SaiGonXanhApp';
import { SaiGonXanhAdmin } from './saigonxanh/SaiGonXanhAdmin';
import { SgxAuthPage } from './saigonxanh/components/SgxAuthPage';
import { LegalFooter } from './LegalFooter';
import { SgxRecoveryPage } from './saigonxanh/components/SgxRecoveryPage';
import { SgxAccountPage } from './saigonxanh/components/SgxAccountPage';
import { OrganizationBrandProvider, type OrganizationBrand } from './organizations/OrganizationBrand';
import {PlatformApp} from './platform/PlatformApp';
import {OrganizationWorkspace} from './organizations/OrganizationWorkspace';

export type PublicConfig = {
  platform?: boolean;
  organization?: OrganizationBrand;
  project_name: string;
  display_name: string;
  branding?: {
    mark?: string;
    logo_url?: string;
  };
  theme: { primary: string; background: string };
  modules: Record<string, boolean>;
  termsVersion: string;
  legalReady: boolean;
  authentication?: { google: boolean; emailDelivery: boolean };
  company: any;
  commerce: any;
};

export function getBrandMark(config?: PublicConfig | null): string {
  if (config?.branding?.mark?.trim()) {
    return config.branding.mark.trim();
  }
  const name = config?.display_name?.trim() || '';
  if (!name) return 'B';
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function App() {
  const [config, setConfig] = useState<PublicConfig | null>(null),
    [error, setError] = useState(''),
    [toast, setToast] = useState(''),
    [mobile, setMobile] = useState(false);
  const { user, loading, init, logout } = useAuth(),
    { t, locale, setLocale } = useI18n(),
    location = useLocation();
  const notify = useCallback((message?: string) => setToast(message || t('saved')), [t]);
  const closeToast = useCallback(() => setToast(''), []);

  useEffect(() => {
    init();
    api<PublicConfig>('/public/config')
      .then((c) => {
        setConfig(c);
        document.title = c.display_name;
        document.documentElement.style.setProperty('--primary', c.theme.primary);
        document.documentElement.style.setProperty('--background', c.theme.background);
      })
      .catch((error) =>
        setError(error instanceof TypeError ? 'NETWORK_ERROR' : 'Cannot connect to API'),
      );
  }, [init]);

  useEffect(() => setMobile(false), [location.pathname]);

  if ((error === 'NETWORK_ERROR' || !navigator.onLine) && !user && !loading)
    return <OfflineFallback />;
  if (error)
    return (
      <main className="boot">
        <ErrorState message={t(error, error)} retry={() => window.location.reload()} />
      </main>
    );
  if (loading || !config)
    return (
      <main className="boot">
        <Skeleton />
      </main>
    );

  const isPlatformDomain = typeof window !== 'undefined' &&
    ['chungtayxanh.id.vn', 'www.chungtayxanh.id.vn', 'chungtayxanh.localhost'].includes(window.location.hostname.toLowerCase());

  if(isPlatformDomain || config.platform || (config.organization && config.organization.slug!=='saigonxanh')) {
    return <OrganizationBrandProvider value={{organization:config.organization||null,reload:async()=>{const updated=await api<PublicConfig>('/public/config');setConfig(updated);document.title=updated.display_name;}}}>
      {isPlatformDomain || config.platform ? <PlatformApp config={config}/> : <OrganizationWorkspace config={config}/>}
    </OrganizationBrandProvider>;
  }
  const nav = [
    { id: 'items', permission: 'items.read' },
    { id: 'files', module: 'upload' },
    { id: 'notifications', module: 'notifications' },
    { id: 'users', permission: 'users.read', module: 'users' },
    { id: 'roles', permission: 'roles.read' },
    { id: 'audit', permission: 'audit.read' },
    { id: 'legal', permission: 'legal.update' },
    { id: 'settings', permission: 'settings.read' },
    { id: 'system', permission: 'system.read' },
    { id: 'api-docs', permission: 'system.read' },
    { id: 'jobs', permission: 'jobs.manage', module: 'jobs' },
    { id: 'privacy-requests' },
  ].filter(
    (n) =>
      (!n.permission || user?.permissions.includes(n.permission)) &&
      (!n.module || config.modules[n.module]),
  );

  return (
    <OrganizationBrandProvider value={{organization:config.organization || null,reload:async()=>{
      const updated=await api<PublicConfig>('/public/config');setConfig(updated);document.title=updated.display_name;
    }}}>
      <Routes>
        <Route
          path="/login"
          element={<SgxAuthPage config={config} />}
        />
        <Route
          path="/register"
          element={<SgxAuthPage config={config} register />}
        />
        <Route path="/legal/:slug" element={<LegalPublic />} />
        <Route path="/account" element={<SgxAccountPage config={config} />} />
        <Route path="/reset" element={<SgxRecoveryPage kind="reset" enabled={!!config.authentication?.emailDelivery} />} />
        <Route path="/verify" element={<SgxRecoveryPage kind="verify" enabled={!!config.authentication?.emailDelivery} />} />
        <Route path="/forgot" element={<SgxRecoveryPage kind="forgot" enabled={!!config.authentication?.emailDelivery} />} />
        <Route path="/" element={<SaiGonXanhApp />} />
        <Route path="/m" element={<SaiGonXanhApp />} />
        <Route path="/mobile" element={<SaiGonXanhApp />} />
        <Route path="/trophy" element={<SaiGonXanhApp />} />
        <Route path="/about" element={<SaiGonXanhApp />} />
        <Route path="/cooperate" element={<SaiGonXanhApp />} />
        <Route path="/reports" element={<Navigate to="/map" replace />} />
        <Route path="/finances" element={<SaiGonXanhApp />} />
        <Route path="/map" element={<SaiGonXanhApp />} />
        <Route path="/admin" element={<SaiGonXanhApp />} />
        <Route path="/admin/*" element={<SaiGonXanhApp />} />
        <Route
          path="/*"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <div className="app-shell">
                {mobile && (
                  <button
                    className="nav-scrim"
                    aria-label="Close navigation"
                    onClick={() => setMobile(false)}
                  />
                )}
                <aside
                  className={`sidebar ${mobile ? 'is-open' : ''}`}
                  aria-label="Main navigation"
                >
                  <Link className="brand" to="/">
                    {config.branding?.logo_url ? (
                      <img
                        src={config.branding.logo_url}
                        alt={config.display_name}
                        className="brand-logo"
                      />
                    ) : (
                      <span className="brand-mark">{getBrandMark(config)}</span>
                    )}
                    <span>{config.display_name}</span>
                  </Link>
                  <div className="workspace-label">{t('workspace')}</div>
                  <nav>
                    {nav.map((n) => (
                      <NavLink key={n.id} to={n.id === 'items' ? '/' : '/' + n.id} end>
                        {t(n.id)}
                      </NavLink>
                    ))}
                  </nav>
                  <div className="sidebar-bottom">
                    <NavLink to="/profile">{t('profile')}</NavLink>
                    <NavLink to="/sessions">{t('sessions')}</NavLink>
                    <NavLink to="/activity">{t('activity')}</NavLink>
                    <button onClick={() => logout().catch(() => notify(t('error')))}>
                      {t('logout')}
                    </button>
                  </div>
                </aside>
                <div className="app-main">
                  <header className="topbar">
                    <Button
                      variant="ghost"
                      className="menu-toggle"
                      aria-label="Open navigation"
                      onClick={() => setMobile(!mobile)}
                    >
                      <Menu size={20} />
                    </Button>
                    <span className="topbar-title">{config.display_name}</span>
                    <div className="topbar-account">
                      <Select
                        aria-label="Language"
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as 'vi' | 'en')}
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </Select>
                      <Link to="/profile" className="user-name">
                        {user.name}
                      </Link>
                    </div>
                  </header>
                  <main className="page">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <Gate permission="items.read">
                            <ResourcePage kind="items" config={config} notify={notify} />
                          </Gate>
                        }
                      />
                      {['users', 'roles', 'audit', 'activity', 'notifications'].map((kind) => (
                        <Route
                          key={kind}
                          path={'/' + kind}
                          element={<ResourcePage kind={kind} config={config} notify={notify} />}
                        />
                      ))}
                      <Route
                        path="/jobs"
                        element={
                          config.modules.jobs ? (
                            <Gate permission="jobs.manage">
                              <OperationsPage kind="jobs" notify={notify} />
                            </Gate>
                          ) : (
                            <NotFound />
                          )
                        }
                      />
                      <Route
                        path="/privacy-requests"
                        element={<OperationsPage kind="privacy-requests" notify={notify} />}
                      />
                      <Route path="/profile" element={<ProfilePage notify={notify} />} />
                      <Route path="/sessions" element={<SessionsPage notify={notify} />} />
                      <Route
                        path="/files"
                        element={
                          config.modules.upload ? <FilesPage notify={notify} /> : <NotFound />
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <Gate permission="settings.read">
                            <SettingsPage notify={notify} />
                          </Gate>
                        }
                      />
                      <Route
                        path="/legal"
                        element={
                          <Gate permission="legal.update">
                            <LegalEditor notify={notify} />
                          </Gate>
                        }
                      />
                      <Route
                        path="/api-docs"
                        element={
                          <Gate permission="system.read">
                            <ApiDocsPage />
                          </Gate>
                        }
                      />
                      <Route
                        path="/system"
                        element={
                          <Gate permission="system.read">
                            <SystemPage />
                          </Gate>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <LegalFooter config={config} />
                </div>
              </div>
            )
          }
        />
      </Routes>
      <NotificationBridge
        enabled={!!config.modules.realtime && !!config.modules.notifications}
        onMessage={notify}
      />
      <Toast message={toast} onClose={closeToast} />
      {config.modules.pwa && <PwaUpdate />}
    </OrganizationBrandProvider>
  );
}

export function Gate({ permission, children }: { permission: string; children: React.ReactNode }) {
  const user = useAuth((s) => s.user);
  const { t } = useI18n();
  return user?.permissions.includes(permission) ? (
    children
  ) : (
    <PageHeader title={t('forbiddenTitle')} description={t('forbiddenDescription')} />
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function LegalPublic() {
  const { t } = useI18n(),
    location = useLocation(),
    [page, setPage] = useState<any>(),
    [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setPage(null);
    api(location.pathname)
      .then(setPage)
      .catch(() =>
        setError('This policy has not been published. Contact the application owner for details.'),
      );
  }, [location.pathname]);

  return (
    <main className="legal-page">
      <Link to="/">← {t('back')}</Link>
      {error ? (
        <ErrorState message={error} />
      ) : page ? (
        <>
          <h1>{page.title}</h1>
          <p className="muted">
            {t('version')} {page.version} · {page.effectiveAt?.slice(0, 10)}
          </p>
          <div className="legal-copy">{page.content}</div>
        </>
      ) : (
        <Skeleton />
      )}
    </main>
  );
}

function NotFound() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t('notFoundTitle')} description={t('notFoundDescription')} />
      <Link to="/">{t('returnWorkspace')}</Link>
    </>
  );
}
