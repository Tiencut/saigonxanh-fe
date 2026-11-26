import React, { useState } from 'react';
import { Upload, ImageIcon, Loader2, X, AlertCircle } from 'lucide-react';
import { uploadAdminImage } from './AdminModals';
import type { KolItem } from '../types';

interface AddEditKolModalProps {
  isOpen: boolean;
  onClose: () => void;
  kol: KolItem | null;
  form: {
    name: string;
    role: string;
    badge: string;
    image: string;
    desc: string;
    order: number;
    active: boolean;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      role: string;
      badge: string;
      image: string;
      desc: string;
      order: number;
      active: boolean;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

const PRESET_IMAGES = [
  { label: 'Thùy Tiên', url: '/images/cooperate/thuyTien.jpg' },
  { label: 'Phương Mỹ Chi', url: '/images/cooperate/phuongMyChi.jpg' },
  { label: 'Đại Nghĩa', url: '/images/cooperate/daiNghia.jpg' },
  { label: 'Võ Tấn Phát', url: '/images/cooperate/voTanPhat.jpg' },
  { label: 'DJ Mie', url: '/images/cooperate/mie.jpg' },
  { label: 'Du Uyên', url: '/images/cooperate/duUyen.jpg' },
  { label: 'Pháo', url: '/images/cooperate/phao.jpg' },
  { label: 'Ngọc Châu', url: '/images/cooperate/ngocChau.jpg' },
];

export const AddEditKolModal: React.FC<AddEditKolModalProps> = ({
  isOpen,
  onClose,
  kol,
  form,
  setForm,
  onSubmit,
  isSubmitting = false,
}) => {

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadAdminImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      setUploadError(err.message || 'Không thể tải ảnh lên máy chủ');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '620px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
            {kol ? 'Chỉnh Sửa Gương Mặt KOL' : 'Thêm Gương Mặt Đồng Hành Mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
            {/* Left Column: Form Fields */}
            <div>
              <div className="form-group">
                <label>Họ và tên KOL / Nghệ sĩ *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoa hậu H'Hen Niê, MC Trấn Thành..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Vai trò / Danh xưng</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoa hậu Hoàn vũ, Ca sĩ, Diễn viên..."
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Huy hiệu / Tag vinh danh</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đại sứ xanh, Nghệ sĩ đồng hành..."
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Thứ tự hiển thị (nhỏ đứng trước)</label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
            </div>

            {/* Right Column: Image & Live Preview */}
            <div>
              <div className="form-group">
                <label>Ảnh đại diện *</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <input
                    type="text"
                    required
                    placeholder="/images/cooperate/... hoặc URL"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#334155',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {uploading ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
                    <span>{uploading ? 'Đang tải...' : 'Tải tệp'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {uploadError && (
                  <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0' }}>{uploadError}</p>
                )}

                {/* Quick preset selector */}
                <div style={{ marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Chọn nhanh ảnh có sẵn:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setForm({ ...form, image: preset.url })}
                        style={{
                          fontSize: '11px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: form.image === preset.url ? '1px solid #16a34a' : '1px solid #e2e8f0',
                          background: form.image === preset.url ? '#dcfce7' : '#f8fafc',
                          color: form.image === preset.url ? '#15803d' : '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Box */}
                <div style={{ marginTop: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                    Xem trước trên Carousel:
                  </span>
                  <div
                    style={{
                      marginTop: '6px',
                      width: '140px',
                      height: '140px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      background: '#0f172a',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  >
                    {form.image ? (
                      <img
                        src={form.image}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/trangChu/logo.png';
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8',
                        }}
                      >
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 'auto 0 0 0',
                        padding: '16px 8px 6px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                        color: '#ffffff',
                        textAlign: 'center',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          fontWeight: 700,
                          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {form.name || 'Tên nghệ sĩ'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '10px' }}>
            <label>Mô tả hoạt động / Lời nhắn đồng hành</label>
            <textarea
              rows={2}
              placeholder="Ví dụ: Đồng hành trao tặng phao chắn rác hoặc cùng các bạn trẻ lội kênh..."
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0 20px' }}>
            <input
              type="checkbox"
              id="kolActive"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="kolActive" style={{ cursor: 'pointer', margin: 0, fontWeight: 500, color: '#1e293b' }}>
              Hiển thị công khai trên Website (Carousel trang chủ & Trang Hợp tác)
            </label>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary-admin" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn-primary-admin" disabled={isSubmitting || uploading}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin" /> Đang lưu...
                </>
              ) : kol ? (
                'Cập Nhật Thông Tin'
              ) : (
                'Thêm Gương Mặt Mới'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
