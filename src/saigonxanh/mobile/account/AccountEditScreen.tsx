import { useEffect, useState } from 'react';
import { ApiError, patch, useAuth } from '../../../api';
import { accountPath, type AccountProfile } from './accountTypes';
import { AccountLoadState, useAccountResource } from './useAccountResource';

export function AccountEditScreen({ onSaved }: { onSaved: () => void }) {
  const resource = useAccountResource<AccountProfile>(accountPath + '/me');
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');
  useEffect(() => {
    if (resource.data)
      setForm({
        name: resource.data.name,
        phone: resource.data.phone || '',
        address: resource.data.address || '',
      });
  }, [resource.data]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await patch(accountPath + '/me', form);
      await useAuth.getState().reload();
      onSaved();
      setSuccess('Đã lưu thông tin cá nhân.');
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 422
          ? 'Thông tin chưa hợp lệ. Hãy kiểm tra họ tên, số điện thoại và địa chỉ.'
          : 'Không lưu được thông tin. Vui lòng thử lại.',
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <AccountLoadState {...resource} />
      {resource.data && (
        <form className="account-center-form" onSubmit={submit}>
          <p className="account-center-intro">
            Thông tin liên hệ dùng khi tham gia hoạt động và nhận quà.
          </p>
          <fieldset disabled={busy}>
            <label>
              Họ và tên <span aria-hidden="true">*</span>
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={resource.data.email}
                readOnly
                aria-describedby="account-email-help"
              />
            </label>
            <small id="account-email-help">Email đăng nhập không thể thay đổi tại đây.</small>
            <label>
              Số điện thoại
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={22}
                pattern="[+]?[0-9]{9,15}"
                title="Nhập từ 9 đến 15 chữ số, có thể bắt đầu bằng dấu +"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[ .()-]/g, '') })}
              />
            </label>
            <label>
              Địa chỉ liên hệ
              <textarea
                name="address"
                autoComplete="street-address"
                rows={3}
                maxLength={500}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>
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
            <button className="account-center-primary" type="submit">
              {busy ? 'Đang lưu…' : 'Lưu thông tin'}
            </button>
          </fieldset>
        </form>
      )}
    </>
  );
}
