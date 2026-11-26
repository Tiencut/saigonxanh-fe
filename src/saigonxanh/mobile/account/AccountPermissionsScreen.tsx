import { useEffect, useState } from 'react';
import { MapPin, Camera, Bell } from 'lucide-react';
import { useAccountResource } from './useAccountResource';

const labels: Record<string, string> = {
  granted: 'Đã cấp quyền',
  denied: 'Đang bị chặn',
  prompt: 'Chưa cấp quyền',
  default: 'Chưa cấp quyền',
  unknown: 'Trình duyệt không cung cấp trạng thái',
};
export function AccountPermissionsScreen() {
  const [states, setStates] = useState<Record<string, string>>({
    geolocation: 'unknown',
    camera: 'unknown',
  });
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState('');
  const { data: config } = useAccountResource<{ modules: { pwa: boolean } }>('/public/config');
  useEffect(() => {
    let active = true;
    const cleanups: (() => void)[] = [];
    void Promise.all(
      ['geolocation', 'camera'].map(async (name) => {
        try {
          const result = await navigator.permissions.query({ name: name as PermissionName });
          if (!active) return;
          const update = () => {
            if (active) setStates((previous) => ({ ...previous, [name]: result.state }));
          };
          update();
          result.addEventListener('change', update);
          cleanups.push(() => result.removeEventListener('change', update));
        } catch {
          /* Unsupported permission queries keep an honest unknown state. */
        }
      }),
    );
    return () => {
      active = false;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Trình duyệt không hỗ trợ định vị.');
      return;
    }
    setBusy(true);
    setMessage('');
    navigator.geolocation.getCurrentPosition(
      () => {
        setBusy(false);
        setStates((previous) => ({ ...previous, geolocation: 'granted' }));
        setMessage('Đã xác định được vị trí. Bạn có thể dùng bản đồ để báo điểm rác.');
      },
      (error) => {
        setBusy(false);
        if (error.code === 1) setStates((previous) => ({ ...previous, geolocation: 'denied' }));
        setMessage(
          error.code === 1
            ? 'Quyền vị trí đang bị chặn. Hãy mở cài đặt trang web để cho phép.'
            : 'Chưa xác định được vị trí. Hãy kiểm tra GPS và thử lại.',
        );
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  };
  const notifications = typeof Notification === 'undefined' ? 'unknown' : Notification.permission;
  return (
    <>
      <p className="account-center-intro">
        Quyền do trình duyệt và thiết bị quản lý. Ứng dụng chỉ đọc trạng thái khi trình duyệt hỗ
        trợ.
      </p>
      <article className="account-center-permission">
        <h2>
          <MapPin size={20} />
          Vị trí
        </h2>
        <strong>{labels[states.geolocation]}</strong>
        <p>Dùng để định vị trên bản đồ và báo điểm rác.</p>
        <button type="button" disabled={busy} onClick={requestLocation}>
          {busy ? 'Đang xác định vị trí…' : 'Kiểm tra vị trí'}
        </button>
      </article>
      <article className="account-center-permission">
        <h2>
          <Camera size={20} />
          Máy ảnh
        </h2>
        <strong>{labels[states.camera]}</strong>
        <p>
          Quyền camera và hộp chọn ảnh là hai cơ chế khác nhau. Khi cần đổi quyền camera, mở cài đặt
          quyền của trang web trong trình duyệt.
        </p>
      </article>
      <article className="account-center-permission">
        <h2>
          <Bell size={20} />
          Thông báo
        </h2>
        <strong>{labels[notifications]}</strong>
        <p>
          {config?.modules.pwa
            ? 'Quyền trình duyệt không đồng nghĩa thiết bị đã đăng ký nhận thông báo đẩy.'
            : 'Thông báo đẩy chưa bật trên hệ thống. Bạn vẫn đọc được thông báo trong mục Cá nhân → Thông báo.'}
        </p>
      </article>
      {message && (
        <p role="status" className="account-center-info">
          {message}
        </p>
      )}
      <p className="account-center-muted">
        Để thay đổi quyền đã chặn, mở cài đặt trang web của trình duyệt. Website không thể tự cấp
        lại quyền thay bạn.
      </p>
    </>
  );
}
