import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { CampaignItem } from '../types';

interface CampaignRegisterModalProps {
  campaign: CampaignItem | null;
  onClose: () => void;
  regName: string;
  setRegName: (val: string) => void;
  regPhone: string;
  setRegPhone: (val: string) => void;
  regEmail: string;
  setRegEmail: (val: string) => void;
  regMessage: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const CampaignRegisterModal: React.FC<CampaignRegisterModalProps> = ({
  campaign,
  onClose,
  regName,
  setRegName,
  regPhone,
  setRegPhone,
  regEmail,
  setRegEmail,
  regMessage,
  onSubmit,
}) => {
  if (!campaign) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <h3>Đăng ký tham gia tình nguyện</h3>
        <h4>{campaign.title}</h4>
        <p>📍 {campaign.location}</p>
        <p>📅 Ngày: {new Date(campaign.startDate).toLocaleDateString('vi-VN')}</p>

        {regMessage ? (
          <div className="modal-success-box">
            <CheckCircle size={36} color="#16a34a" />
            <p>{regMessage}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                required
                placeholder="0901234567"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div className="modal-actions-row">
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
