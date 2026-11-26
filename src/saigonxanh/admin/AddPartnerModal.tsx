import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, X, AlertCircle } from 'lucide-react';
import { uploadAdminImage } from './adminImageUpload';
export const AddPartnerModal: React.FC<{
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  form: any;
  setForm: (val: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ isOpen, isEditing, onClose, form, setForm, onSubmit }) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-dialog" style={{ maxWidth: '560px', maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
            {isEditing ? 'Chỉnh Sửa Nhà Đồng Hành' : 'Thêm Nhà Đồng Hành / Nhà Tài Trợ'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
            Chỉ hồ sơ đã xác minh và bật hiển thị mới xuất hiện công khai. Thông tin đóng góp cần được đối chiếu với chứng từ thực tế.
          </div>

          <div className="form-group">
            <label>Tên đơn vị / Cá nhân tài trợ *</label>
            <input
              type="text"
              required
              placeholder="VD: Quỹ Hy Vọng, Công ty Nhựa Duy Tân..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="partner-verification">Trạng thái xác minh</label>
              <select id="partner-verification" value={form.verificationStatus || 'PENDING'} onChange={(e) => setForm({ ...form, verificationStatus: e.target.value })}>
                <option value="PENDING">Chờ xác minh</option><option value="VERIFIED">Đã xác minh</option><option value="HIDDEN">Ẩn</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Phân loại nhóm *</label>
              <select
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value })}
              >
                <option value="org">Tổ chức đã gây quỹ (org)</option>
                <option value="sponsor">Đơn vị tài trợ vật tư/phương tiện (sponsor)</option>
                <option value="individual">Cá nhân đóng góp (individual)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="partner-source">Nguồn xác nhận {form.verificationStatus === 'VERIFIED' ? '*' : '(nếu có)'}</label>
            <textarea id="partner-source" rows={2} required={form.verificationStatus === 'VERIFIED'} value={form.verificationSource || ''}
              placeholder="Liên kết thông báo chính thức hoặc mã chứng từ đã đối chiếu" onChange={(e) => setForm({ ...form, verificationSource: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Logo / Biểu tượng nhận diện</label>
            <select
              value={form.type || 'generic'}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="generic">Mặc định (Biểu tượng lá xanh)</option>
              <option value="coca">Logo Coca-Cola</option>
              <option value="unilever">Logo Unilever</option>
              <option value="grab">Logo Grab</option>
              <option value="aeon">Logo AEON Mall</option>
              <option value="dst">Logo DST Entertainment</option>
              <option value="greenviet">Logo GreenViet</option>
              <option value="heart">Biểu tượng Trái Tim (Mạnh thường quân)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Giá trị đóng góp *</label>
              <input
                type="text"
                required
                placeholder="VD: 50.000.000 đ hoặc 200 bộ ủng..."
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label>Ngày đóng góp</label>
              <input
                type="text"
                placeholder="VD: 15/09/2026"
                value={form.date || ''}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mục đích / Nội dung tài trợ *</label>
            <input
              type="text"
              required
              placeholder="VD: Hỗ trợ lắp đặt BOM NỔI, Nước uống tình nguyện viên..."
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Thứ tự hiển thị (ưu tiên số nhỏ trước)</label>
              <input
                type="number"
                min={0}
                value={form.order ?? 0}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
            <div className="form-group flex-1" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label className="admin-crud-checkbox-row" style={{ width: '100%', boxSizing: 'border-box' }}>
                <input
                  type="checkbox"
                  checked={form.active !== false}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                <span>Cho phép hiển thị công khai</span>
              </label>
            </div>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary-admin" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary-admin">
              {isEditing ? 'Cập Nhật' : 'Thêm Vào Danh Sách'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 5. Modal Đăng Tin Tức Mới
