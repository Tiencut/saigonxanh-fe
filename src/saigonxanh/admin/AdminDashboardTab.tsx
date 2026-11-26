import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Gift,
  Handshake,
  Newspaper,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface AdminDashboardTabProps {
  reports: any[];
  campaigns: any[];
  volunteers: any[];
  finances: any;
  redemptions: any[];
  partners: any[];
  newsList: any[];
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  reports,
  campaigns,
  volunteers,
  finances,
  redemptions,
  partners,
  newsList,
  onNavigateTab,
}) => {
  const pendingReports = reports.filter((r) => r.status === 'VERIFIED' || r.status === 'PENDING').length;
  const upcomingCampaigns = campaigns.filter((c) => c.status === 'UPCOMING').length;
  const totalBalance = finances?.summary?.balance || 0;
  const pendingRedemptions = redemptions.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="tab-pane-fade">
      {/* 6 KPI Cards Cluster */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onNavigateTab('reports')} role="button" tabIndex={0}>
          <div className="kpi-icon-wrap icon-reports">
            <MapPin size={22} />
          </div>
          <div className="kpi-info">
            <div className="kpi-label">Điểm rác ô nhiễm</div>
            <div className="kpi-value">{reports.length}</div>
            <div className="kpi-sub text-warning">
              {pendingReports > 0 ? `⚠️ ${pendingReports} điểm cần xử lý` : 'Đã xác minh toàn bộ'}
            </div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('campaigns')} role="button" tabIndex={0}>
          <div className="kpi-icon-wrap icon-campaigns">
            <Calendar size={22} />
          </div>
          <div className="kpi-info">
            <div className="kpi-label">Chiến dịch ra quân</div>
            <div className="kpi-value">{campaigns.length}</div>
            <div className="kpi-sub text-success">
              {upcomingCampaigns > 0 ? `📅 ${upcomingCampaigns} chiến dịch sắp diễn ra` : 'Chưa có lịch mới'}
            </div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('volunteers')} role="button" tabIndex={0}>
          <div className="kpi-icon-wrap icon-volunteers">
            <Users size={22} />
          </div>
          <div className="kpi-info">
            <div className="kpi-label">Tình nguyện viên</div>
            <div className="kpi-value">{volunteers.length}</div>
            <div className="kpi-sub">Chiến binh sông xanh</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('finances')} role="button" tabIndex={0}>
          <div className="kpi-icon-wrap icon-finances">
            <DollarSign size={22} />
          </div>
          <div className="kpi-info">
            <div className="kpi-label">Tồn quỹ hiện tại</div>
            <div className="kpi-value text-emerald">{totalBalance.toLocaleString()} đ</div>
            <div className="kpi-sub">Đối soát 100% minh bạch</div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('rewards')} role="button" tabIndex={0}>
          <div className="kpi-icon-wrap icon-rewards">
            <Gift size={22} />
          </div>
          <div className="kpi-info">
            <div className="kpi-label">Đổi rác & Quà tặng</div>
            <div className="kpi-value">{redemptions.length}</div>
            <div className="kpi-sub text-warning">
              {pendingRedemptions > 0 ? `${pendingRedemptions} đơn chờ duyệt` : 'Đã duyệt toàn bộ'}
            </div>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('partners')} role="button" tabIndex={0}>
          <div className="kpi-icon-wrap icon-partners">
            <Handshake size={22} />
          </div>
          <div className="kpi-info">
            <div className="kpi-label">Nhà đồng hành & Tài trợ</div>
            <div className="kpi-value">{partners.length}</div>
            <div className="kpi-sub">Doanh nghiệp & cá nhân</div>
          </div>
        </div>
      </div>

      {/* 2-Column Summary Panel */}
      <div className="dashboard-dual-grid" style={{ marginTop: '24px' }}>
        {/* Điểm rác mới nhất */}
        <div className="admin-panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Điểm rác báo cáo mới nhất</h2>
            <button className="btn-link-sm" onClick={() => onNavigateTab('reports')}>
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>
          {reports.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
              <p>Chưa có điểm rác nào được người dân báo cáo.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Địa chỉ</th>
                    <th>Mức độ</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td className="font-mono font-bold">{r.trackingCode}</td>
                      <td>{r.address}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Hoạt động chiến dịch gần nhất */}
        <div className="admin-panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Chiến dịch ra quân gần nhất</h2>
            <button className="btn-link-sm" onClick={() => onNavigateTab('campaigns')}>
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>
          {campaigns.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
              <p>Chưa có chiến dịch ra quân nào được lập kế hoạch.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Chiến dịch</th>
                    <th>Địa điểm</th>
                    <th>TNV</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.slice(0, 5).map((c) => (
                    <tr key={c.id}>
                      <td className="font-bold">{c.title}</td>
                      <td>{c.location}</td>
                      <td>{c.currentVolunteers || 0}/{c.targetVolunteers}</td>
                      <td>
                        <span className={`status-pill ${c.status?.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
