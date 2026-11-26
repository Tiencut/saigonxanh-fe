import React, { useCallback, useEffect, useState } from 'react';
import { authFetch } from './adminRequest';
import { Landmark, RefreshCw, X, ShieldCheck, CheckCircle2, AlertTriangle, Building2, ExternalLink } from 'lucide-react';

type BankHubStatus = { configured: boolean; connected: boolean; companyXid: string | null; organizationName: string };
type BankAccount = { xid: string; bankName: string; accountHolderName: string; accountNumber: string; accountType: string; bankApiConnected: string; active: string; lastTransaction: string | null };

export function BankAccountsTab() {
  const [status, setStatus] = useState<BankHubStatus | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [hostedUrl, setHostedUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statusResponse, accountsResponse] = await Promise.all([
        authFetch('/api/organizations/bankhub/status'),
        authFetch('/api/organizations/bankhub/accounts'),
      ]);
      const [statusResult, accountsResult] = await Promise.all([statusResponse.json(), accountsResponse.json()]);
      if (!statusResponse.ok) throw new Error(statusResult?.error?.message || statusResult?.message || 'Không tải được trạng thái kết nối.');
      setStatus(statusResult?.data || statusResult);
      if (accountsResponse.ok) setAccounts((accountsResult?.data || accountsResult)?.accounts || []);
    } catch (err: any) {
      setError(err.message || 'Không tải được trạng thái kết nối.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://bankhub.sepay.vn' && event.origin !== 'https://bankhub-sandbox.sepay.vn') return;
      const type = event.data?.event;
      if (type === 'FINISHED_BANK_ACCOUNT_LINK' || type === 'FINISHED_BANK_ACCOUNT_UNLINK') {
        setHostedUrl('');
        void refresh();
      } else if (type === 'BANKHUB_TOKEN_EXPIRED' || type === 'BANKHUB_SESSION_EXPIRED') {
        setError('Phiên kết nối đã hết hạn. Hãy thử kết nối lại.');
        setHostedUrl('');
      } else if (type === 'BANKHUB_CLOSE_LINK') {
        setHostedUrl('');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [refresh]);

  const connect = async () => {
    setConnecting(true);
    setError('');
    try {
      const response = await authFetch('/api/organizations/bankhub/connect', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || result?.message || 'Không tạo được phiên kết nối.');
      const url = result?.data?.hostedLinkUrl || result?.hostedLinkUrl;
      if (!url || (!url.startsWith('https://bankhub.sepay.vn/') && !url.startsWith('https://bankhub-sandbox.sepay.vn/'))) throw new Error('Liên kết SePay trả về không hợp lệ.');
      setHostedUrl(url);
    } catch (err: any) {
      setError(err.message || 'Không thể kết nối ngân hàng.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="tab-pane-fade">
      {/* Top Actions Bar */}
      <div className="admin-actions-bar">
        <div className="actions-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: status?.connected ? '#16a34a' : '#94a3b8',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
              {status?.connected
                ? `Đã liên kết SePay Bank Hub (${status.organizationName || 'Tổ chức'})`
                : 'Chưa liên kết ngân hàng'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="btn-secondary-admin"
            onClick={() => void refresh()}
            disabled={loading}
            title="Làm mới trạng thái"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            className="btn-primary-admin"
            onClick={() => void connect()}
            disabled={!status?.configured || connecting}
            title="Kết nối tài khoản ngân hàng chính thức qua SePay"
          >
            <Landmark size={15} />
            <span>{connecting ? 'Đang tạo phiên…' : status?.connected ? 'Thêm / Quản lý tài khoản' : 'Kết nối ngân hàng'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginBottom: 20,
            padding: '12px 16px',
            borderRadius: 8,
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
          }}
        >
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Panel */}
      <div className="admin-panel">
        <div className="panel-header">
          <h2>Tài khoản ngân hàng tiếp nhận thiện nguyện</h2>
          <p>
            Tài khoản ngân hàng của tổ chức được kết nối an toàn qua Open Banking (SePay Bank Hub).
            Thông tin xác thực và mã OTP được xử lý hoàn toàn trong hạ tầng bảo mật của SePay.
          </p>
        </div>

        {!status?.configured && (
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 8,
              color: '#b45309',
              margin: '0 20px 20px',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <AlertTriangle size={18} />
            <span>Nền tảng chưa được cấu hình Client Credentials từ SePay. Vui lòng kiểm tra cấu hình môi trường.</span>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ margin: 0 }}>Đang kiểm tra kết nối với SePay Bank Hub…</p>
          </div>
        ) : accounts.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#64748b',
              }}
            >
              <Landmark size={28} />
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#1e293b', fontWeight: 650 }}>
              Chưa có tài khoản ngân hàng nào được liên kết
            </h4>
            <p style={{ margin: '0 0 20px', fontSize: 14, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              Bấm nút &quot;Kết nối ngân hàng&quot; ở trên để ủy quyền tài khoản nhận ủng hộ thiện nguyện minh bạch.
            </p>
            <button
              type="button"
              className="btn-primary-admin"
              style={{ margin: '0 auto' }}
              onClick={() => void connect()}
              disabled={!status?.configured || connecting}
            >
              <Landmark size={15} />
              <span>{connecting ? 'Đang tạo phiên…' : 'Bắt đầu kết nối ngân hàng'}</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ngân hàng</th>
                  <th>Số tài khoản</th>
                  <th>Tên thụ hưởng</th>
                  <th>Loại tài khoản</th>
                  <th>Trạng thái</th>
                  <th>Giao dịch gần nhất</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const isActive = account.active === '1' || account.active.toLowerCase() === 'true';
                  return (
                    <tr key={account.xid}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Building2 size={18} color="#0284c7" />
                          <span>{account.bankName}</span>
                        </div>
                      </td>
                      <td className="font-mono" style={{ fontWeight: 600 }}>
                        {account.accountNumber}
                      </td>
                      <td>{account.accountHolderName}</td>
                      <td>
                        <span style={{ fontSize: 13, color: '#64748b' }}>
                          {account.accountType === 'PERSONAL' || account.accountType === 'personal'
                            ? 'Cá nhân'
                            : account.accountType === 'BUSINESS' || account.accountType === 'business'
                            ? 'Doanh nghiệp'
                            : account.accountType || 'Thường'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${isActive ? 'verified' : 'pending'}`}>
                          {isActive ? 'Đang hoạt động' : 'Chưa kích hoạt'}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: '#64748b' }}>
                        {account.lastTransaction
                          ? new Date(account.lastTransaction).toLocaleString('vi-VN')
                          : 'Chưa có'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hosted Link iFrame Modal / Container */}
      {hostedUrl && (
        <div
          style={{
            marginTop: 24,
            border: '1px solid #cbd5e1',
            borderRadius: 12,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={20} color="#16a34a" />
              <strong>Khung liên kết bảo mật SePay Bank Hub</strong>
              <span
                style={{
                  fontSize: 12,
                  padding: '2px 8px',
                  borderRadius: 99,
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 600,
                }}
              >
                SSL 256-bit
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <a
                href={hostedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-admin"
                style={{ padding: '6px 12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                title="Mở trong tab riêng nếu trình duyệt chặn hiển thị nội tuyến"
              >
                <ExternalLink size={14} />
                <span>Mở trong tab riêng</span>
              </a>
              <button
                type="button"
                className="btn-secondary-admin"
                onClick={() => setHostedUrl('')}
                style={{ padding: '6px 12px' }}
              >
                <X size={15} />
                <span>Đóng</span>
              </button>
            </div>
          </div>
          <iframe
            title="SePay Bank Hub"
            src={hostedUrl}
            style={{ display: 'block', width: '100%', height: 680, border: 0 }}
            allow="clipboard-write"
          />
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              fontSize: 13,
              color: '#64748b',
            }}
          >
            Lưu ý an toàn: Không bao giờ cung cấp mật khẩu ngân hàng hoặc mã OTP ra ngoài khung liên kết chính thức của SePay.
          </div>
        </div>
      )}
    </div>
  );
}
