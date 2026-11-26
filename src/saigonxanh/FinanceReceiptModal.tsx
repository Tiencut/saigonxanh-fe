import { OrganizationLogo } from '../organizations/OrganizationBrand';
import React from 'react';
import { X, CheckCircle, FileText, Download, Building, Calendar, DollarSign, ShieldCheck } from 'lucide-react';
import type { FinancialTransaction } from './types';

interface FinanceReceiptModalProps {
  transaction: FinancialTransaction | null;
  onClose: () => void;
}

export const FinanceReceiptModal: React.FC<FinanceReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const isIncome = transaction.type === 'INCOME';

  return (
    <div className="sgx-receipt-modal-backdrop" onClick={onClose}>
      <div className="sgx-receipt-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="sgx-receipt-modal-header">
          <div className="header-badge-row">
            <span className={`receipt-type-pill ${isIncome ? 'income' : 'expense'}`}>
              {isIncome ? 'PHIẾU THU QUYÊN GÓP' : 'PHIẾU CHI HOẠT ĐỘNG'}
            </span>
            <span className="receipt-verified-tag">
              <CheckCircle size={14} />
              <span>ĐÃ ĐỐI SOÁT 100%</span>
            </span>
          </div>
          <button type="button" className="receipt-close-btn" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Official Receipt Canvas */}
        <div className="sgx-receipt-paper">
          <div className="paper-watermark">SÀI GÒN XANH</div>

          {/* Org Top Header */}
          <div className="paper-top-info">
            <div className="paper-brand">
              <OrganizationLogo alt="Sài Gòn Xanh" className="paper-logo" />
              <div>
                <h4 className="paper-org-name">CỘNG ĐỒNG SÀI GÒN XANH</h4>
                <p className="paper-org-sub">Hệ thống minh bạch tài chính & đối soát tự động</p>
              </div>
            </div>
            <div className="paper-meta">
              <div className="meta-line">
                <span className="meta-label">Mã chứng từ:</span>
                <span className="meta-value font-mono">{transaction.id.toUpperCase()}-2026</span>
              </div>
              <div className="meta-line">
                <span className="meta-label">Ngày giao dịch:</span>
                <span className="meta-value">
                  {new Date(transaction.transactionDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          <div className="paper-divider" />

          {/* Amount Display */}
          <div className="paper-amount-banner">
            <span className="amount-caption">SỐ TIỀN THỰC HIỆN:</span>
            <div className={`amount-large ${isIncome ? 'text-income' : 'text-expense'}`}>
              {isIncome ? '+' : '-'}
              {transaction.amount.toLocaleString()} <span className="currency">VND</span>
            </div>
            <span className="amount-words">
              Trạng thái: <strong>Đã ghi nhận vào sao kê quỹ môi trường</strong>
            </span>
          </div>

          {/* Detail Specifications Grid */}
          <div className="paper-spec-grid">
            <div className="spec-item">
              <span className="spec-label">
                <Building size={14} /> Hạng mục thu chi:
              </span>
              <span className="spec-value font-bold">{transaction.category}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">
                <DollarSign size={14} /> {isIncome ? 'Nhà tài trợ / Đơn vị' : 'Đơn vị thụ hưởng / Đội'}:
              </span>
              <span className="spec-value">{transaction.donorName || 'Ban điều phối Sài Gòn Xanh'}</span>
            </div>

            <div className="spec-item full-width">
              <span className="spec-label">
                <FileText size={14} /> Nội dung diễn giải:
              </span>
              <span className="spec-value desc-text">{transaction.description}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">
                <Calendar size={14} /> Phương thức đối soát:
              </span>
              <span className="spec-value">Chuyển khoản Ngân hàng (Khớp lệnh Sao kê)</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">
                <ShieldCheck size={14} /> Bộ phận thẩm tra:
              </span>
              <span className="spec-value text-emerald-700 font-semibold">Ban Kiểm Soát & Thủ Quỹ SGX</span>
            </div>
          </div>

          {/* Official Audit Stamp & Signature */}
          <div className="paper-stamp-footer">
            <div className="stamp-box">
              <div className="official-stamp">
                <div className="stamp-circle">
                  <span>SÀI GÒN XANH</span>
                  <span className="stamp-inner-text">ĐÃ ĐỐI SOÁT HỢP LỆ</span>
                  <span className="stamp-date">16-10-2026</span>
                </div>
              </div>
              <p className="stamp-caption">Xác nhận sao kê điện tử</p>
            </div>
            <div className="signature-box">
              <span className="sig-title">Đại diện Ban Điều Phối</span>
              <div className="sig-image-text">Nguyễn Lương Ngọc</div>
              <span className="sig-name">Trưởng nhóm Sài Gòn Xanh</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="sgx-receipt-modal-actions">
          <button
            type="button"
            className="btn-print-receipt"
            onClick={() => window.print()}
          >
            <Download size={16} />
            <span>Tải / In chứng từ đối soát</span>
          </button>
          <button type="button" className="btn-close-receipt" onClick={onClose}>
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
