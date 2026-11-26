import { useState } from 'react';
import { post } from '../../../api';
import { AccountLoadState, useAccountResource } from './useAccountResource';
import { accountPath, privacyStatuses, type PrivacyRequest } from './accountTypes';

export function AccountPrivacyScreen() {
  const resource = useAccountResource<PrivacyRequest[]>(accountPath + '/privacy-requests');
  const [message, setMessage] = useState(''),
    [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');
  const pending = resource.data?.some((row) => ['PENDING', 'PROCESSING'].includes(row.status));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || confirmation !== 'XÓA') return;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await post(accountPath + '/privacy-requests', { message, confirmation: 'XOA' });
      setMessage('');
      setConfirmation('');
      setSuccess('Đã gửi yêu cầu đến ban điều phối. Tài khoản của bạn chưa bị xóa.');
      resource.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gửi được yêu cầu.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <p className="account-center-intro">
        Gửi yêu cầu xóa tài khoản và dữ liệu cá nhân đến ban điều phối. Bạn có thể được liên hệ để
        xác minh trước khi xử lý. Thao tác gửi yêu cầu không xóa dữ liệu ngay.
      </p>
      <AccountLoadState {...resource} />
      {error && (
        <p role="alert" className="account-center-error">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="account-center-success">
          {success}
        </p>
      )}
      {resource.data && (
        <>
          {pending ? (
            <p className="account-center-info">
              Bạn đã có yêu cầu đang chờ xử lý. Trạng thái được cập nhật bên dưới.
            </p>
          ) : (
            <form className="account-center-form" onSubmit={submit}>
              <fieldset disabled={busy}>
                <label>
                  Nội dung yêu cầu <span aria-hidden="true">*</span>
                  <textarea
                    name="message"
                    minLength={10}
                    maxLength={5000}
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nêu yêu cầu và thông tin cần ban điều phối hỗ trợ…"
                  />
                </label>
                <label>
                  Nhập XÓA để xác nhận <span aria-hidden="true">*</span>
                  <input
                    name="confirmation"
                    autoComplete="off"
                    required
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    placeholder="XÓA"
                  />
                </label>
                <button
                  className="account-center-danger"
                  type="submit"
                  disabled={confirmation !== 'XÓA'}
                >
                  {busy ? 'Đang gửi…' : 'Gửi yêu cầu xóa tài khoản'}
                </button>
              </fieldset>
            </form>
          )}
          {!!resource.data.length && (
            <section className="account-center-request-history">
              <h2>Lịch sử yêu cầu</h2>
              {resource.data.map((row) => (
                <article key={row.id}>
                  <strong>{privacyStatuses[row.status] || row.status}</strong>
                  <time dateTime={row.createdAt}>
                    {new Date(row.createdAt).toLocaleString('vi-VN')}
                  </time>
                  <p>{row.message}</p>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </>
  );
}
