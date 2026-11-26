import React, { useState } from 'react';
import { Plus, Download, Edit, Trash2, RefreshCw, Search, Eye, EyeOff } from 'lucide-react';
import { exportToCsv } from './adminExportUtils';
import type { KolItem } from '../types';

interface AdminKolsTabProps {
  kols: KolItem[];
  onOpenAddModal: () => void;
  onEditKol: (kol: KolItem) => void;
  onDeleteKol: (id: string, name: string) => void;
  onToggleStatus?: (kol: KolItem) => void;
  onRefresh: () => void;
}

export const AdminKolsTab: React.FC<AdminKolsTabProps> = ({
  kols,
  onOpenAddModal,
  onEditKol,
  onDeleteKol,
  onToggleStatus,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const filtered = kols.filter((k) => {
    const matchesSearch =
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      (k.role && k.role.toLowerCase().includes(search.toLowerCase())) ||
      (k.badge && k.badge.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'ACTIVE') return k.active !== false;
    if (statusFilter === 'INACTIVE') return k.active === false;
    return true;
  });

  const handleExport = () => {
    const headers = [
      'Mã ID',
      'Họ và tên',
      'Vai trò / Danh xưng',
      'Huy hiệu',
      'Đường dẫn ảnh',
      'Mô tả hành động',
      'Thứ tự hiển thị',
      'Trạng thái',
    ];
    const rows = filtered.map((k) => [
      k.id,
      k.name,
      k.role || '',
      k.badge || '',
      k.image,
      k.desc || '',
      k.order ?? 0,
      k.active !== false ? 'Hiển thị' : 'Tạm ẩn',
    ]);
    exportToCsv('Danh_Sach_KOL_SaiGonXanh', headers, rows);
  };

  return (
    <div className="tab-pane-fade">
      <div className="admin-actions-bar">
        <div className="actions-left" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              Tất cả ({kols.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ACTIVE')}
            >
              Đang hiển thị ({kols.filter((k) => k.active !== false).length})
            </button>
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'INACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('INACTIVE')}
            >
              Tạm ẩn ({kols.filter((k) => k.active === false).length})
            </button>
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm theo tên, danh xưng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px 6px 32px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                background: '#ffffff',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="btn-secondary-admin" onClick={onRefresh} title="Tải lại danh sách">
            <RefreshCw size={15} />
          </button>
          <button type="button" className="btn-secondary-admin" onClick={handleExport} title="Xuất file Excel / CSV">
            <Download size={16} />
            <span>Xuất CSV</span>
          </button>
          <button type="button" className="btn-primary-admin" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Thêm KOL Mới</span>
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Gương mặt thân quen & Nghệ sĩ đồng hành (Lưu trữ Database)</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              Quản lý các nghệ sĩ, KOL xuất hiện trên Coverflow Carousel trang chủ và Trang Đối Tác Đồng Hành.
            </p>
          </div>
          <span style={{ fontSize: '12px', background: '#ecfdf5', color: '#047857', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
            Tổng số: {kols.length} người
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#64748b' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>
              {search ? 'Không tìm thấy gương mặt KOL nào phù hợp với từ khóa.' : 'Chưa có KOL nào trong danh sách.'}
            </p>
            <button
              type="button"
              className="btn-primary-admin"
              onClick={onOpenAddModal}
              style={{ margin: '16px auto 0' }}
            >
              <Plus size={15} /> Thêm gương mặt đầu tiên
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Ảnh</th>
                  <th>Họ và tên</th>
                  <th>Vai trò / Danh hiệu</th>
                  <th>Huy hiệu</th>
                  <th>Mô tả hoạt động</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Thứ tự</th>
                  <th style={{ textAlign: 'center', width: '110px' }}>Trạng thái</th>
                  <th style={{ textAlign: 'center', width: '110px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((k) => (
                  <tr key={k.id} style={{ opacity: k.active === false ? 0.6 : 1 }}>
                    <td>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={k.image}
                          alt={k.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.includes('saigonxanh-eb662.web.app')) {
                              target.src = `https://saigonxanh-eb662.web.app${k.image}`;
                            } else if (!target.src.endsWith('/images/trangChu/logo.png')) {
                              target.src = '/images/trangChu/logo.png';
                            }
                          }}
                        />
                      </div>
                    </td>
                    <td className="font-bold" style={{ color: '#0f172a' }}>
                      {k.name}
                    </td>
                    <td style={{ color: '#475569', fontSize: '13px' }}>
                      {k.role || '—'}
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          background: '#f0f9ff',
                          color: '#0284c7',
                          border: '1px solid #bae6fd',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {k.badge || 'Đồng hành'}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '13px', maxWidth: '280px', lineHeight: 1.4 }}>
                      {k.desc || '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="admin-rank-pill">#{k.order ?? 0}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className={`badge-status ${k.active !== false ? 'status-active' : 'status-inactive'}`}
                        style={{ cursor: onToggleStatus ? 'pointer' : 'default' }}
                        onClick={() => onToggleStatus && onToggleStatus(k)}
                        title={onToggleStatus ? 'Bấm để đổi trạng thái ẩn/hiện' : undefined}
                      >
                        {k.active !== false ? 'Hiển thị' : 'Tạm ẩn'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {onToggleStatus && (
                          <button
                            type="button"
                            className="btn-action-sm"
                            onClick={() => onToggleStatus(k)}
                            title={k.active !== false ? 'Tạm ẩn khỏi trang chủ' : 'Bật hiển thị lại'}
                          >
                            {k.active !== false ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-action-sm"
                          onClick={() => onEditKol(k)}
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn-action-sm btn-reject"
                          onClick={() => onDeleteKol(k.id, k.name)}
                          title="Xóa khỏi hệ thống"
                        >
                          <Trash2 size={14} />
                        </button>
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
  );
};
