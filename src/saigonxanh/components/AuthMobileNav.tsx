import { Link } from 'react-router-dom';
import { Home, Sprout, RefreshCw, UserRound } from 'lucide-react';
import './mobilePublicNav.css';

export function AuthMobileNav({ active = 'profile' }: { active?: 'profile' | null }) {
  return (
    <nav className="sgx-auth-mobile-nav" aria-label="Điều hướng ứng dụng">
      <Link to="/mobile">
        <Home size={21} />
        <span>Trang chủ</span>
      </Link>
      <Link to="/mobile?tab=activities">
        <Sprout size={21} />
        <span>Hoạt động</span>
      </Link>
      <Link to="/mobile?tab=rewards">
        <RefreshCw size={21} />
        <span>Đổi điểm</span>
      </Link>
      <Link to="/mobile?tab=profile" aria-current={active === 'profile' ? 'page' : undefined}>
        <UserRound size={21} />
        <span>Cá nhân</span>
      </Link>
    </nav>
  );
}
