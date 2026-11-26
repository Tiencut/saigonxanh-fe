import React from 'react';
import type { CampaignItem, RewardItem, MobileUser } from '../types';

// 1. Modal Đăng Ký Chiến Dịch
export const MobileCampaignRegisterModal: React.FC<{
  campaign: CampaignItem | null;
  onClose: () => void;
  regName: string;
  setRegName: (val: string) => void;
  regPhone: string;
  setRegPhone: (val: string) => void;
  regEmail: string;
  setRegEmail: (val: string) => void;
  regSuccess: string;
  onSubmit: (e: React.FormEvent) => void;
}> = ({
  campaign,
  onClose,
  regName,
  setRegName,
  regPhone,
  setRegPhone,
  regEmail,
  setRegEmail,
  regSuccess,
  onSubmit,
}) => {
  if (!campaign) return null;

  return (
    <div className="mobile-modal-overlay">
      <div className="mobile-modal-sheet">
        <h3>Đăng ký: {campaign.title}</h3>
        {regSuccess ? (
          <div className="modal-success-box">{regSuccess}</div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="0901234567"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="modal-btn-row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Xác nhận đăng ký
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// 2. Modal Đổi Quà Tặng
export const MobileRedeemGiftModal: React.FC<{
  reward: RewardItem | null;
  user: MobileUser | null;
  onClose: () => void;
  recipientName: string;
  setRecipientName: (val: string) => void;
  recipientPhone: string;
  setRecipientPhone: (val: string) => void;
  recipientAddress: string;
  setRecipientAddress: (val: string) => void;
  redeemSuccessMsg: string;
  redeemErrorMsg: string;
  onSubmit: (e: React.FormEvent) => void;
}> = ({
  reward,
  user,
  onClose,
  recipientName,
  setRecipientName,
  recipientPhone,
  setRecipientPhone,
  recipientAddress,
  setRecipientAddress,
  redeemSuccessMsg,
  redeemErrorMsg,
  onSubmit,
}) => {
  if (!reward) return null;

  return (
    <div className="mobile-modal-overlay">
      <div className="mobile-modal-sheet">
        <h3>Đổi quà: {reward.name}</h3>
        <p className="modal-sub">
          Điểm cần: <strong>{reward.pointsRequired.toLocaleString()} điểm</strong> | Hiện có:{' '}
          {user?.points.toLocaleString()} điểm
        </p>

        {redeemSuccessMsg && <div className="modal-success-box">{redeemSuccessMsg}</div>}
        {redeemErrorMsg && <div className="modal-error-box">{redeemErrorMsg}</div>}

        {!redeemSuccessMsg && (
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Người nhận *</label>
              <input
                type="text"
                required
                value={recipientName || user?.name || ''}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại nhận hàng *</label>
              <input
                type="tel"
                required
                placeholder="090..."
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ nhận quà *</label>
              <input
                type="text"
                required
                placeholder="Số nhà, đường, phường, quận..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>
            <div className="modal-btn-row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Đóng
              </button>
              <button type="submit" className="btn btn-primary">
                Đổi ngay
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
