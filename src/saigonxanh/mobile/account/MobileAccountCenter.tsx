import { ArrowLeft } from 'lucide-react';
import type { AccountPage } from './accountTypes';
import { AccountEditScreen } from './AccountEditScreen';
import { AccountOrdersScreen } from './AccountOrdersScreen';
import { AccountNotificationsScreen } from './AccountNotificationsScreen';
import { AccountPrivacyScreen } from './AccountPrivacyScreen';
import { AccountPermissionsScreen } from './AccountPermissionsScreen';
import { AccountRegistrationsScreen } from './AccountRegistrationsScreen';
import './accountCenter.css';

const titles: Record<AccountPage, string> = {
  edit: 'Thông tin cá nhân',
  gifts: 'Quà của tôi',
  orders: 'Quản lý đơn đổi quà',
  notifications: 'Thông báo',
  privacy: 'Yêu cầu xóa tài khoản',
  permissions: 'Quyền của ứng dụng',
  registrations: 'Hoạt động đã đăng ký',
};
export function MobileAccountCenter({
  page,
  onBack,
  onSaved,
}: {
  page: AccountPage;
  onBack: () => void;
  onSaved: () => void;
}) {
  return (
    <section className="account-center">
      <header className="account-center-header">
        <button type="button" onClick={onBack} aria-label="Quay lại Cá nhân">
          <ArrowLeft size={22} />
        </button>
        <h1>{titles[page]}</h1>
      </header>
      <div className="account-center-body" key={page}>
        {page === 'edit' && <AccountEditScreen onSaved={onSaved} />}
        {(page === 'gifts' || page === 'orders') && (
          <AccountOrdersScreen gifts={page === 'gifts'} />
        )}
        {page === 'notifications' && <AccountNotificationsScreen />}
        {page === 'privacy' && <AccountPrivacyScreen />}
        {page === 'permissions' && <AccountPermissionsScreen />}
        {page === 'registrations' && <AccountRegistrationsScreen />}
      </div>
    </section>
  );
}
