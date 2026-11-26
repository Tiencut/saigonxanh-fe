import React from 'react';
import {
  Leaf,
  Heart,
  Users,
  Building2,
  ShieldCheck,
  FileText,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import type { PartnerSponsor } from '../types';
import type { SgxPageKey } from './SgxNavbar';

export function SponsorBrandLogo({ type }: { type: string }) {
  if (type === 'coca') {
    return (
      <div className="brand-logo-wrap brand-coca" title="Coca-Cola Việt Nam">
        <svg viewBox="0 0 100 28" className="brand-svg-coca">
          <text x="2" y="20" fill="#e11d48" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="900" fontSize="18" letterSpacing="-0.5px">
            Coca-Cola
          </text>
        </svg>
      </div>
    );
  }
  if (type === 'unilever') {
    return (
      <div className="brand-logo-wrap brand-unilever" title="Unilever Việt Nam">
        <div className="brand-unilever-inner">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#0c2382">
            <path d="M5 3c0 6 1.5 10 4.5 13 2 2 4.5 3 7.5 2 2-.8 3.5-2.6 4-5.5.3-2 .3-4.5.3-7.5h-3c0 2.5 0 4.5-.2 6-.3 1.8-1.2 2.8-2.6 3.2-2 .5-3.5-.2-4.8-1.5C8.8 11 8 7.5 8 3H5z"/>
          </svg>
          <span className="brand-unilever-txt">Unilever</span>
        </div>
      </div>
    );
  }
  if (type === 'grab') {
    return (
      <div className="brand-logo-wrap brand-grab" title="Grab Việt Nam">
        <span className="brand-grab-txt">Grab</span>
      </div>
    );
  }
  if (type === 'aeon') {
    return (
      <div className="brand-logo-wrap brand-aeon" title="AEON Việt Nam">
        <span className="brand-aeon-txt">/EON</span>
      </div>
    );
  }
  if (type === 'dst') {
    return (
      <div className="brand-logo-wrap brand-dst" title="DST Entertainment">
        <div className="brand-dst-badge">
          <span className="dst-main">DST</span>
          <span className="dst-sub">ENTERTAINMENT</span>
        </div>
      </div>
    );
  }
  if (type === 'greenviet') {
    return (
      <div className="brand-logo-wrap brand-greenviet" title="GreenViet">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#15803d">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
        <span className="brand-greenviet-txt">GreenViet</span>
      </div>
    );
  }
  if (type === 'heart') {
    return (
      <div className="brand-logo-wrap brand-heart">
        <Heart size={16} fill="#f43f5e" color="#f43f5e" />
      </div>
    );
  }
  return (
    <div className="brand-logo-wrap brand-default">
      <Leaf size={16} color="#16a34a" />
    </div>
  );
}

interface PartnershipSectionProps {
  partners?: PartnerSponsor[];
  sponsorTab?: 'org' | 'sponsor' | 'individual';
  setSponsorTab?: (tab: 'org' | 'sponsor' | 'individual') => void;
  onOpenDonate: (msg: string, amount?: number) => void;
  onNavigate?: (page: SgxPageKey) => void;
}

export const PartnershipSection: React.FC<PartnershipSectionProps> = ({
  partners = [],
  sponsorTab = 'org',
  setSponsorTab,
  onOpenDonate,
  onNavigate,
}) => {
  const verifiedPartners = partners.filter((p) => p.active !== false && p.verificationStatus === 'VERIFIED');
  const orgDb = verifiedPartners.filter((p) => p.group === 'org');
  const sponsorDb = verifiedPartners.filter((p) => p.group === 'sponsor');
  const indDb = verifiedPartners.filter((p) => p.group === 'individual');

  const currentList =
    sponsorTab === 'org'
      ? orgDb
      : sponsorTab === 'sponsor'
      ? sponsorDb
      : indDb;

  return (
    <section className="sgx-partnership-section" id="donation-section">
      <div className="sgx-donation-showcase-card">
        {/* Decorative corner leaves */}
        <svg className="donation-decor-leaf-left" viewBox="0 0 140 140" fill="none" aria-hidden="true">
          <path d="M10 130C10 75 48 35 105 35C105 90 65 130 10 130Z" fill="#a7d9b9" fillOpacity="0.45" />
          <path d="M0 130C25 95 60 80 105 80C80 115 45 130 0 130Z" fill="#8ec9a3" fillOpacity="0.55" />
        </svg>

        <svg className="donation-decor-leaf-right" viewBox="0 0 170 150" fill="none" aria-hidden="true">
          <path d="M160 140C160 80 110 35 50 42C62 102 110 140 160 140Z" fill="#a7d9b9" fillOpacity="0.42" />
          <path d="M130 140C130 95 90 68 45 72C55 115 90 140 130 140Z" fill="#8ec9a3" fillOpacity="0.52" />
          <path d="M170 130C140 105 118 85 105 52C138 72 160 95 170 130Z" fill="#c3ebd1" fillOpacity="0.6" />
        </svg>

        <div className="donation-showcase-content">
          {/* CỘT TRÁI (50%): TIÊU ĐỀ & 4 CARD LỰA CHỌN */}
          <div className="donation-left-col">
            <div className="donation-badge-pill">
              <Leaf size={14} className="badge-leaf-icon" />
              <span>ĐỒNG HÀNH CÙNG SÀI GÒN XANH</span>
            </div>

            <h2 className="donation-main-heading">
              Chung tay vì những dòng kênh xanh
            </h2>

            <p className="donation-main-desc">
              Mỗi đóng góp của bạn đều giúp chúng tôi lắp đặt phao chắn rác, tổ chức ra quân, truyền thông và duy trì các hoạt động làm sạch kênh rạch.
            </p>

            <div className="donation-grid-2x2">
              {/* Card 1: Tài trợ phao chắn rác */}
              <button
                type="button"
                className="donation-choice-card"
                onClick={() => onOpenDonate('Tài trợ phao chắn rác bảo vệ kênh rạch', 500000)}
                title="Tài trợ phao chắn rác 500.000 đ / mét phao"
              >
                <div className="choice-icon-wrap icon-wrap-leaf">
                  <Leaf size={20} />
                </div>
                <div className="choice-info-wrap">
                  <h3 className="choice-title">Tài trợ phao chắn rác</h3>
                  <span className="choice-sub">500.000 đ / mét phao</span>
                </div>
              </button>

              {/* Card 2: Ủng hộ hoạt động */}
              <button
                type="button"
                className="donation-choice-card"
                onClick={() => onOpenDonate('Ủng hộ hoạt động chi phí dọn rác, vận chuyển', 200000)}
                title="Ủng hộ hoạt động"
              >
                <div className="choice-icon-wrap icon-wrap-heart">
                  <Heart size={20} fill="#e11d48" stroke="#e11d48" />
                </div>
                <div className="choice-info-wrap">
                  <h3 className="choice-title">Ủng hộ hoạt động</h3>
                  <span className="choice-sub">Chi phí dọn rác, vận chuyển</span>
                </div>
              </button>

              {/* Card 3: Đồng hành tình nguyện */}
              <button
                type="button"
                className="donation-choice-card"
                onClick={() => (onNavigate ? onNavigate('trophy') : onOpenDonate('Đăng ký đồng hành tình nguyện cùng Sài Gòn Xanh'))}
                title="Đồng hành tình nguyện tham gia các chiến dịch"
              >
                <div className="choice-icon-wrap icon-wrap-users">
                  <Users size={20} />
                </div>
                <div className="choice-info-wrap">
                  <h3 className="choice-title">Đồng hành tình nguyện</h3>
                  <span className="choice-sub">Tham gia các chiến dịch</span>
                </div>
              </button>

              {/* Card 4: Hợp tác doanh nghiệp */}
              <button
                type="button"
                className="donation-choice-card"
                onClick={() => onOpenDonate('Hợp tác doanh nghiệp đồng hành dài hạn cùng Sài Gòn Xanh')}
                title="Hợp tác doanh nghiệp đồng hành dài hạn"
              >
                <div className="choice-icon-wrap icon-wrap-building">
                  <Building2 size={20} />
                </div>
                <div className="choice-info-wrap">
                  <h3 className="choice-title">Hợp tác doanh nghiệp</h3>
                  <span className="choice-sub">Đồng hành dài hạn</span>
                </div>
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: CONTAINER LỚN NỀN TRẮNG (QR + LỢI ÍCH) */}
          <div className="donation-right-col">
            <div className="donation-qr-box-container">
              {/* Bên trái của container: Card QR */}
              <div className="donation-qr-card">
                <span className="qr-card-title">Mã QR quyên góp</span>

                <div className="qr-img-wrapper">
                  <img
                    src="/images/qr-code.png"
                    alt="Mã QR quyên góp ngân hàng MB Sài Gòn Xanh"
                    className="qr-img-element"
                  />
                </div>

                <button
                  type="button"
                  className="btn-qr-action-donate"
                  onClick={() => onOpenDonate('Quyên góp ủng hộ Sài Gòn Xanh', 100000)}
                  title="Ủng hộ ngay qua mã QR hoặc chuyển khoản"
                >
                  <Heart size={16} fill="none" stroke="currentColor" strokeWidth={2.4} />
                  <span>Ủng hộ ngay</span>
                </button>

                <button
                  type="button"
                  className="btn-qr-action-transparency"
                  onClick={() => (onNavigate ? onNavigate('finances') : onOpenDonate('Xem sao kê minh bạch quỹ Sài Gòn Xanh'))}
                  title="Xem sao kê thu chi minh bạch tài chính"
                >
                  <FileSpreadsheet size={15} />
                  <span>Xem minh bạch tài chính</span>
                </button>
              </div>

              {/* Bên phải của container: 3 Lợi ích theo chiều dọc */}
              <div className="donation-benefits-list">
                <div className="benefit-row">
                  <div className="benefit-icon-badge">
                    <ShieldCheck size={22} strokeWidth={2.2} />
                  </div>
                  <div className="benefit-text-wrap">
                    <h4 className="benefit-title">Đóng góp an toàn</h4>
                    <p className="benefit-sub">Qua ngân hàng chính thống</p>
                  </div>
                </div>

                <div className="benefit-row">
                  <div className="benefit-icon-badge">
                    <FileText size={22} strokeWidth={2.2} />
                  </div>
                  <div className="benefit-text-wrap">
                    <h4 className="benefit-title">Công khai minh bạch</h4>
                    <p className="benefit-sub">Cập nhật thu chi định kỳ</p>
                  </div>
                </div>

                <div className="benefit-row">
                  <div className="benefit-icon-badge">
                    <CheckCircle2 size={22} strokeWidth={2.2} />
                  </div>
                  <div className="benefit-text-wrap">
                    <h4 className="benefit-title">Hiệu quả thực tế</h4>
                    <p className="benefit-sub">Tạo thay đổi rõ rệt tại kênh rạch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Only publish partners reviewed by an administrator. */}
      {verifiedPartners.length > 0 && (
        <div className="sgx-partners-bottom-bar">
          <div className="partners-bottom-header">
            <span className="partners-bottom-badge">CỘNG ĐỒNG ĐỒNG HÀNH</span>
            {setSponsorTab && (
              <div className="partners-bottom-tabs">
                <button
                  type="button"
                  className={`partner-pill-btn ${sponsorTab === 'org' ? 'active' : ''}`}
                  onClick={() => setSponsorTab('org')}
                >
                  Tổ chức ({orgDb.length})
                </button>
                <button
                  type="button"
                  className={`partner-pill-btn ${sponsorTab === 'sponsor' ? 'active' : ''}`}
                  onClick={() => setSponsorTab('sponsor')}
                >
                  Doanh nghiệp ({sponsorDb.length})
                </button>
                <button
                  type="button"
                  className={`partner-pill-btn ${sponsorTab === 'individual' ? 'active' : ''}`}
                  onClick={() => setSponsorTab('individual')}
                >
                  Cá nhân ({indDb.length})
                </button>
              </div>
            )}
          </div>

          <div className="partners-bottom-logos">
            {currentList.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="partner-logo-chip"
                onClick={() => onOpenDonate(`Đồng hành cùng Sài Gòn Xanh - ${item.name}`)}
                title={`${item.name} - ${item.purpose}`}
              >
                <SponsorBrandLogo type={item.type || 'generic'} />
                <span className="partner-chip-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
