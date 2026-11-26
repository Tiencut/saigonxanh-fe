import { AdminInventoryTable } from './AdminInventoryTable';
import React, { useState } from 'react';
import { Gift, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

interface AdminRewardsTabProps {
  rewards: any[];
  wasteItems: any[];
  redemptions: any[];
  onUpdateRedemptionStatus: (id: string, status: string) => void;
  onRefresh: () => void;
}

export const AdminRewardsTab: React.FC<AdminRewardsTabProps> = ({
  rewards,
  wasteItems,
  redemptions,
  onUpdateRedemptionStatus,
  onRefresh,
}) => {
  const [subTab, setSubTab] = useState<'redemptions' | 'items' | 'waste'>('redemptions');

  return (
    <div className="tab-pane-fade">
      <div className="admin-actions-bar">
        <div className="actions-left">
          <div className="filter-pill-group">
            <button
              className={`filter-pill ${subTab === 'redemptions' ? 'active' : ''}`}
              onClick={() => setSubTab('redemptions')}
            >
              Yêu cầu đổi quà ({redemptions.length})
            </button>
            <button
              className={`filter-pill ${subTab === 'items' ? 'active' : ''}`}
              onClick={() => setSubTab('items')}
            >
              Kho vật phẩm ({rewards.length})
            </button>
            <button className={`filter-pill ${subTab === 'waste' ? 'active' : ''}`} onClick={() => setSubTab('waste')}>Rác quy đổi ({wasteItems.length})</button>
          </div>
        </div>

        <button className="btn-secondary-admin" onClick={onRefresh} title="Tải lại">
          <RefreshCw size={15} />
        </button>
      </div>

      {subTab === 'redemptions' ? (
        <div className="admin-panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0 }}>Danh sách yêu cầu đổi quà tặng từ tình nguyện viên</h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                Phê duyệt, chuẩn bị và cập nhật trạng thái giao nhận quà tặng cho tình nguyện viên.
              </p>
            </div>
            <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
              {redemptions.length} yêu cầu
            </span>
          </div>
          {redemptions.length === 0 ? (
            <div className="admin-empty-state">
              <div className="empty-icon"><Gift size={22} /></div>
              <h3 className="empty-title">Chưa có yêu cầu đổi quà nào</h3>
              <p className="empty-desc">
                Khi tình nguyện viên tích lũy điểm thưởng và gửi yêu cầu quy đổi quà tặng, danh sách sẽ xuất hiện tại đây để ban quản trị phê duyệt.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tình nguyện viên</th>
                    <th>Quà tặng yêu cầu</th>
                    <th>Điểm trừ</th>
                    <th>Người nhận & Địa chỉ</th>
                    <th>Ngày yêu cầu</th>
                    <th>Trạng thái</th>
                    <th>Thao tác duyệt</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((item) => (
                    <tr key={item.id}>
                      <td className="font-bold">{item.user?.name || item.recipientName}</td>
                      <td>{item.rewardName}</td>
                      <td className="font-bold text-emerald">{item.pointsSpent?.toLocaleString()} pts</td>
                      <td>
                        <div>{item.recipientName} ({item.recipientPhone})</div>
                        <small className="text-muted">{item.recipientAddress}</small>
                      </td>
                      <td>{new Date(item.redeemedAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <span className={`status-pill ${item.status?.toLowerCase()}`}>
                          {item.status === 'PENDING' ? 'Chờ duyệt' : item.status === 'SHIPPED' ? 'Đang giao' : item.status === 'CANCELLED' ? 'Đã hủy' : item.status === 'COMPLETED' ? 'Đã hoàn tất' : item.status}
                        </span>
                      </td>
                      <td>
                        {item.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="btn-action-sm btn-approve"
                              onClick={() => onUpdateRedemptionStatus(item.id, 'SHIPPED')}
                              title="Duyệt xuất quà"
                            >
                              Duyệt
                            </button>
                            <button
                              className="btn-action-sm btn-reject"
                              onClick={() => onUpdateRedemptionStatus(item.id, 'CANCELLED')}
                              title="Từ chối"
                            >
                              Từ chối
                            </button>
                          </div>
                        ) : (
                          item.status === 'SHIPPED' ? <button className="btn-action-sm btn-approve" onClick={() => onUpdateRedemptionStatus(item.id, 'COMPLETED')}>Hoàn tất</button> : <span className="text-muted" style={{ fontSize: '13px' }}>Đã xử lý</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <AdminInventoryTable resource={subTab === 'items' ? 'rewards' : 'waste-items'} rows={subTab === 'items' ? rewards : wasteItems} />
      )}
    </div>
  );
};
