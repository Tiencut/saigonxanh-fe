import React, { useState } from 'react';
import { AdminCrudButton, AdminCrudProvider, AdminCrudRow } from './AdminCrud';
import { useAccountResource } from '../mobile/account/useAccountResource';
import { teamDepartments, type TeamMember } from '../components/TeamDirectory';
import { Search, RefreshCw, Users } from 'lucide-react';
import './adminTeam.css';

export function AdminTeamTab() {
  const resource = useAccountResource<TeamMember[]>('/public/saigonxanh/admin/manage/team-members');
  const [department, setDepartment] = useState('');
  const [search, setSearch] = useState('');

  const rows = (resource.data || [])
    .filter(
      (member) =>
        (!department || member.department === department) &&
        member.name.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi'))
    )
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'vi'));

  return (
    <AdminCrudProvider onRefresh={async () => { resource.reload(); }}>
      <div className="tab-pane-fade">
        {/* Top Actions Bar */}
        <div className="admin-actions-bar">
          <div className="actions-left" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm họ tên thành viên..."
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '6px 10px 6px 32px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                height: '36px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#fff',
                color: '#334155',
              }}
            >
              <option value="">Tất cả các ban ({resource.data?.length || 0})</option>
              {teamDepartments.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-secondary-admin"
              onClick={resource.reload}
              disabled={resource.loading}
              title="Tải lại danh sách"
            >
              <RefreshCw size={15} />
            </button>
            <AdminCrudButton resource="team-members" />
          </div>
        </div>

        {/* Panel Container */}
        <div className="admin-panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0 }}>Thành viên các ban</h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                Quản lý danh sách hiển thị tại trang Giới thiệu. Hồ sơ tài khoản tình nguyện viên được quản lý riêng.
              </p>
            </div>
            <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
              {rows.length} thành viên
            </span>
          </div>

          {resource.loading ? (
            <div className="admin-empty-state">
              <p>Đang tải danh sách thành viên...</p>
            </div>
          ) : resource.error ? (
            <div className="admin-empty-state">
              <p role="alert" style={{ color: '#b91c1c' }}>{resource.error}</p>
              <button type="button" className="btn-secondary-admin" onClick={resource.reload} style={{ marginTop: 8 }}>
                Thử lại
              </button>
            </div>
          ) : rows.length === 0 ? (
            <div className="admin-empty-state">
              <div className="empty-icon"><Users size={22} /></div>
              <h3 className="empty-title">Không tìm thấy thành viên nào</h3>
              <p className="empty-desc">
                {search || department
                  ? 'Không có thành viên nào khớp với bộ lọc hiện tại. Hãy thử đổi từ khóa tìm kiếm.'
                  : 'Chưa có thành viên nào trong ban này.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Ban trực thuộc</th>
                    <th>Chức vụ</th>
                    <th style={{ textAlign: 'center', width: '80px' }}>Thứ tự</th>
                    <th style={{ textAlign: 'center', width: '120px' }}>Hiển thị</th>
                    <th style={{ textAlign: 'center', width: '120px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((member) => (
                    <tr key={member.id} data-member-id={member.id}>
                      <td className="font-bold" style={{ color: '#0f172a' }}>{member.name}</td>
                      <td style={{ color: '#334155' }}>
                        {teamDepartments.find(([key]) => key === member.department)?.[1] || member.department}
                      </td>
                      <td style={{ color: member.role ? '#0f172a' : '#94a3b8' }}>
                        {member.role || 'Thành viên'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="admin-rank-pill">#{member.order}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge-status ${member.active ? 'status-active' : 'status-inactive'}`}>
                          {member.active ? 'Hiển thị' : 'Đã ẩn'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <AdminCrudRow resource="team-members" item={member} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminCrudProvider>
  );
}
