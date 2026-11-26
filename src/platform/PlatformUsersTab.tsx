import React, { useEffect, useState } from 'react';
import { Search, Users, Shield, UserCheck, RefreshCw, CheckCircle2, XCircle, Lock, Unlock } from 'lucide-react';
import { api } from '../api';

export function PlatformUsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const res = await api('/users?pageSize=100');
      setUsers(Array.isArray(res) ? res : res.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  }

  async function toggleUserActive(userId: string, currentActive: boolean) {
    if (!confirm(currentActive ? 'Bạn có chắc chắn muốn khóa tài khoản này?' : 'Mở khóa cho tài khoản này?')) return;
    try {
      await api(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !currentActive }),
      });
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái tài khoản');
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()));

    const matchRole =
      roleFilter === 'ALL' ||
      (roleFilter === 'ADMIN' && (u.roles?.includes('ADMIN') || u.roles?.includes('PLATFORM_ADMIN'))) ||
      (roleFilter === 'USER' && !u.roles?.includes('ADMIN') && !u.roles?.includes('PLATFORM_ADMIN'));

    return matchSearch && matchRole;
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.roles?.includes('ADMIN') || u.roles?.includes('PLATFORM_ADMIN')).length;
  const activeCount = users.filter((u) => u.active !== false).length;

  return (
    <div className="ctx-list-view-container">
      {/* Header */}
      <div className="ctx-page-header">
        <div>
          <h1>Tài khoản người dùng</h1>
          <p className="ctx-page-subtitle">Quản lý toàn bộ danh sách tài khoản, vai trò và trạng thái hoạt động trên nền tảng.</p>
        </div>
        <div className="ctx-page-actions">
          <button className="ctx-btn-secondary" onClick={fetchUsers} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Làm mới
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <section className="ctx-stats-grid" aria-label="Tổng quan số liệu người dùng">
        <article className="ctx-stat-box">
          <div className="ctx-stat-icon-wrapper is-neutral"><Users size={20} /></div>
          <div>
            <span className="ctx-stat-label">Tổng tài khoản</span>
            <strong className="ctx-stat-val">{totalUsers}</strong>
            <small className="ctx-stat-sub">Toàn bộ nền tảng</small>
          </div>
        </article>
        <article className="ctx-stat-box">
          <div className="ctx-stat-icon-wrapper is-amber"><Shield size={20} /></div>
          <div>
            <span className="ctx-stat-label">Ban quản trị</span>
            <strong className="ctx-stat-val">{adminCount}</strong>
            <small className="ctx-stat-sub">Admin & Platform Admin</small>
          </div>
        </article>
        <article className="ctx-stat-box">
          <div className="ctx-stat-icon-wrapper is-green"><UserCheck size={20} /></div>
          <div>
            <span className="ctx-stat-label">Đang hoạt động</span>
            <strong className="ctx-stat-val">{activeCount}</strong>
            <small className="ctx-stat-sub">Trạng thái bình thường</small>
          </div>
        </article>
      </section>

      {/* Table Card */}
      <div className="ctx-table-card">
        {/* Filter and Actions Bar */}
        <div className="ctx-table-toolbar">
          <div className="ctx-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Tìm theo email hoặc họ tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="ctx-toolbar-filter"
              style={{
                height: '38px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#fff',
                color: '#0f172a'
              }}
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">Ban quản trị (Admin)</option>
              <option value="USER">Người dùng / Tình nguyện viên</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="ctx-admin-alert is-error" style={{ margin: '14px 18px 0' }}>
            <span>{error}</span>
          </div>
        )}
        <div className="ctx-table-wrapper">
          <table className="ctx-table">
            <thead>
              <tr>
                <th>Tài khoản</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tham gia</th>
                <th style={{ width: '110px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="ctx-empty-row">Đang tải danh sách tài khoản...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="ctx-empty-row">Không tìm thấy tài khoản phù hợp.</td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const isPlatform = user.roles?.includes('PLATFORM_ADMIN');
                  const isAdmin = user.roles?.includes('ADMIN');

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="ctx-cell-org">
                          <span className="ctx-member-avatar" style={{ width: '32px', height: '32px', fontSize: '13px' }}>
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <strong>{user.name || 'Người dùng'}</strong>
                            <small className="ctx-cell-org-sub">ID: {user.id.slice(0, 8)}...</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '13.5px', color: '#334155', fontFamily: 'monospace' }}>
                          {user.email}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {isPlatform && (
                            <span className="ctx-role-pill" style={{ background: '#fef3c7', color: '#b45309', borderColor: '#fde68a', fontWeight: 700 }}>
                              Platform Admin
                            </span>
                          )}
                          {isAdmin && !isPlatform && (
                            <span className="ctx-role-pill is-owner">
                              Quản trị viên
                            </span>
                          )}
                          {!isAdmin && !isPlatform && (
                            <span className="ctx-role-pill" style={{ background: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' }}>
                              Người dùng
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`ctx-status-tag ${user.active !== false ? 'is-active' : 'is-muted'}`}>
                          <span className="ctx-dot" />
                          {user.active !== false ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="ctx-btn-table-action"
                          onClick={() => toggleUserActive(user.id, user.active !== false)}
                          style={{
                            color: user.active !== false ? '#dc2626' : '#16a34a',
                            borderColor: user.active !== false ? '#fecaca' : '#bbf7d0',
                            background: user.active !== false ? '#fef2f2' : '#f0fdf4',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title={user.active !== false ? 'Khóa tài khoản này' : 'Mở khóa tài khoản'}
                        >
                          {user.active !== false ? <><Lock size={12} /> Khóa</> : <><Unlock size={12} /> Mở khóa</>}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
