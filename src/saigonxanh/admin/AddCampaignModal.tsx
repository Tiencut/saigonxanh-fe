import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, X, AlertCircle } from 'lucide-react';
import { uploadAdminImage } from './adminImageUpload';
export const AddCampaignModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  form: any;
  setForm: (val: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ isOpen, onClose, form, setForm, onSubmit }) => {

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadAdminImage(file);
      setForm({ ...form, bannerImage: url });
    } catch (err: any) {
      setUploadError(err.message || 'Không thể upload ảnh lên máy chủ');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Tạo Chiến Dịch Ra Quân Mới</h3>
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
          <div className="form-group">
            <label>Tiêu đề chiến dịch *</label>
            <input
              type="text"
              required
              placeholder="VD: Làm sạch Rạch Xuyên Tâm - Gò Vấp"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Địa điểm cụ thể *</label>
              <input
                type="text"
                required
                placeholder="Rạch Xuyên Tâm, P.5"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label>Quận / Huyện *</label>
              <input
                type="text"
                required
                placeholder="Quận Gò Vấp, TP.HCM"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Ngày bắt đầu *</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label>TNV mục tiêu *</label>
              <input
                type="number"
                min="10"
                required
                value={form.targetVolunteers}
                onChange={(e) => setForm({ ...form, targetVolunteers: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Chọn file ảnh trực tiếp hoặc nhập URL */}
          <div className="form-group">
            <label>Hình ảnh đại diện chiến dịch</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label className="btn-secondary-admin" style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {uploading ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
                <span>{uploading ? 'Đang tải lên...' : 'Tải ảnh từ máy...'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploading}
                  style={{ display: 'none' }}
                  onChange={handleImageFileChange}
                />
              </label>
              <input
                type="text"
                placeholder="Hoặc dán URL ảnh / đường dẫn..."
                value={form.bannerImage || ''}
                onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
                style={{ flex: 1 }}
              />
            </div>
            {uploadError && (
              <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={14} />
                <span>{uploadError}</span>
              </div>
            )}
            {form.bannerImage && (
              <div style={{ marginTop: '8px', position: 'relative', display: 'inline-block' }}>
                <img
                  src={form.bannerImage}
                  alt="Xem trước ảnh"
                  style={{ maxHeight: '110px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, bannerImage: '' })}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Xóa ảnh"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Mô tả chi tiết chiến dịch</label>
            <textarea
              rows={3}
              placeholder="Thông tin trang bị bảo hộ, yêu cầu tiêm phòng uốn ván..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary-admin" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary-admin">
              Xác Nhận Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Modal Thêm Thu Chi
