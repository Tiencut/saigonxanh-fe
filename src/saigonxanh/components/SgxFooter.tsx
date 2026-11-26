import { OrganizationLogo, OrganizationName } from '../../organizations/OrganizationBrand';
import React from 'react';
import type { SgxPageKey } from './SgxNavbar';

interface SgxFooterProps {
  onNavClick: (page: SgxPageKey) => void;
}

export const SgxFooter: React.FC<SgxFooterProps> = ({ onNavClick }) => {
  return (
    <footer className="sgx-footer">
      <div className="footer-inner">
        <div className="footer-col-brand">
          <OrganizationLogo variant="dark" className="footer-logo" />
          <p><OrganizationName /> · Chung tay vì một thành phố xanh - sạch - đẹp.</p>
        </div>

        <div className="footer-col-links">
          <h4><OrganizationName /></h4>
          <button type="button" onClick={() => onNavClick('about')}>
            Giới thiệu
          </button>
          <button type="button" onClick={() => onNavClick('trophy')}>
            Chiến tích
          </button>
          <button type="button" onClick={() => onNavClick('cooperate')}>
            Hợp tác
          </button>
          <button type="button" onClick={() => onNavClick('map')}>
            Bản đồ & Báo điểm rác
          </button>
          <button type="button" onClick={() => onNavClick('finances')}>
            Minh bạch tài chính
          </button>
        </div>

        <div className="footer-col-contact">
          <h4>Liên hệ Ban Điều Phối</h4>
          <p>📍 Trụ sở: TP. Hồ Chí Minh, Việt Nam</p>
          <p>✉️ Email: contact@saigonxanh.org</p>
          <p>📞 Hotline: 090 123 4567</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} <OrganizationName />. Bản quyền thuộc về tổ chức.</p>
      </div>
    </footer>
  );
};
