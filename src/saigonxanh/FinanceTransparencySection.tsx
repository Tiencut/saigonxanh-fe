import React, { useState } from 'react';
import { Check, Quote } from 'lucide-react';
import { FinanceSummaryCards } from './FinanceSummaryCards';
import { FinanceTransactionTable } from './FinanceTransactionTable';
import { FinanceReceiptModal } from './FinanceReceiptModal';
import type { FinancialTransaction } from './types';

interface FinanceTransparencySectionProps {
  finances?: {
    summary: { totalIncome: number; totalExpense: number; balance: number; verifiedPercentage: number };
    transactions: FinancialTransaction[];
  } | null;
  onOpenDonate?: () => void;
}

export const FinanceTransparencySection: React.FC<FinanceTransparencySectionProps> = ({
  finances,
  onOpenDonate,
}) => {
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<FinancialTransaction | null>(null);

  const transactions = finances?.transactions || [];

  const totalIncome = finances?.summary?.totalIncome ?? 0;
  const totalExpense = finances?.summary?.totalExpense ?? 0;
  const balance = finances?.summary?.balance ?? 0;

  return (
    <section className="sgx-finances-modern-section" id="finances-section">
      <div className="fin-container">
        {/* Top Hero Banner with Background Artwork */}
        <div className="fin-hero-banner">
          <div className="fin-hero-left">
            {/* Tag Badge */}
            <div className="fin-tag-badge">
              <Check size={14} className="tag-check" />
              <span>CÔNG KHAI • MINH BẠCH • TRÁCH NHIỆM</span>
            </div>

            {/* Main Title */}
            <h1 className="fin-main-heading">
              Minh bạch tài chính <br />
              <span className="heading-sub-color">& Đối soát</span>
            </h1>

            {/* Description */}
            <p className="fin-main-desc">
              Mọi khoản thu quyên góp và chi phí mua sắm thiết bị, đồ bảo hộ y tế, phao chắn rác đều được
              Sài Gòn Xanh công khai 100% kèm chứng từ đối soát.
            </p>

            {onOpenDonate && (
              <div className="fin-hero-actions">
                <button type="button" className="btn-hero-donate" onClick={onOpenDonate}>
                  Quyên góp đồng hành cùng Sài Gòn Xanh
                </button>
              </div>
            )}
          </div>

          {/* Right Floating Quote Card */}
          <div className="fin-hero-right">
            <div className="fin-quote-card">
              <div className="quote-icon-wrap">
                <Quote size={20} color="#15803d" />
              </div>
              <p className="quote-text">“Vì một Sài Gòn xanh hơn mỗi ngày”</p>
              <span className="quote-author">Ban điều phối Sài Gòn Xanh</span>
            </div>
          </div>
        </div>

        {/* 3 Summary Statistic Cards */}
        <div className="fin-summary-cards-wrapper">
          <FinanceSummaryCards
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
          />
        </div>

        {/* Transaction Table Component */}
        <div className="fin-table-component-wrapper">
          <FinanceTransactionTable
            transactions={transactions}
            onSelectReceipt={(tx) => setSelectedTxForReceipt(tx)}
          />
        </div>
      </div>

      {/* Detail Receipt Proof Modal */}
      {selectedTxForReceipt && (
        <FinanceReceiptModal
          transaction={selectedTxForReceipt}
          onClose={() => setSelectedTxForReceipt(null)}
        />
      )}
    </section>
  );
};
