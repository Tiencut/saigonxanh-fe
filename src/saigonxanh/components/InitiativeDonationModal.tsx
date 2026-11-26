import React, { useState } from 'react';
import { X, Heart, CheckCircle, Loader2, Sparkles, QrCode } from 'lucide-react';
import { sgxApi } from '../api';
import type { RiverProtectionInitiative } from '../types';

interface InitiativeDonationModalProps {
  isOpen: boolean;
  initiative: RiverProtectionInitiative | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = [200000, 500000, 1000000, 2000000];

export const InitiativeDonationModal: React.FC<InitiativeDonationModalProps> = ({
  isOpen,
  initiative,
  onClose,
  onSuccess,
}) => {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState<number>(500000);
  const [customAmount, setCustomAmount] = useState('');
  const [itemSponsored, setItemSponsored] = useState(
    initiative?.category === 'cleanup_activity' ? `Ủng hộ ${initiative.title}` : 'Ủng hộ hoạt động'
  );
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      setErrorMsg('Vui lòng nhập tên người đóng góp');
      return;
    }

    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await sgxApi.donateInitiative({
        initiativeId: initiative?.id,
        donorName: donorName.trim(),
        amount: finalAmount || 0,
        itemSponsored: itemSponsored.trim(),
        message: message.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 2200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi gửi đóng góp');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Đóng góp và tài trợ hoạt động"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Heart size={20} fill="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#9a3412' }}>
                Đóng Góp & Tài Trợ Hoạt Động
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#c2410c' }}>
                {initiative ? initiative.title : 'Chung tay hồi sinh các dòng kênh'}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Đóng tài trợ"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#9a3412',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle size={36} />
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
              Cảm ơn tấm lòng vàng của bạn!
            </h4>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Tên và sự ủng hộ của bạn đã được ghi nhận vào danh sách nhà tài trợ đồng hành cùng các chiến dịch Sài Gòn Xanh.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {errorMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {errorMsg}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Tên cá nhân / Đơn vị đóng góp *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn A hoặc Công ty TNHH Môi Trường Xanh"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Chọn số tiền ủng hộ (VNĐ)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: amount === amt && !customAmount ? '2px solid #ea580c' : '1px solid #e2e8f0',
                      background: amount === amt && !customAmount ? '#ffedd5' : '#f8fafc',
                      color: amount === amt && !customAmount ? '#c2410c' : '#334155',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {amt.toLocaleString('vi-VN')} đ
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Hoặc nhập số tiền tùy chọn..."
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(0);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Vật tư hoặc Nội dung tài trợ
              </label>
              <input
                type="text"
                placeholder="VD: 50 bộ găng tay bảo hộ / 10 áo phao / Ủng hộ chi phí dọn rác"
                value={itemSponsored}
                onChange={(e) => setItemSponsored(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Lời nhắn gửi gắm đến các tình nguyện viên
              </label>
              <textarea
                rows={2}
                placeholder="VD: Chúc các bạn luôn mạnh khỏe và bền bỉ vì môi trường xanh sạch!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'none',
                }}
              />
            </div>

            {/* Quick QR Info preview */}
            <div
              style={{
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <QrCode size={28} color="#ea580c" />
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                <a
                  href="https://thiennguyen.app/user/saigonxanh1881"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#c2410c', fontWeight: 700 }}
                >
                  Ủng hộ & xem sao kê trên Thiện Nguyện
                </a>
                <br />
                Giao dịch ngân hàng chưa được đồng bộ về website.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#475569',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '10px 24px',
                  background: '#ea580c',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Xác nhận đóng góp</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
