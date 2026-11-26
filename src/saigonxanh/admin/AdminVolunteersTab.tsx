import { AdminCrudButton, AdminCrudRow } from './AdminCrud';
import React, { useState } from 'react';
import { Award, Download, Search, RefreshCw } from 'lucide-react';
import { exportToCsv } from './adminExportUtils';

interface AdminVolunteersTabProps {
  volunteers: any[];
  onOpenAwardModal: (vol: any) => void;
  onRefresh: () => void;
}

export const AdminVolunteersTab: React.FC<AdminVolunteersTabProps> = ({
  volunteers,
  onOpenAwardModal,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = volunteers.filter((v) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const name = v.user?.name?.toLowerCase() || '';
    const email = v.user?.email?.toLowerCase() || '';
    const phone = v.phone?.toLowerCase() || '';
    return name.includes(q) || email.includes(q) || phone.includes(q);
  });

  const handleExport = () => {
    const headers = ['Hạng', 'Họ và tên', 'Email', 'Số điện thoại', 'Điểm tích lũy', 'Giờ cống hiến', 'Chiến dịch tham gia'];
    const rows = filtered.map((v, idx) => [
      v.rank || idx + 1,
      v.user?.name || 'Ẩn danh',
      v.user?.email || '',
      v.phone || '',
      v.points || 0,
      v.volunteerHours || 0,
      v.completedCampaigns || 0,
    ]);
    exportToCsv('Tinh_Nguyen_Vien_SaiGonXanh', headers, rows);
  };

  return (
    <div className="tab-pane-fade">
      <div className="admin-actions-bar">
        <div className="actions-left" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="search-input-wrap" style={{ position: 'relative', width: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '32px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
          <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
            {volunteers.length} tình nguyện viên
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AdminCrudButton resource="volunteers" />
          <button className="btn-secondary-admin" onClick={onRefresh} title="Tải lại">
            <RefreshCw size={15} />
          </button>
          <button className="btn-primary-admin" onClick={handleExport} title="Xuất file Excel / CSV">
            <Download size={16} />
            <span>Xuất Excel / CSV</span>
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Bảng Vinh Danh & Danh Sách Tình Nguyện Viên</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              Theo dõi bảng xếp hạng cống hiến, giờ tình nguyện và lịch sử hoạt động của thành viên.
            </p>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-icon"><Award size={22} /></div>
            <h3 className="empty-title">Chưa có tình nguyện viên nào</h3>
            <p className="empty-desc">
              {searchTerm ? 'Không tìm thấy tình nguyện viên phù hợp với từ khóa.' : 'Danh sách tình nguyện viên đang trống.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', width: '80px' }}>Thứ hạng</th>
                  <th>Họ và tên</th>
                  <th>Email & Liên hệ</th>
                  <th>Điểm cống hiến</th>
                  <th>Số giờ tham gia</th>
                  <th>Chiến dịch</th>
                  <th style={{ textAlign: 'center', width: '150px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, idx) => (
                  <tr key={v.id || idx}>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`admin-rank-pill ${idx < 3 ? `top-${idx + 1}` : ''}`}>
                        #{v.rank || idx + 1}
                      </span>
                    </td>
                    <td className="font-bold">{v.user?.name || 'Chiến binh SGX'}</td>
                    <td>
                      <div>{v.user?.email}</div>
                      {v.phone && <small className="text-muted">{v.phone}</small>}
                    </td>
                    <td className="font-bold text-emerald">{(v.points || 0).toLocaleString()} pts</td>
                    <td>{v.volunteerHours || 0} giờ</td>
                    <td>{v.completedCampaigns || 0} chiến dịch</td>
                    <td>
                      <AdminCrudRow resource="volunteers" item={v} />
                      <button
                        className="btn-action-sm btn-award"
                        onClick={() => onOpenAwardModal(v)}
                        title="Tặng điểm cống hiến"
                      >
                        <Award size={14} />
                        <span>Cộng điểm</span>
                      </button>
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
