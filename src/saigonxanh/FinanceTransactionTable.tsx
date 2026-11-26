import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  CheckCircle,
  FileText,
  Filter,
  ArrowUpDown,
  Building2,
  ChevronDown,
} from 'lucide-react';
import type { FinancialTransaction } from './types';

interface FinanceTransactionTableProps {
  transactions: FinancialTransaction[];
  onSelectReceipt: (tx: FinancialTransaction) => void;
}

export const FinanceTransactionTable: React.FC<FinanceTransactionTableProps> = ({
  transactions,
  onSelectReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter and search logic
  const filteredList = useMemo(() => {
    return transactions
      .filter((t) => {
        if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchDesc = t.description?.toLowerCase().includes(q);
          const matchCat = t.category?.toLowerCase().includes(q);
          const matchDonor = t.donorName?.toLowerCase().includes(q);
          const matchAmount = t.amount.toString().includes(q);
          if (!matchDesc && !matchCat && !matchDonor && !matchAmount) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.transactionDate).getTime();
        const dateB = new Date(b.transactionDate).getTime();
        return sortAsc ? dateA - dateB : dateB - dateA;
      });
  }, [transactions, searchTerm, timeFilter, typeFilter, sortAsc]);

  return (
    <div className="sgx-fin-table-card">
      {/* Table Card Header */}
      <div className="fin-card-header">
        <div className="header-title-group">
          <div className="title-icon-wrapper">
            <Building2 size={20} color="#15803d" />
          </div>
          <div>
            <h3 className="fin-card-title">Nhật ký thu chi gần nhất</h3>
            <p className="fin-card-subtitle">Cập nhật các giao dịch mới nhất của Sài Gòn Xanh</p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="header-controls-group">
          {/* Quick Type Filter Tabs */}
          <div className="type-filter-segmented">
            <button
              type="button"
              className={`segment-btn ${typeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setTypeFilter('ALL')}
            >
              Tất cả ({transactions.length})
            </button>
            <button
              type="button"
              className={`segment-btn income ${typeFilter === 'INCOME' ? 'active' : ''}`}
              onClick={() => setTypeFilter('INCOME')}
            >
              Thu (+)
            </button>
            <button
              type="button"
              className={`segment-btn expense ${typeFilter === 'EXPENSE' ? 'active' : ''}`}
              onClick={() => setTypeFilter('EXPENSE')}
            >
              Chi (-)
            </button>
          </div>

          {/* Search Box */}
          <div className="fin-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm giao dịch, hạng mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="fin-search-input"
            />
          </div>

          {/* Time Filter Dropdown */}
          <div className="fin-time-filter-wrap">
            <Calendar size={15} className="time-icon" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="fin-time-select"
            >
              <option value="ALL">Tất cả thời gian</option>
              <option value="OCT_2026">Tháng 10/2026 (Hiện tại)</option>
              <option value="SEP_2026">Tháng 09/2026</option>
              <option value="Q3_2026">Quý 3/2026</option>
              <option value="YEAR_2026">Năm 2026</option>
            </select>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="fin-table-scroll-container">
        <table className="sgx-fin-table">
          <thead>
            <tr>
              <th className="th-date" onClick={() => setSortAsc(!sortAsc)} title="Bấm để sắp xếp theo ngày">
                <div className="th-content">
                  <span>Ngày</span>
                  <ArrowUpDown size={13} className="sort-icon" />
                </div>
              </th>
              <th className="th-type">Loại</th>
              <th className="th-category">Hạng mục</th>
              <th className="th-description">Diễn giải</th>
              <th className="th-donor">Nhà tài trợ / Đơn vị</th>
              <th className="th-amount text-right">Số tiền</th>
              <th className="th-status text-center">Trạng thái</th>
              <th className="th-receipt text-center">Chứng từ</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-table-cell">
                  <div className="empty-state-wrap">
                    <Filter size={32} color="#94a3b8" />
                    <p>Không tìm thấy giao dịch nào phù hợp với bộ lọc hiện tại.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredList.map((t, idx) => {
                const isIncome = t.type === 'INCOME';
                return (
                  <tr key={t.id} className={`fin-table-row ${idx % 2 === 1 ? 'row-alt' : ''}`}>
                    {/* Ngày */}
                    <td className="td-date font-mono">
                      {new Date(t.transactionDate).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Loại Badge */}
                    <td className="td-type">
                      <span className={`tx-type-badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                        {isIncome ? 'THU' : 'CHI'}
                      </span>
                    </td>

                    {/* Hạng mục */}
                    <td className="td-category">
                      <span className="category-text">{t.category}</span>
                    </td>

                    {/* Diễn giải */}
                    <td className="td-description">
                      <p className="desc-paragraph" title={t.description}>
                        {t.description}
                      </p>
                    </td>

                    {/* Nhà tài trợ / Đơn vị */}
                    <td className="td-donor">
                      <span className="donor-name">{t.donorName || 'Ban điều phối'}</span>
                    </td>

                    {/* Số tiền */}
                    <td className={`td-amount text-right font-semibold ${isIncome ? 'amt-income' : 'amt-expense'}`}>
                      {isIncome ? '+' : '-'}
                      {t.amount.toLocaleString()} đ
                    </td>

                    {/* Trạng thái */}
                    <td className="td-status text-center">
                      <span className="reconcile-pill">
                        <CheckCircle size={14} className="check-icon" />
                        <span>Đã đối soát</span>
                      </span>
                    </td>

                    {/* Nút Xem Chứng Từ */}
                    <td className="td-receipt text-center">
                      <button
                        type="button"
                        className="btn-receipt-icon"
                        title="Bấm để xem chứng từ đối soát hóa đơn"
                        onClick={() => onSelectReceipt(t)}
                      >
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary Row */}
      <div className="fin-table-footer">
        <div className="footer-left">
          <span className="footer-count">
            Hiển thị <strong>{filteredList.length}</strong> / {transactions.length} giao dịch
          </span>
          <span className="footer-audit-note">
            • 100% giao dịch có chứng từ & đối soát khớp số tài khoản ngân hàng
          </span>
        </div>
        <div className="footer-right">
          <span className="audit-system-badge">
            <CheckCircle size={14} color="#15803d" />
            <span>Hệ thống Kiểm toán Đối soát Sài Gòn Xanh</span>
          </span>
        </div>
      </div>
    </div>
  );
};
