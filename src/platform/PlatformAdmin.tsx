import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList,
  ExternalLink, Leaf, Plus, RefreshCw, Search, ShieldCheck,
  Users, X, Clock3, PauseCircle, Copy, Check, Globe, Sparkles, CheckSquare, Server, Trash2
} from 'lucide-react';
import { api, useAuth } from '../api';
import { PlatformApplications, type Application } from './PlatformApplications';
import { PlatformUsersTab } from './PlatformUsersTab';
import { PlatformReportsTab } from './PlatformReportsTab';
import { PlatformSystemTab } from './PlatformSystemTab';
import './platform-review.css';

type Organization = {
  id: string;
  name: string;
  slug: string;
  region?: string;
  description?: string;
  contactEmail: string;
  active: boolean;
  verified: boolean;
  campaignCount?: number;
  reportCount?: number;
  domains: { hostname: string }[];
  members: { role: string; user: { email: string; name?: string } }[];
};

const PAGE_SIZE = 8;

export function PlatformAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const organizationId = location.pathname.match(/\/admin\/organizations\/([^/]+)/)?.[1] || null;
  const detailMode = Boolean(organizationId);

  const [rows, setRows] = useState<Organization[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Organization | null>(null);
  const [owner, setOwner] = useState('');
  const [tab, setTab] = useState<'organizations' | 'applications' | 'reports' | 'users' | 'system'>('organizations');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState(false);

  async function toggleOrgStatus(id: string, active: boolean) {
    try {
      await api(`/platform/admin/organizations/${id}/quick-status`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !active }),
      });
      await load();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi đổi trạng thái tổ chức');
    }
  }

  async function toggleOrgVerified(id: string, verified: boolean) {
    try {
      await api(`/platform/admin/organizations/${id}/quick-status`, {
        method: 'PATCH',
        body: JSON.stringify({ verified: !verified }),
      });
      await load();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật xác minh');
    }
  }

  async function load() {
    setError('');
    try {
      const [orgs, apps] = await Promise.all([
        api<Organization[]>('/platform/admin/organizations'),
        api<Application[]>('/platform/admin/applications'),
      ]);
      setRows(orgs);
      setApplications(apps);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được dữ liệu quản trị.');
    }
  }

  useEffect(() => {
    if (user?.roles.includes('PLATFORM_ADMIN')) void load();
  }, [user]);

  useEffect(() => {
    if (!organizationId || !rows.length) return;
    const found = rows.find((row) => row.id === organizationId);
    if (found) setEditing((current) => current?.id === found.id ? current : { ...found });
  }, [organizationId, rows]);

  async function action(run: () => Promise<unknown>, success: string, keepDetail = false) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await run();
      setMessage(success);
      if (!keepDetail) setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không lưu được thay đổi.');
    } finally {
      setBusy(false);
    }
  }

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    await action(async () => {
      await api('/platform/admin/organizations', { method: 'POST', body: JSON.stringify(data) });
      form.reset();
      setShowCreate(false);
    }, 'Đã tạo tổ chức mới thành công.');
  }

  function handleCopyPath(slug: string) {
    const fullUrl = `${window.location.origin}/${slug}`;
    void navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const activeCount = rows.filter((row) => row.active && row.verified).length;
  const hiddenCount = rows.length - activeCount;

  const visibleRows = useMemo(() => rows.filter((row) => {
    const searchable = [row.name, row.slug, row.region || '', row.contactEmail, ...row.domains.map((d) => d.hostname)]
      .join(' ').toLocaleLowerCase('vi');
    const matchesQuery = searchable.includes(query.toLocaleLowerCase('vi'));
    const matchesStatus = statusFilter === 'ALL'
      || (statusFilter === 'PUBLIC' && row.active && row.verified)
      || (statusFilter === 'HIDDEN' && !(row.active && row.verified))
      || (statusFilter === 'UNVERIFIED' && !row.verified);
    return matchesQuery && matchesStatus;
  }), [rows, query, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pagedRows = visibleRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [query, statusFilter, tab]);

  if (!user?.roles.includes('PLATFORM_ADMIN')) {
    return (
      <main className="ctx-admin-denied">
        <ShieldCheck size={38} />
        <h1>Không có quyền truy cập</h1>
        <p>Tài khoản này không được cấp quyền quản trị nền tảng Chung Tay Xanh.</p>
        <Link to="/" className="ctx-btn-primary">Về trang chủ</Link>
      </main>
    );
  }

  return (
    <div className="ctx-admin-shell">
      {/* Sidebar - Commercial Navy/Blue theme as requested */}
      <aside className="ctx-admin-sidebar">
        <div className="ctx-sidebar-brand-wrapper">
          <Link className="ctx-admin-brand" to="/">
            <span className="ctx-admin-brand-icon"><Leaf size={20} /></span>
            <div className="ctx-admin-brand-text">
              <strong>Chung Tay Xanh</strong>
              <small>PLATFORM PORTAL</small>
            </div>
          </Link>
        </div>

        <div className="ctx-admin-side-label">TỔ CHỨC & ĐỐI TÁC</div>
        <nav className="ctx-admin-side-nav" aria-label="Điều hướng tổ chức">
          <button
            type="button"
            className={tab === 'organizations' ? 'is-selected' : ''}
            onClick={() => { setTab('organizations'); setEditing(null); navigate('/admin'); }}
          >
            <Building2 size={17} />
            <span>Tổ chức thành viên</span>
            <span className="ctx-badge">{rows.length}</span>
          </button>
          <button
            type="button"
            className={tab === 'applications' ? 'is-selected' : ''}
            onClick={() => { setTab('applications'); setEditing(null); navigate('/admin'); }}
          >
            <ClipboardList size={17} />
            <span>Đơn đăng ký</span>
            {pendingCount > 0 && <span className="ctx-badge is-warning">{pendingCount}</span>}
          </button>
        </nav>

        <div className="ctx-admin-side-label" style={{ marginTop: '16px' }}>VẬN HÀNH & ĐIỂM RÁC</div>
        <nav className="ctx-admin-side-nav" aria-label="Điều hướng vận hành">
          <button
            type="button"
            className={tab === 'reports' ? 'is-selected' : ''}
            onClick={() => { setTab('reports'); setEditing(null); navigate('/admin'); }}
          >
            <Trash2 size={17} />
            <span>Báo cáo điểm rác</span>
          </button>
        </nav>

        <div className="ctx-admin-side-label" style={{ marginTop: '16px' }}>NGƯỜI DÙNG & AN NINH</div>
        <nav className="ctx-admin-side-nav" aria-label="Điều hướng tài khoản">
          <button
            type="button"
            className={tab === 'users' ? 'is-selected' : ''}
            onClick={() => { setTab('users'); setEditing(null); navigate('/admin'); }}
          >
            <Users size={17} />
            <span>Tài khoản người dùng</span>
          </button>
        </nav>

        <div className="ctx-admin-side-label" style={{ marginTop: '16px' }}>HẠ TẦNG & HỆ THỐNG</div>
        <nav className="ctx-admin-side-nav" aria-label="Điều hướng hạ tầng">
          <button
            type="button"
            className={tab === 'system' ? 'is-selected' : ''}
            onClick={() => { setTab('system'); setEditing(null); navigate('/admin'); }}
          >
            <Server size={17} />
            <span>Giám sát hệ thống</span>
          </button>
        </nav>

        <div className="ctx-admin-sidebar-bottom">
          <div className="ctx-sidebar-sys-status">
            <span className="ctx-sys-indicator" />
            <small>Hệ thống hoạt động bình thường</small>
          </div>
          <Link to="/" className="ctx-admin-back">
            <ArrowLeft size={15} /> Về trang cộng đồng
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ctx-admin-main">
        {/* Topbar */}
        <header className="ctx-admin-topbar">
          <div className="ctx-topbar-breadcrumb">
            <Link to="/admin" onClick={() => { setEditing(null); }}>Quản trị nền tảng</Link>
            <span className="ctx-breadcrumb-sep">/</span>
            {detailMode && editing ? (
              <span className="ctx-breadcrumb-current">{editing.name}</span>
            ) : (
              <span className="ctx-breadcrumb-current">
                {tab === 'organizations' && 'Danh sách tổ chức'}
                {tab === 'applications' && 'Duyệt đơn đăng ký'}
                {tab === 'reports' && 'Báo cáo điểm rác toàn sàn'}
                {tab === 'users' && 'Tài khoản người dùng'}
                {tab === 'system' && 'Giám sát hạ tầng & Hệ thống'}
              </span>
            )}
          </div>
          <div className="ctx-admin-user">
            <span className="ctx-user-avatar">
              {(user.name || user.email || 'A').slice(0, 1).toUpperCase()}
            </span>
            <div className="ctx-user-meta">
              <strong>{user.name || 'Quản trị viên'}</strong>
              <small>{user.email}</small>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="ctx-admin-content">
          {(error || message) && (
            <div
              className={`ctx-admin-alert ${error ? 'is-error' : 'is-success'}`}
              role={error ? 'alert' : 'status'}
            >
              {error ? <X size={16} /> : <CheckCircle2 size={16} />}
              <span>{error || message}</span>
            </div>
          )}

          {detailMode && editing ? (
            /* DETAIL / EDITING VIEW */
            <div className="ctx-detail-view-container">
              {/* Header section with actions */}
              <div className="ctx-detail-header-card">
                <div className="ctx-detail-header-top">
                  <button
                    type="button"
                    className="ctx-btn-back"
                    onClick={() => { setEditing(null); navigate('/admin'); }}
                  >
                    <ArrowLeft size={16} /> Quay lại danh sách
                  </button>
                  <div className="ctx-header-right-actions">
                    <a
                      href={`/${editing.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ctx-btn-secondary"
                      title="Mở trang tổ chức trên tab mới"
                    >
                      <ExternalLink size={14} /> Mở trang
                    </a>
                    <button
                      type="button"
                      className="ctx-btn-secondary"
                      disabled={busy}
                      onClick={() => void load()}
                    >
                      <RefreshCw size={14} /> Làm mới
                    </button>
                  </div>
                </div>

                <div className="ctx-detail-title-section">
                  <div className="ctx-detail-title-row">
                    <div className="ctx-org-avatar-big">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <div className="ctx-title-heading-row">
                        <h1>{editing.name}</h1>
                        <span className="ctx-code-pill">/{editing.slug}</span>
                        <span className={`ctx-status-tag ${editing.active && editing.verified ? 'is-active' : 'is-muted'}`}>
                          <span className="ctx-dot" />
                          {editing.active && editing.verified ? 'Đang công khai' : 'Tạm ẩn'}
                        </span>
                        {editing.verified && (
                          <span className="ctx-verified-tag">
                            <CheckCircle2 size={12} /> Đã xác minh
                          </span>
                        )}
                      </div>
                      <p className="ctx-detail-subtitle">
                        Mã hệ thống: <code>{editing.id}</code> · Khu vực: <strong>{editing.region || 'Toàn quốc'}</strong> · Email liên hệ: <strong>{editing.contactEmail || 'Chưa cập nhật'}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-Column Enterprise Layout */}
              <div className="ctx-admin-detail-grid">
                {/* Left Column: Organization Info & Visibility */}
                <div className="ctx-admin-grid-col-left">
                  <div className="ctx-admin-card">
                    <div className="ctx-card-header">
                      <div>
                        <h3>Thông tin tổ chức</h3>
                        <p>Chỉnh sửa các thuộc tính cơ bản và hiển thị của đơn vị.</p>
                      </div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        void action(
                          () => api('/platform/admin/organizations/' + editing.id, {
                            method: 'PATCH',
                            body: JSON.stringify({
                              name: editing.name,
                              description: editing.description || '',
                              region: editing.region || '',
                              active: editing.active,
                              verified: editing.verified,
                            }),
                          }),
                          'Đã lưu thông tin tổ chức thành công.',
                          true,
                        );
                      }}
                    >
                      <div className="ctx-form-row-2">
                        <label className="ctx-form-group">
                          <span>Tên tổ chức <span className="ctx-req">*</span></span>
                          <input
                            required
                            type="text"
                            value={editing.name}
                            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                          />
                        </label>
                        <label className="ctx-form-group">
                          <span>Khu vực hoạt động</span>
                          <input
                            type="text"
                            placeholder="Ví dụ: TP. Hồ Chí Minh"
                            value={editing.region || ''}
                            onChange={(e) => setEditing({ ...editing, region: e.target.value })}
                          />
                        </label>
                      </div>

                      <div className="ctx-form-group">
                        <span>Mã truy cập định danh (Slug)</span>
                        <input
                          type="text"
                          disabled
                          value={editing.slug}
                          className="ctx-input-disabled"
                          title="Mã định danh không thể thay đổi sau khi tạo để đảm bảo liên kết dữ liệu"
                        />
                        <small className="ctx-field-hint">
                          Đường dẫn truy cập cố định: <code>chungtayxanh.id.vn/{editing.slug}</code>
                        </small>
                      </div>

                      <div className="ctx-form-group">
                        <span>Giới thiệu tổ chức</span>
                        <textarea
                          maxLength={1000}
                          rows={4}
                          placeholder="Mô tả tôn chỉ, mục tiêu hoạt động và giới thiệu tóm tắt..."
                          value={editing.description || ''}
                          onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                        />
                      </div>

                      <div className="ctx-toggles-section">
                        <h4>Thiết lập vận hành & xác minh</h4>
                        <div className="ctx-toggle-box">
                          <div
                            className="ctx-switch-card"
                            onClick={() => setEditing({ ...editing, verified: !editing.verified })}
                          >
                            <input
                              type="checkbox"
                              checked={editing.verified}
                              onChange={(e) => setEditing({ ...editing, verified: e.target.checked })}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="ctx-switch-card-text">
                              <strong>Đã xác minh tổ chức</strong>
                              <p>Xác nhận đơn vị chính danh, đủ điều kiện tiếp nhận hồ sơ tình nguyện và minh bạch tài chính.</p>
                            </div>
                          </div>

                          <div
                            className="ctx-switch-card"
                            onClick={() => setEditing({ ...editing, active: !editing.active })}
                          >
                            <input
                              type="checkbox"
                              checked={editing.active}
                              onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="ctx-switch-card-text">
                              <strong>Cho phép hoạt động công khai</strong>
                              <p>Hiển thị tổ chức trên cổng khám phá cộng đồng, bản đồ và danh sách chiến dịch.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ctx-form-footer">
                        <button type="submit" className="ctx-btn-primary" disabled={busy}>
                          {busy ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Right Column: Routing & Administrators */}
                <div className="ctx-admin-grid-col-right">
                  {/* Card: Public Links */}
                  <div className="ctx-admin-card">
                    <div className="ctx-card-header">
                      <div>
                        <h3>Đường dẫn truy cập</h3>
                        <p>Đường dẫn công khai duy nhất để cộng đồng tiếp cận tổ chức.</p>
                      </div>
                    </div>

                    <div className="ctx-access-section">
                      <div className="ctx-field-label">Đường dẫn chính (GitHub-style Path)</div>
                      <div className="ctx-url-copy-box">
                        <code className="ctx-url-text">
                          {window.location.origin}/{editing.slug}
                        </code>
                        <div className="ctx-url-box-actions">
                          <button
                            type="button"
                            className="ctx-btn-icon-subtle"
                            title="Sao chép liên kết"
                            onClick={() => handleCopyPath(editing.slug)}
                          >
                            {copied ? <Check size={15} className="ctx-text-green" /> : <Copy size={15} />}
                          </button>
                          <a
                            href={`/${editing.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="ctx-btn-icon-subtle"
                            title="Mở liên kết"
                          >
                            <ExternalLink size={15} />
                          </a>
                        </div>
                      </div>
                      {copied && <span className="ctx-copy-hint">Đã sao chép đường dẫn vào clipboard!</span>}

                      <div className="ctx-field-label" style={{ marginTop: '18px' }}>Lối tắt các phân hệ trực thuộc</div>
                      <div className="ctx-quick-links-list">
                        <a href={`/${editing.slug}`} target="_blank" rel="noreferrer" className="ctx-quick-link-item">
                          <div>
                            <strong>Cổng thông tin cộng đồng</strong>
                            <small>{window.location.host}/{editing.slug}</small>
                          </div>
                          <ExternalLink size={13} />
                        </a>
                        <a href={`/${editing.slug}/map`} target="_blank" rel="noreferrer" className="ctx-quick-link-item">
                          <div>
                            <strong>Bản đồ số & Tọa độ rác</strong>
                            <small>{window.location.host}/{editing.slug}/map</small>
                          </div>
                          <ExternalLink size={13} />
                        </a>
                        <a href={`/${editing.slug}/admin`} target="_blank" rel="noreferrer" className="ctx-quick-link-item">
                          <div>
                            <strong>Bàn làm việc quản trị</strong>
                            <small>{window.location.host}/{editing.slug}/admin</small>
                          </div>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card: Administrators List & Grant Form */}
                  <div className="ctx-admin-card">
                    <div className="ctx-card-header">
                      <div>
                        <h3>Quản trị viên ({editing.members?.length || 0})</h3>
                        <p>Các tài khoản có quyền điều hành tổ chức này.</p>
                      </div>
                    </div>

                    <div className="ctx-members-container">
                      {editing.members?.length ? (
                        <div className="ctx-member-list">
                          {editing.members.map((m, idx) => (
                            <div key={idx} className="ctx-member-item">
                              <span className="ctx-member-avatar">
                                {(m.user?.name || m.user?.email || 'A').charAt(0).toUpperCase()}
                              </span>
                              <div className="ctx-member-meta">
                                <strong>{m.user?.name || m.user?.email}</strong>
                                {m.user?.name && <small>{m.user?.email}</small>}
                              </div>
                              <span className={`ctx-role-pill ${m.role === 'OWNER' ? 'is-owner' : ''}`}>
                                {m.role === 'OWNER' ? 'Chủ sở hữu' : 'Quản trị viên'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ctx-empty-hint">Chưa có thông tin thành viên quản trị.</div>
                      )}

                      {/* Add Admin Form */}
                      <form
                        className="ctx-inline-form-box"
                        onSubmit={(e) => {
                          e.preventDefault();
                          void action(
                            () => api('/platform/admin/organizations/' + editing.id + '/owner', {
                              method: 'PUT',
                              body: JSON.stringify({ email: owner }),
                            }),
                            'Đã cấp quyền quản trị tổ chức.',
                            true,
                          );
                        }}
                      >
                        <label className="ctx-form-group">
                          <span>Cấp thêm quyền quản trị</span>
                          <input
                            type="email"
                            required
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            placeholder="email-thanh-vien@example.com"
                          />
                        </label>
                        <button type="submit" className="ctx-btn-secondary ctx-w-full" disabled={busy}>
                          <Users size={14} /> Cấp quyền quản trị
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : tab === 'organizations' ? (
            /* ORGANIZATIONS LIST VIEW */
            <div className="ctx-list-view-container">
              {/* Header */}
              <div className="ctx-page-header">
                <div>
                  <h1>Danh sách tổ chức</h1>
                  <p className="ctx-page-subtitle">Quản lý mạng lưới các tổ chức, đơn vị hoạt động vì môi trường và cộng đồng.</p>
                </div>
                <div className="ctx-page-actions">
                  <button className="ctx-btn-secondary" disabled={busy} onClick={() => void load()}>
                    <RefreshCw size={14} /> Làm mới
                  </button>
                  <button
                    className="ctx-btn-primary"
                    onClick={() => { setEditing(null); setShowCreate((value) => !value); }}
                  >
                    {showCreate ? <X size={15} /> : <Plus size={15} />}
                    {showCreate ? 'Đóng form' : 'Thêm tổ chức'}
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <section className="ctx-stats-grid" aria-label="Tổng quan số liệu tổ chức">
                <article className="ctx-stat-box">
                  <div className="ctx-stat-icon-wrapper is-neutral"><Building2 size={20} /></div>
                  <div>
                    <span className="ctx-stat-label">Tổng số tổ chức</span>
                    <strong className="ctx-stat-val">{rows.length}</strong>
                    <small className="ctx-stat-sub">Đã tạo trên hệ thống</small>
                  </div>
                </article>
                <article className="ctx-stat-box">
                  <div className="ctx-stat-icon-wrapper is-amber"><Clock3 size={20} /></div>
                  <div>
                    <span className="ctx-stat-label">Hồ sơ chờ duyệt</span>
                    <strong className="ctx-stat-val">{pendingCount}</strong>
                    <small className="ctx-stat-sub">Đơn đăng ký mới</small>
                  </div>
                </article>
                <article className="ctx-stat-box">
                  <div className="ctx-stat-icon-wrapper is-green"><CheckCircle2 size={20} /></div>
                  <div>
                    <span className="ctx-stat-label">Đang công khai</span>
                    <strong className="ctx-stat-val">{activeCount}</strong>
                    <small className="ctx-stat-sub">Hoạt động bình thường</small>
                  </div>
                </article>
                <article className="ctx-stat-box">
                  <div className="ctx-stat-icon-wrapper is-slate"><PauseCircle size={20} /></div>
                  <div>
                    <span className="ctx-stat-label">Tạm ẩn / Chưa xác minh</span>
                    <strong className="ctx-stat-val">{hiddenCount}</strong>
                    <small className="ctx-stat-sub">Cần cấu hình bổ sung</small>
                  </div>
                </article>
              </section>

              {/* Create Organization Modal / Drawer Form */}
              {showCreate && (
                <section className="ctx-admin-card ctx-create-panel">
                  <div className="ctx-card-header">
                    <div>
                      <h3>Thêm tổ chức mới</h3>
                      <p>Khởi tạo đơn vị trên hệ sinh thái Chung Tay Xanh. Tổ chức mới sẽ ở trạng thái chờ kích hoạt.</p>
                    </div>
                    <button
                      type="button"
                      className="ctx-btn-icon-subtle"
                      aria-label="Đóng form"
                      onClick={() => setShowCreate(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={create}>
                    <div className="ctx-form-row-3">
                      <label className="ctx-form-group">
                        <span>Tên tổ chức <span className="ctx-req">*</span></span>
                        <input name="name" required minLength={2} maxLength={150} placeholder="Ví dụ: Sài Gòn Xanh" />
                      </label>
                      <label className="ctx-form-group">
                        <span>Mã tổ chức (Slug) <span className="ctx-req">*</span></span>
                        <input name="slug" required pattern="[a-z][a-z0-9-]{2,39}" maxLength={40} placeholder="sai-gon-xanh" />
                      </label>
                      <label className="ctx-form-group">
                        <span>Khu vực hoạt động <span className="ctx-req">*</span></span>
                        <input name="region" required maxLength={100} placeholder="TP. Hồ Chí Minh" />
                      </label>
                    </div>

                    <div className="ctx-form-row-2">
                      <label className="ctx-form-group">
                        <span>Email liên hệ đại diện <span className="ctx-req">*</span></span>
                        <input name="contactEmail" type="email" required placeholder="contact@example.org" />
                      </label>
                      <label className="ctx-form-group">
                        <span>Email tài khoản quản trị viên (Owner) <span className="ctx-req">*</span></span>
                        <input name="ownerEmail" type="email" required placeholder="Email đã tạo tài khoản" />
                      </label>
                    </div>

                    <div className="ctx-form-group">
                      <span>Giới thiệu ngắn về hoạt động</span>
                      <textarea name="description" maxLength={1000} rows={3} placeholder="Mô tả mục tiêu môi trường..." />
                    </div>

                    <div className="ctx-form-footer">
                      <button type="submit" className="ctx-btn-primary" disabled={busy}>
                        <Plus size={15} /> Tạo tổ chức
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* Data Table */}
              <div className="ctx-table-card">
                <div className="ctx-table-toolbar">
                  <div className="ctx-search-box">
                    <Search size={16} />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Tìm theo tên tổ chức, slug, email..."
                    />
                  </div>
                  <div className="ctx-filter-box">
                    <select
                      className="ctx-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="ALL">Tất cả trạng thái</option>
                      <option value="PUBLIC">Đang công khai</option>
                      <option value="HIDDEN">Chưa công khai</option>
                      <option value="UNVERIFIED">Chưa xác minh</option>
                    </select>
                  </div>
                </div>

                <div className="ctx-table-container">
                  <table className="ctx-data-table">
                    <thead>
                      <tr>
                        <th>Tổ chức</th>
                        <th>Đường dẫn truy cập</th>
                        <th>Quy mô hoạt động</th>
                        <th>Trạng thái & Xác minh</th>
                        <th>Quản trị viên</th>
                        <th style={{ textAlign: 'right' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedRows.length ? (
                        pagedRows.map((row) => {
                          const admin = row.members.find((m) => m.role === 'OWNER') || row.members[0];
                          return (
                            <tr key={row.id}>
                              <td>
                                <div className="ctx-cell-org">
                                  <div className="ctx-cell-org-icon"><Building2 size={18} /></div>
                                  <div>
                                    <strong className="ctx-cell-org-name">{row.name}</strong>
                                    <small className="ctx-cell-org-sub">{row.region || 'Toàn quốc'}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="ctx-cell-links">
                                  <span className="ctx-path-pill">/{row.slug}</span>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12.5px' }}>
                                  <span><strong style={{ color: '#0f172a' }}>{row.campaignCount ?? 0}</strong> chiến dịch</span>
                                  <small style={{ color: '#64748b' }}>{row.reportCount ?? 0} điểm rác</small>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                  <button
                                    type="button"
                                    onClick={() => toggleOrgStatus(row.id, row.active)}
                                    className={`ctx-status-tag ${row.active ? 'is-active' : 'is-muted'}`}
                                    style={{ cursor: 'pointer', border: 'none', background: row.active ? '#dcfce7' : '#f1f5f9' }}
                                    title={row.active ? 'Bấm để tạm dừng hoạt động' : 'Bấm để kích hoạt hoạt động'}
                                  >
                                    <span className="ctx-dot" />
                                    {row.active ? 'Hoạt động' : 'Tạm dừng'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleOrgVerified(row.id, row.verified)}
                                    style={{
                                      cursor: 'pointer',
                                      border: '1px solid',
                                      borderColor: row.verified ? '#bbf7d0' : '#e2e8f0',
                                      background: row.verified ? '#f0fdf4' : '#fff',
                                      color: row.verified ? '#16a34a' : '#94a3b8',
                                      borderRadius: '12px',
                                      padding: '2px 7px',
                                      fontSize: '11px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      fontWeight: 500,
                                    }}
                                    title={row.verified ? 'Bấm để thu hồi tích xanh xác minh' : 'Bấm để cấp tích xanh xác minh'}
                                  >
                                    <CheckCircle2 size={11} /> {row.verified ? 'Đã xác minh' : 'Chưa duyệt'}
                                  </button>
                                </div>
                              </td>
                              <td>
                                <div className="ctx-cell-admin">
                                  <span>{admin?.user.email || 'Chưa phân quyền'}</span>
                                  <small>{admin?.role === 'OWNER' ? 'Chủ sở hữu' : admin ? 'Quản trị viên' : ''}</small>
                                </div>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                  <a
                                    href={`/${row.slug}/admin`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ctx-btn-table-action"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      textDecoration: 'none',
                                      background: '#f8fafc',
                                      borderColor: '#cbd5e1',
                                      color: '#0f172a'
                                    }}
                                    title="Mở bảng điều hành tổ chức này trong tab mới"
                                  >
                                    Vào Admin <ExternalLink size={12} />
                                  </a>
                                  <button
                                    type="button"
                                    className="ctx-btn-table-action"
                                    onClick={() => {
                                      setEditing({ ...row });
                                      setOwner('');
                                      setShowCreate(false);
                                      navigate('/admin/organizations/' + row.id);
                                    }}
                                  >
                                    Cấu hình <span>→</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="ctx-empty-row">
                            {rows.length ? 'Không tìm thấy tổ chức nào khớp với từ khóa.' : 'Chưa có tổ chức nào trên hệ thống.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="ctx-table-pagination">
                  <small>
                    Hiển thị {visibleRows.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} – {Math.min(currentPage * PAGE_SIZE, visibleRows.length)} trong số {visibleRows.length} đơn vị
                  </small>
                  <div className="ctx-pagination-buttons">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((v) => Math.max(1, v - 1))}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        className={num === currentPage ? 'is-active' : ''}
                        onClick={() => setPage(num)}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentPage >= pageCount}
                      onClick={() => setPage((v) => Math.min(pageCount, v + 1))}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : tab === 'applications' ? (
            /* APPLICATIONS REVIEW VIEW */
            <PlatformApplications
              rows={applications}
              reload={load}
              onManage={(id) => {
                const org = rows.find((row) => row.id === id);
                if (org) {
                  setEditing({ ...org });
                  setOwner('');
                  setShowCreate(false);
                  setTab('organizations');
                  navigate('/admin/organizations/' + org.id);
                }
              }}
            />
          ) : tab === 'reports' ? (
            <PlatformReportsTab />
          ) : tab === 'users' ? (
            <PlatformUsersTab />
          ) : tab === 'system' ? (
            <PlatformSystemTab />
          ) : null}

          {/* Footer */}
          <footer className="ctx-admin-content-footer">
            <div className="ctx-footer-left">
              <strong>Chung Tay Xanh</strong>
              <span>© {new Date().getFullYear()} · Cổng quản trị điều hành nền tảng</span>
            </div>
            <Link to="/" className="ctx-footer-link">
              Trang cộng đồng <ExternalLink size={12} />
            </Link>
          </footer>
        </main>
      </div>
    </div>
  );
}
