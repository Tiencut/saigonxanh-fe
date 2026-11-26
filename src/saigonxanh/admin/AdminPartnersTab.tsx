import React, { useState } from 'react';
import { Plus, Download, Edit, Trash2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { exportToCsv } from './adminExportUtils';

interface AdminPartnersTabProps {
  partners: any[];
  onOpenAddModal: () => void;
  onEditPartner: (partner: any) => void;
  onDeletePartner: (id: string, name: string) => void;
  onToggleStatus?: (partner: any) => void;
  onRefresh: () => void;
}

export const AdminPartnersTab: React.FC<AdminPartnersTabProps> = ({
  partners,
  onOpenAddModal,
  onEditPartner,
  onDeletePartner,
  onToggleStatus,
  onRefresh,
}) => {
  const [partnerFilter, setPartnerFilter] = useState<'ALL' | 'org' | 'sponsor' | 'individual'>('ALL');

  const filtered = partners.filter((p) => {
    if (partnerFilter === 'ALL') return true;
    return p.group === partnerFilter;
  });

  const handleExport = () => {
    const headers = ['Tên đơn vị / Cá nhân', 'Phân loại', 'Mục đích / Nội dung', 'Ngày đóng góp', 'Giá trị đóng góp', 'Thứ tự hiển thị'];
    const rows = filtered.map((p) => [
      p.name || '',
      p.group === 'org' ? 'Tổ chức' : p.group === 'sponsor' ? 'Đơn vị tài trợ' : 'Cá nhân',
      p.purpose || '',
      p.date || '',
      p.amount || '',
      p.order || 0,
    ]);
    exportToCsv('Nha_Dong_Hanh_SaiGonXanh', headers, rows);
  };

  return (
    <div className="tab-pane-fade">
      <div className="admin-actions-bar">
        <div className="actions-left">
          <div className="filter-pill-group">
            <button
              className={`filter-pill ${partnerFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setPartnerFilter('ALL')}
            >
              Tất cả ({partners.length})
            </button>
            <button
              className={`filter-pill ${partnerFilter === 'org' ? 'active' : ''}`}
              onClick={() => setPartnerFilter('org')}
            >
              Tổ chức gây quỹ ({partners.filter((p) => p.group === 'org').length})
            </button>
            <button
              className={`filter-pill ${partnerFilter === 'sponsor' ? 'active' : ''}`}
              onClick={() => setPartnerFilter('sponsor')}
            >
              Đơn vị tài trợ ({partners.filter((p) => p.group === 'sponsor').length})
            </button>
            <button
              className={`filter-pill ${partnerFilter === 'individual' ? 'active' : ''}`}
              onClick={() => setPartnerFilter('individual')}
            >
              Cá nhân ({partners.filter((p) => p.group === 'individual').length})
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary-admin" onClick={onRefresh} title="Tải lại">
            <RefreshCw size={15} />
          </button>
          <button className="btn-secondary-admin" onClick={handleExport} title="Xuất file Excel / CSV">
            <Download size={16} />
            <span>Xuất CSV</span>
          </button>
          <button className="btn-primary-admin" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Thêm Nhà Đồng Hành</span>
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="panel-header">
          <h2>Đối tác, nhà tài trợ & mạnh thường quân</h2>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <p>Chưa có nhà đồng hành nào trong danh mục này. Bấm "Thêm Nhà Đồng Hành" để tạo mới.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên đơn vị / Cá nhân</th>
                  <th>Phân loại</th>
                  <th>Mục đích / Nội dung</th>
                  <th>Ngày</th>
                  <th>Giá trị đóng góp</th>
                  <th>Thứ tự</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="font-bold">{p.name}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          p.group === 'org'
                            ? 'verified'
                            : p.group === 'sponsor'
                            ? 'in_progress'
                            : 'submitted'
                        }`}
                      >
                        {p.group === 'org'
                          ? 'Tổ chức'
                          : p.group === 'sponsor'
                          ? 'Tài trợ'
                          : 'Cá nhân'}
                      </span>
                    </td>
                    <td>{p.purpose}</td>
                    <td>{p.date}</td>
                    <td className="font-bold text-emerald">{p.amount}</td>
                    <td>#{p.order}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          p.verificationStatus === 'VERIFIED' && p.active !== false ? 'verified' : 'rejected'
                        }`}
                      >
                        {p.verificationStatus === 'HIDDEN' ? 'Ẩn' : p.verificationStatus !== 'VERIFIED' ? 'Chờ xác minh' : p.active !== false ? 'Đã xác minh · Công khai' : 'Đã xác minh · Tạm ẩn'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {onToggleStatus && (
                          <button
                            className="btn-action-sm"
                            onClick={() => onToggleStatus(p)}
                            title={p.active !== false ? 'Tạm ẩn' : 'Hiển thị'}
                          >
                            {p.active !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                        )}
                        <button
                          className="btn-action-sm"
                          onClick={() => onEditPartner(p)}
                          title="Chỉnh sửa"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn-action-sm btn-reject"
                          onClick={() => onDeletePartner(p.id, p.name)}
                          title="Xóa"
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
