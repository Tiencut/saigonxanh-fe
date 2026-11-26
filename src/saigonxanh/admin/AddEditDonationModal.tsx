import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Heart } from 'lucide-react';
import type { ActivityDonation, RiverProtectionInitiative } from '../types';

interface AddEditDonationModalProps {
  isOpen: boolean;
  donation: ActivityDonation | null;
  initiatives: RiverProtectionInitiative[];
  onClose: () => void;
  onSave: (data: Partial<ActivityDonation>) => Promise<void>;
}

export const AddEditDonationModal: React.FC<AddEditDonationModalProps> = ({
  isOpen,
  donation,
  initiatives,
  onClose,
  onSave,
}) => {

  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState<number>(500000);
  const [itemSponsored, setItemSponsored] = useState('');
  const [initiativeId, setInitiativeId] = useState('');
  const [message, setMessage] = useState('');
  const [timeAgo, setTimeAgo] = useState('Vừa xong');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (donation) {
      setDonorName(donation.donorName || '');
      setAmount(donation.amount || 0);
      setItemSponsored(donation.itemSponsored || '');
      setInitiativeId(donation.initiativeId || '');
      setMessage(donation.message || '');
      setTimeAgo(donation.timeAgo || 'Vừa xong');
    } else {
      setDonorName('');
      setAmount(500000);
      setItemSponsored('Ủng hộ 50 bộ găng tay bảo hộ');
      setInitiativeId(initiatives.find((i) => i.category === 'cleanup_activity')?.id || '');
      setMessage('Tiếp sức cho các chiến binh Sài Gòn Xanh');
      setTimeAgo('Vừa xong');
    }
  }, [donation, isOpen, initiatives]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      setErrorMsg('Vui lòng nhập tên người đóng góp');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      await onSave({
        donorName: donorName.trim(),
        amount: Number(amount) || 0,
        itemSponsored: itemSponsored.trim(),
        initiativeId: initiativeId || null,
        message: message.trim(),
        timeAgo: timeAgo.trim() || 'Vừa xong',
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

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
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="#ea580c" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              {donation ? 'Sửa Lượt Đóng Góp' : 'Thêm Lượt Đóng Góp Mới'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

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
              Tên cá nhân / Doanh nghiệp đóng góp *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Công ty TNHH Nhựa Xanh hoặc Nguyễn Văn A"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Số tiền đóng góp (VNĐ)
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Thời gian hiển thị (VD: 15 phút trước)
              </label>
              <input
                type="text"
                value={timeAgo}
                onChange={(e) => setTimeAgo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Vật phẩm hoặc Hạng mục tài trợ
            </label>
            <input
              type="text"
              placeholder="VD: 50 bộ găng tay bảo hộ hoặc 10 áo phao"
              value={itemSponsored}
              onChange={(e) => setItemSponsored(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Dự án liên kết (tùy chọn)
            </label>
            <select
              value={initiativeId}
              onChange={(e) => setInitiativeId(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value="">-- Không gắn dự án cụ thể --</option>
              {initiatives.map((i) => (
                <option key={i.id} value={i.id}>
                  [{i.category === 'bom_noi' ? 'Bom nổi' : i.category === 'school_community' ? 'Trường học' : 'Dọn dẹp'}]{' '}
                  {i.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Lời nhắn gửi gắm
            </label>
            <textarea
              rows={2}
              placeholder="VD: Chúc các bạn luôn giữ vững tinh thần cống hiến!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box',
                resize: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
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
              disabled={saving}
              style={{
                padding: '9px 22px',
                background: '#ea580c',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              <span>{donation ? 'Lưu thay đổi' : 'Tạo mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
