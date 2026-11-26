import { OrganizationLogo } from '../../organizations/OrganizationBrand';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../api';
import './sgxAuth.css';
import { SgxMoreMenu } from './SgxMoreMenu';

export type SgxPageKey = 'home' | 'trophy' | 'cooperate' | 'about' | 'finances' | 'map';

interface SgxNavbarProps {
  currentPage: SgxPageKey | 'account';
  onNavClick: (page: SgxPageKey) => void;
  onOpenDonate?: () => void;
  baseRoute?: string;
}

export const SgxNavbar: React.FC<SgxNavbarProps> = ({ currentPage, onNavClick, onOpenDonate, baseRoute = '' }) => {
  const user = useAuth((s) => s.user);
  const accountLink = user ? (baseRoute ? `${baseRoute}/account` : '/account') : (baseRoute ? `${baseRoute}/login` : '/login');
  const financesLink = baseRoute ? `${baseRoute}/finances` : '/finances';

  return (
    <header className="sgx-navbar-fixed">
      <div className="sgx-navbar-inner">
        <div className="sgx-logo-brand" onClick={() => onNavClick('home')}>
          <OrganizationLogo variant="light" className="sgx-header-logo" />
        </div>

        <nav className="sgx-nav-menu">
          <a
            href={baseRoute || '/'}
            className={`sgx-nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavClick('home');
            }}
          >
            Trang chủ
          </a>
          <a
            href={baseRoute ? `${baseRoute}/map` : '/map'}
            className={`sgx-nav-link ${currentPage === 'map' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavClick('map');
            }}
          >
            Bản đồ & Báo điểm rác
          </a>
          <a
            href={baseRoute ? `${baseRoute}/trophy` : '/trophy'}
            className={`sgx-nav-link ${currentPage === 'trophy' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavClick('trophy');
            }}
          >
            Chiến tích
          </a>
          <a
            href={baseRoute ? `${baseRoute}/cooperate` : '/cooperate'}
            className={`sgx-nav-link ${currentPage === 'cooperate' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavClick('cooperate');
            }}
          >
            Hợp tác với KOL
          </a>
          <a
            href={baseRoute ? `${baseRoute}/about` : '/about'}
            className={`sgx-nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavClick('about');
            }}
          >
            Giới thiệu
          </a>
          <a
            href={baseRoute ? `${baseRoute}/finances` : '/finances'}
            className={`sgx-nav-link ${currentPage === 'finances' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavClick('finances');
            }}
          >
            Minh bạch tài chính
          </a>
        </nav>

        <div className="sgx-nav-actions">
          <SgxMoreMenu compact />
          <Link
            className="sgx-account-link"
            aria-current={currentPage === 'account' ? 'page' : undefined}
            to={accountLink}
          >
            {user ? 'Tài khoản' : 'Đăng nhập'}
          </Link>
          {onOpenDonate ? (
            <button type="button" className="btn-donate-top" onClick={onOpenDonate}>
              QUYÊN GÓP
            </button>
          ) : (
            <Link className="btn-donate-top" to={financesLink}>
              QUYÊN GÓP
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
