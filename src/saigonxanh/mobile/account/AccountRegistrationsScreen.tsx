import { CalendarDays } from 'lucide-react';
import { accountPath, type AccountProfile } from './accountTypes';
import { AccountLoadState, useAccountResource } from './useAccountResource';

export function AccountRegistrationsScreen() {
  const resource = useAccountResource<AccountProfile>(accountPath + '/me');
  const labels: Record<string, string> = {
    REGISTERED: 'Đã đăng ký',
    CONFIRMED: 'Đã xác nhận',
    ATTENDED: 'Đã tham gia',
    CHECKED_IN: 'Đã tham gia',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
  };
  return (
    <>
      <AccountLoadState {...resource} />
      {resource.data && (
        <>
          {!resource.data.registrations.length && (
            <div className="account-center-empty">
              <CalendarDays size={28} />
              <h2>Chưa đăng ký hoạt động</h2>
              <p>Các chiến dịch bạn đăng ký bằng tài khoản sẽ hiển thị ở đây.</p>
            </div>
          )}
          {resource.data.registrations.map((row) => (
            <article key={row.id} className="account-center-order">
              <h2>{row.campaign.title}</h2>
              <p>{labels[row.status] || row.status}</p>
              <p>{row.campaign.location}</p>
              <time dateTime={row.campaign.startDate}>
                {new Date(row.campaign.startDate).toLocaleString('vi-VN')}
              </time>
            </article>
          ))}
        </>
      )}
    </>
  );
}
