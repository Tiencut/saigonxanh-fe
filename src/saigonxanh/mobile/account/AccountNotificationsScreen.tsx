import { useState } from 'react';
import { Bell } from 'lucide-react';
import { patch } from '../../../api';
import type { AccountNotice } from './accountTypes';
import { AccountLoadState, useAccountResource } from './useAccountResource';

export function AccountNotificationsScreen() {
  const [page, setPage] = useState(1),
    [busy, setBusy] = useState(''),
    [error, setError] = useState('');
  const resource = useAccountResource<{ rows: AccountNotice[]; unread: number }>(
    `/notifications?page=${page}&pageSize=20`,
  );
  const markRead = async (id: string) => {
    if (busy) return;
    setBusy(id);
    setError('');
    try {
      await patch(`/notifications/${id}/read`, {});
      resource.reload();
    } catch {
      setError('Chưa đánh dấu được thông báo. Vui lòng thử lại.');
    } finally {
      setBusy('');
    }
  };
  return (
    <>
      <p className="account-center-intro">
        Cập nhật về đơn đổi quà và các yêu cầu tài khoản. Đây là hộp thư trong ứng dụng.
      </p>
      <AccountLoadState {...resource} />
      {error && (
        <p role="alert" className="account-center-error">
          {error}
        </p>
      )}
      {resource.data && (
        <>
          <p className="account-center-muted">{resource.data.unread} thông báo chưa đọc</p>
          {!resource.data.rows.length && (
            <div className="account-center-empty">
              <Bell size={28} />
              <h2>Chưa có thông báo</h2>
              <p>Các cập nhật mới sẽ xuất hiện tại đây.</p>
            </div>
          )}
          {resource.data.rows.map((row) => (
            <article
              key={row.id}
              className={`account-center-notice ${row.readAt ? 'is-read' : ''}`}
            >
              <h2>{row.title}</h2>
              <p>{row.body}</p>
              <time dateTime={row.createdAt}>
                {new Date(row.createdAt).toLocaleString('vi-VN')}
              </time>
              {!row.readAt && (
                <button type="button" disabled={!!busy} onClick={() => markRead(row.id)}>
                  {busy === row.id ? 'Đang lưu…' : 'Đánh dấu đã đọc'}
                </button>
              )}
            </article>
          ))}
          <div className="account-center-pagination">
            <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Trước
            </button>
            <span>Trang {page}</span>
            <button
              type="button"
              disabled={resource.data.rows.length < 20}
              onClick={() => setPage(page + 1)}
            >
              Tiếp
            </button>
          </div>
        </>
      )}
    </>
  );
}
