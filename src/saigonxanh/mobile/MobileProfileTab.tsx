import {
  Bell,
  ChevronRight,
  Gift,
  Package,
  Users,
  CalendarDays,
  UserRound,
  ShieldCheck,
  Trash2,
  LogOut,
  HandHeart,
  LockKeyhole,
} from 'lucide-react';
import type { MobileUser } from '../types';
import type { AccountPage } from './account/accountTypes';
import './mobileProfile.css';

interface MobileProfileTabProps {
  user: MobileUser | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenInvite: () => void;
  onOpenAccount: (page: AccountPage) => void;
  onSwitchToWeb?: () => void;
  onSwitchToAdmin?: () => void;
  canAdmin?: boolean;
}
export function MobileProfileTab({
  user,
  onLogout,
  onOpenLogin,
  onOpenInvite,
  onOpenAccount,
  onSwitchToAdmin,
  canAdmin,
}: MobileProfileTabProps) {
  const open = (page: AccountPage) => {
    if (user || page === 'permissions') onOpenAccount(page);
    else onOpenLogin();
  };
  return (
    <div className="tab-profile mobile-profile-real">
      <h1>Cá nhân</h1>
      <div className="profile-header-card">
        <button
          type="button"
          className="profile-identity-button"
          onClick={() => (user ? open('edit') : onOpenLogin())}
          aria-label={user ? 'Sửa thông tin cá nhân' : 'Đăng nhập tài khoản'}
        >
          <span className="profile-avatar-circle">
            <UserRound size={27} />
          </span>
          <span className="profile-user-info">
            <strong className="profile-name">{user?.name || 'Chào bạn!'}</strong>
            <span className="profile-email">
              {user?.email || 'Đăng nhập để tích điểm và tham gia hoạt động'}
            </span>
            {user && (
              <span className="profile-badge-row">{user.points.toLocaleString('vi-VN')} điểm</span>
            )}
          </span>
          {user && <ChevronRight size={18} />}
        </button>
        {!user && (
          <button type="button" className="btn-login-round" onClick={onOpenLogin}>
            Đăng nhập
          </button>
        )}
      </div>
      <div className="profile-menu-list">
        <button className="menu-item-link" type="button" onClick={() => open('edit')}>
          <UserRound size={20} />
          <span>Thông tin cá nhân</span>
          <ChevronRight size={18} />
        </button>
        <button className="menu-item-link" type="button" onClick={() => open('notifications')}>
          <Bell size={20} />
          <span>Thông báo</span>
          <ChevronRight size={18} />
        </button>
        <button className="menu-item-link" type="button" onClick={() => open('gifts')}>
          <Gift size={20} />
          <span>Quà của tôi</span>
          <ChevronRight size={18} />
        </button>
        <button className="menu-item-link" type="button" onClick={() => open('orders')}>
          <Package size={20} />
          <span>Quản lý đơn đổi quà</span>
          <ChevronRight size={18} />
        </button>
        <button className="menu-item-link" type="button" onClick={() => open('registrations')}>
          <CalendarDays size={20} />
          <span>Hoạt động đã đăng ký</span>
          <ChevronRight size={18} />
        </button>
        <button className="menu-item-link" type="button" onClick={onOpenInvite}>
          <Users size={20} />
          <span>Giới thiệu cho bạn bè</span>
          <ChevronRight size={18} />
        </button>
        <a className="menu-item-link" href="/finances">
          <HandHeart size={20} />
          <span>Quyên góp và trang web SGX</span>
          <ChevronRight size={18} />
        </a>
        <button className="menu-item-link" type="button" onClick={() => open('permissions')}>
          <ShieldCheck size={20} />
          <span>Quyền của ứng dụng</span>
          <ChevronRight size={18} />
        </button>
        {canAdmin && (
          <button className="menu-item-link" type="button" onClick={onSwitchToAdmin}>
            <LockKeyhole size={20} />
            <span>Hệ thống Quản trị (Admin)</span>
            <ChevronRight size={18} />
          </button>
        )}
        {user && (
          <>
            <button
              className="menu-item-link is-danger"
              type="button"
              onClick={() => open('privacy')}
            >
              <Trash2 size={20} />
              <span>Yêu cầu xóa tài khoản</span>
              <ChevronRight size={18} />
            </button>
            <button className="menu-item-link btn-logout" type="button" onClick={onLogout}>
              <LogOut size={20} />
              <span>Đăng xuất</span>
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
