import { AdminCrudButton, AdminCrudRow } from './AdminCrud';
import React from 'react';
import { Plus, Download, Calendar, Users, MapPin, RefreshCw, Trash2 } from 'lucide-react';
import { exportToCsv } from './adminExportUtils';

interface AdminCampaignsTabProps {
  campaigns: any[];
  onOpenAddModal?: () => void;
  onDeleteCampaign?: (id: string, title: string) => void;
  onRefresh: () => void;
}

export const AdminCampaignsTab: React.FC<AdminCampaignsTabProps> = ({
  campaigns,
  onOpenAddModal,
  onDeleteCampaign,
  onRefresh,
}) => {
  const handleExport = () => {
    const headers = ['Tên chiến dịch', 'Địa điểm', 'Ngày bắt đầu', 'TNV đã đký', 'TNV mục tiêu', 'Rác dự kiến (kg)', 'Trạng thái'];
    const rows = campaigns.map((c) => [
      c.title || '',
      c.location || '',
      c.startDate ? new Date(c.startDate).toLocaleDateString('vi-VN') : '',
      c.currentVolunteers || 0,
      c.targetVolunteers || 0,
      c.wasteCollectedKg || c.targetWasteKg || 0,
      c.status || '',
    ]);
    exportToCsv('Chien_Dich_SaiGonXanh', headers, rows);
  };

  return (
    <div className="tab-pane-fade">
      <div className="admin-actions-bar">
        <div className="actions-left">
          <span className="text-muted">Tổng cộng {campaigns.length} chiến dịch trong cơ sở dữ liệu</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary-admin" onClick={onRefresh} title="Tải lại">
            <RefreshCw size={15} />
          </button>
          <button className="btn-secondary-admin" onClick={handleExport} title="Xuất file Excel / CSV">
            <Download size={16} />
            <span>Xuất CSV</span>
          </button>
          <AdminCrudButton resource="campaigns" />
        </div>
      </div>

      <div className="admin-panel">
        <div className="panel-header">
          <h2>Danh sách Chiến dịch ra quân Sài Gòn Xanh</h2>
        </div>
        {campaigns.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <p>Chưa có chiến dịch nào được tạo. Bấm "Tạo Chiến Dịch Mới" để lên kế hoạch ra quân.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên chiến dịch</th>
                  <th>Địa điểm khảo sát</th>
                  <th>Thời gian</th>
                  <th>TNV đăng ký</th>
                  <th>Rác thu gom</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td className="font-bold">{c.title}</td>
                    <td>{c.location}</td>
                    <td>{new Date(c.startDate).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className="font-bold text-emerald">{c.currentVolunteers || 0}</span> / {c.targetVolunteers} TNV
                    </td>
                    <td>{c.wasteCollectedKg ? `${c.wasteCollectedKg.toLocaleString()} kg` : 'Chưa ghi nhận'}</td>
                    <td>
                      <span className={`status-pill ${c.status?.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <AdminCrudRow resource="campaigns" item={c} deletable={false} />
                      {onDeleteCampaign && (
                        <button
                          className="btn-action-sm btn-reject"
                          onClick={() => onDeleteCampaign(c.id, c.title)}
                          title="Xóa chiến dịch"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
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
