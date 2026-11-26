import React, { useState } from 'react';
import { patch } from '../../api';
import { AccountLoadState, useAccountResource } from '../mobile/account/useAccountResource';
import { privacyStatuses, type PrivacyRequest } from '../mobile/account/accountTypes';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import './adminPrivacy.css';

type AdminRequest = PrivacyRequest & { user: { name: string; email: string } | null };

export function AdminPrivacyTab() {
  const resource = useAccountResource<AdminRequest[]>('/public/saigonxanh/admin/privacy-requests');
  const [busy, setBusy] = useState(''),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');

  const update = async (id: string, status: string) => {
    if (busy) return;
    setBusy(id);
    setError('');
    setSuccess('');
    try {
      await patch(`/public/saigonxanh/admin/privacy-requests/${id}`, { status });
      setSuccess('Đã cập nhật và gửi thông báo cho người yêu cầu.');
      resource.reload();
    } catch {
      setError('Không cập nhật được yêu cầu. Vui lòng tải lại và thử lại.');
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="tab-pane-fade">
      <div className="admin-actions-bar">
        <div className="actions-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
            {resource.data?.length || 0} yêu cầu
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-secondary-admin"
            onClick={resource.reload}
            disabled={resource.loading}
            title="Tải lại danh sách"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="panel-header">
          <h2 style={{ margin: 0 }}>Yêu cầu xóa tài khoản & Dữ liệu người dùng</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Tiếp nhận, xác minh với người yêu cầu và thông báo trạng thái xử lý bảo mật thông tin.
          </p>
        </div>

        <AccountLoadState {...resource} />

        {error && (
          <p role="alert" className="admin-privacy-error" style={{ margin: '16px 20px' }}>
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="admin-privacy-success" style={{ margin: '16px 20px' }}>
            {success}
          </p>
        )}

        {resource.data && !resource.data.length ? (
          <div className="admin-empty-state">
            <div className="empty-icon"><ShieldCheck size={22} /></div>
            <h3 className="empty-title">Không có yêu cầu xóa tài khoản nào</h3>
            <p className="empty-desc">
              Tất cả các tài khoản người dùng và tình nguyện viên hiện đang hoạt động bình thường.
            </p>
          </div>
        ) : (
          <div style={{ padding: '16px 20px' }}>
            {resource.data?.map((row) => (
              <article key={row.id} data-request-id={row.id} className="admin-privacy-item">
                <div className="admin-privacy-identity">
                  <h3>{row.user?.name || 'Tài khoản không còn tồn tại'}</h3>
                  <span>{row.user?.email}</span>
                </div>
                <strong>{privacyStatuses[row.status] || row.status}</strong>
                <time dateTime={row.createdAt}>{new Date(row.createdAt).toLocaleString('vi-VN')}</time>
                <p>{row.message}</p>
                {['PENDING', 'PROCESSING'].includes(row.status) && (
                  <div className="admin-privacy-actions">
                    {row.status === 'PENDING' && (
                      <button
                        type="button"
                        disabled={!!busy}
                        onClick={() => update(row.id, 'PROCESSING')}
                      >
                        Tiếp nhận xử lý
                      </button>
                    )}
                    <button type="button" disabled={!!busy} onClick={() => update(row.id, 'REJECTED')}>
                      Chưa chấp nhận
                    </button>
                    {busy === row.id && <span role="status">Đang lưu…</span>}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
