import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, X, AlertCircle, Receipt, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { uploadAdminImage } from './adminImageUpload';

export const AddFinanceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  form: any;
  setForm: (val: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ isOpen, onClose, form, setForm, onSubmit }) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-dialog" style={{ maxWidth: '540px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: form.type === 'INCOME' ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: form.type === 'INCOME' ? '#16a34a' : '#dc2626' }}>
              {form.type === 'INCOME' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Ghi Nhận Giao Dịch Thu - Chi</h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>Cập nhật sổ quỹ thu chi minh bạch tài chính Sài Gòn Xanh</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Loại giao dịch *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'INCOME' | 'EXPENSE' })}
              >
                <option value="INCOME">Thu (+) - Quyên góp & Tài trợ</option>
                <option value="EXPENSE">Chi (-) - Chi phí thiết bị & Hoạt động</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Số tiền (VNĐ) *</label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Hạng mục chi phí / quyên góp *</label>
            <input
              type="text"
              required
              placeholder="VD: Mua phao chắn rác, Ủng cao bảo hộ, Quyên góp cá nhân..."
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Người ủng hộ / Đơn vị tiếp nhận</label>
            <input
              type="text"
              placeholder="Để trống sẽ ghi 'Ban điều phối' hoặc 'Nhà hảo tâm ẩn danh'"
              value={form.donorName || ''}
              onChange={(e) => setForm({ ...form, donorName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Diễn giải chi tiết nội dung giao dịch *</label>
            <textarea
              rows={3}
              required
              placeholder="Mục đích chi, số lượng vật tư hoặc nguồn tiền ủng hộ..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary-admin" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary-admin">
              Lưu Giao Dịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Modal Tặng Điểm TNV
