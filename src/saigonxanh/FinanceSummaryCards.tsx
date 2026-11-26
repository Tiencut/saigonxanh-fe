import React from 'react';
import { Wallet, TrendingUp, BarChart3, Coins, ArrowUpRight } from 'lucide-react';

interface FinanceSummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const FinanceSummaryCards: React.FC<FinanceSummaryCardsProps> = ({
  totalIncome,
  totalExpense,
  balance,
}) => {
  return (
    <div className="sgx-fin-cards-grid">
      {/* 1. TỔNG THU QUYÊN GÓP */}
      <div className="sgx-fin-card card-income">
        <div className="card-top-row">
          <div className="card-icon-box income-icon">
            <Coins size={22} color="#ffffff" />
          </div>
          <div className="card-badge income-badge">
            <ArrowUpRight size={14} />
            <span>+12%</span>
            <small className="badge-subtext">so với tháng trước</small>
          </div>
        </div>
        <div className="card-body-content">
          <span className="card-label">TỔNG THU QUYÊN GÓP</span>
          <div className="card-value income-val">
            +{totalIncome.toLocaleString()} <span className="val-currency">VND</span>
          </div>
          <p className="card-subtext">Từ các cá nhân và tổ chức</p>
        </div>
      </div>

      {/* 2. TỔNG CHI HOẠT ĐỘNG */}
      <div className="sgx-fin-card card-expense">
        <div className="card-top-row">
          <div className="card-icon-box expense-icon">
            <Wallet size={22} color="#ffffff" />
          </div>
          <div className="card-badge expense-badge">
            <ArrowUpRight size={14} />
            <span>+5%</span>
            <small className="badge-subtext">so với tháng trước</small>
          </div>
        </div>
        <div className="card-body-content">
          <span className="card-label">TỔNG CHI HOẠT ĐỘNG</span>
          <div className="card-value expense-val">
            -{totalExpense.toLocaleString()} <span className="val-currency">VND</span>
          </div>
          <p className="card-subtext">Cho thiết bị, nhân sự, vận hành</p>
        </div>
      </div>

      {/* 3. TỒN QUỸ HIỆN TẠI */}
      <div className="sgx-fin-card card-balance">
        <div className="card-top-row">
          <div className="card-icon-box balance-icon">
            <BarChart3 size={22} color="#ffffff" />
          </div>
          <div className="card-badge balance-badge">
            <ArrowUpRight size={14} />
            <span>+18%</span>
            <small className="badge-subtext">so với tháng trước</small>
          </div>
        </div>
        <div className="card-body-content">
          <span className="card-label">TỒN QUỸ HIỆN TẠI</span>
          <div className="card-value balance-val">
            {balance.toLocaleString()} <span className="val-currency">VND</span>
          </div>
          <p className="card-subtext">Sẵn sàng cho các hoạt động tiếp theo</p>
        </div>
      </div>
    </div>
  );
};
