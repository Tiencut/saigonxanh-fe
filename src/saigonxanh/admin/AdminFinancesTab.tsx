import { AdminCrudButton } from './AdminCrud';
import React, { useState } from 'react';
import { Plus, Download, CheckCircle, RefreshCw, FileText } from 'lucide-react';
import { exportToCsv } from './adminExportUtils';

interface AdminFinancesTabProps {
  finances: any;
  onOpenAddModal?: () => void;
  onRefresh: () => void;
}

export const AdminFinancesTab: React.FC<AdminFinancesTabProps> = ({
  finances,
  onOpenAddModal,
  onRefresh,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const transactions = finances?.transactions || [];
  const filtered = transactions.filter((t: any) => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  const totalIncome = finances?.summary?.totalIncome || 0;
  const totalExpense = finances?.summary?.totalExpense || 0;
  const balance = finances?.summary?.balance || 0;

  const handleExport = () => {
    const headers = ['Ngày', 'Phân loại', 'Hạng mục', 'Diễn giải / Nội dung', 'Người đóng góp / Đơn vị', 'Số tiền (VND)', 'Trạng thái đối soát'];
    const rows = filtered.map((t: any) => [
      t.transactionDate ? new Date(t.transactionDate).toLocaleDateString('vi-VN') : '',
      t.type === 'INCOME' ? 'THU (+)' : 'CHI (-)',
      t.category || '',
      t.description || '',
      t.donorName || 'Ban điều phối',
      t.amount || 0,
      t.isVerified ? 'Đã đối soát' : 'Chờ đối soát',
    ]);
    exportToCsv('Thu_Chi_Minh_Bach_SaiGonXanh', headers, rows);
  };

  return (
    <div className="tab-pane-fade">
      {/* 3 Summary Cards */}
      <div className="finance-summary-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="fin-mini-card" style={{ background: '#f0fdf4', padding: '16px 20px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <span style={{ fontSize: '13px', color: '#166534', fontWeight: 600 }}>TỔNG THU QUYÊN GÓP</span>
          <h3 style={{ fontSize: '24px', color: '#15803d', margin: '6px 0 0' }}>+{totalIncome.toLocaleString()} đ</h3>
        </div>
        <div className="fin-mini-card" style={{ background: '#fef2f2', padding: '16px 20px', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: 600 }}>TỔNG CHI HOẠT ĐỘNG</span>
          <h3 style={{ fontSize: '24px', color: '#b91c1c', margin: '6px 0 0' }}>-{totalExpense.toLocaleString()} đ</h3>
        </div>
        <div className="fin-mini-card" style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>TỒN QUỸ HIỆN TẠI</span>
          <h3 style={{ fontSize: '24px', color: '#0f172a', margin: '6px 0 0' }}>{balance.toLocaleString()} đ</h3>
        </div>
      </div>

      <div className="admin-actions-bar">
        <div className="actions-left">
          <div className="filter-pill-group">
            <button
              className={`filter-pill ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              Tất cả ({transactions.length})
            </button>
            <button
              className={`filter-pill ${filterType === 'INCOME' ? 'active' : ''}`}
              onClick={() => setFilterType('INCOME')}
            >
              Thu (+)
            </button>
            <button
              className={`filter-pill ${filterType === 'EXPENSE' ? 'active' : ''}`}
              onClick={() => setFilterType('EXPENSE')}
            >
              Chi (-)
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary-admin" onClick={onRefresh} title="Tải lại">
            <RefreshCw size={15} />
          </button>
          <button className="btn-primary-admin" onClick={handleExport} title="Xuất file Excel / CSV">
            <Download size={16} />
            <span>Xuất Excel / CSV</span>
          </button>
          <AdminCrudButton resource="finances" />
        </div>
      </div>

      <div className="admin-panel">
        <div className="panel-header">
          <h2>Nhật ký Thu - Chi & Đối Soát Chứng Từ</h2>
          <p>Giao dịch đã ghi sổ được lưu vết; không cho chỉnh sửa hoặc xóa trực tiếp. Mục “Đã đối soát” hiện là trạng thái xác nhận thủ công, chưa phải xác nhận từ ngân hàng/SePay.</p>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <p>Chưa có giao dịch thu chi nào trong cơ sở dữ liệu.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Phân loại</th>
                  <th>Hạng mục</th>
                  <th>Diễn giải</th>
                  <th>Nhà tài trợ / Đơn vị</th>
                  <th>Số tiền</th>
                  <th>Chứng từ</th><th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t: any) => {
                  const isIncome = t.type === 'INCOME';
                  return (
                    <tr key={t.id}>
                      <td className="font-mono">{new Date(t.transactionDate).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <span className={`status-pill ${isIncome ? 'verified' : 'rejected'}`}>
                          {isIncome ? 'THU' : 'CHI'}
                        </span>
                      </td>
                      <td className="font-semibold">{t.category}</td>
                      <td>{t.description}</td>
                      <td>{t.donorName || 'Ban điều phối'}</td>
                      <td className={`font-bold ${isIncome ? 'text-emerald' : 'text-rose-600'}`}>
                        {isIncome ? '+' : '-'}{Number(t.amount).toLocaleString()} đ
                      </td>
                      <td>
                        <span className="reconcile-pill" style={{ fontSize: '12px' }}>
                          <CheckCircle size={13} color="#15803d" />
                          <span>{t.isVerified ? 'Đã đối soát' : 'Chờ đối soát'}</span>
                        </span>
                      </td>
                      <td><span title="Giao dịch đã ghi sổ chỉ được đính chính bằng bút toán có lưu vết">Đã ghi sổ</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
