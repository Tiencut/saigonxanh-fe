import { AdminCrudButton, AdminCrudRow } from './AdminCrud';
import React, { useState } from 'react';
import { Download, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { exportToCsv } from './adminExportUtils';

interface AdminReportsTabProps {
  reports: any[];
  onUpdateStatus: (id: string, status: string) => void;
  onRefresh: () => void;
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({
  reports,
  onUpdateStatus,
  onRefresh,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = reports.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const handleExport = () => {
    const headers = ['Mã theo dõi', 'Tiêu đề điểm rác', 'Địa chỉ', 'Loại rác', 'Mức độ', 'Trạng thái', 'Ngày báo cáo'];
    const rows = filtered.map((r) => [
      r.trackingCode || '',
      r.title || '',
      r.address || '',
      r.wasteType || '',
      r.severity || '',
      r.status || '',
      r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '',
    ]);
    exportToCsv('Diem_Rac_SaiGonXanh', headers, rows);
  };

  return (
    <div className="tab-pane-fade">
      <div className="admin-actions-bar">
        <div className="actions-left">
          <div className="filter-pill-group">
            <button
              className={`filter-pill ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
            >
              Tất cả ({reports.length})
            </button>
            <button
              className={`filter-pill ${filterStatus === 'SUBMITTED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('SUBMITTED')}
            >
              Chờ xác minh ({reports.filter((r) => r.status === 'SUBMITTED').length})
            </button>
            <button
              className={`filter-pill ${filterStatus === 'VERIFIED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('VERIFIED')}
            >
              Đã xác minh ({reports.filter((r) => r.status === 'VERIFIED').length})
            </button>
            <button
              className={`filter-pill ${filterStatus === 'IN_PROGRESS' ? 'active' : ''}`}
              onClick={() => setFilterStatus('IN_PROGRESS')}
            >
              Đang xử lý ({reports.filter((r) => r.status === 'IN_PROGRESS').length})
            </button>
            <button
              className={`filter-pill ${filterStatus === 'RESOLVED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('RESOLVED')}
            >
              Hoàn thành ({reports.filter((r) => r.status === 'RESOLVED').length})
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <AdminCrudButton resource="reports" />
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
        <div className="panel-header">
          <h2>Danh sách phản ánh điểm rác ô nhiễm</h2>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <p>Không có điểm rác nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã theo dõi</th>
                  <th>Tiêu đề điểm rác</th>
                  <th>Địa chỉ chi tiết</th>
                  <th>Loại rác</th>
                  <th>Mức độ</th>
                  <th>Trạng thái</th>
                  <th>Thao tác duyệt</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono font-bold">{r.trackingCode}</td>
                    <td className="font-bold">{r.title}</td>
                    <td>{r.address}</td>
                    <td>{r.wasteType}</td>
                    <td>
                      <span className={`severity-tag ${r.severity?.toLowerCase()}`}>
                        {r.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${r.status?.toLowerCase()}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <AdminCrudRow resource="reports" item={r} />
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {r.status !== 'VERIFIED' && (
                          <button
                            className="btn-action-sm btn-approve"
                            onClick={() => onUpdateStatus(r.id, 'VERIFIED')}
                            title="Xác minh điểm rác"
                          >
                            Xác minh
                          </button>
                        )}
                        {r.status !== 'IN_PROGRESS' && (
                          <button
                            className="btn-action-sm btn-schedule"
                            onClick={() => onUpdateStatus(r.id, 'IN_PROGRESS')}
                            title="Lên lịch ra quân dọn"
                          >
                            Lên lịch
                          </button>
                        )}
                        {r.status !== 'RESOLVED' && (
                          <button
                            className="btn-action-sm btn-resolve"
                            onClick={() => onUpdateStatus(r.id, 'RESOLVED')}
                            title="Đánh dấu đã dọn sạch"
                          >
                            Dọn sạch
                          </button>
                        )}
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
