import React, { useState } from 'react';
import { Upload, ImageIcon, Loader2, X } from 'lucide-react';
import { uploadAdminImage } from './AdminModals';
import type { CommunityProgram } from '../types';

interface AddEditProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: CommunityProgram | null;
  form: {
    category: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    buttonText: string;
    order: number;
    active: boolean;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      category: string;
      title: string;
      subtitle: string;
      description: string;
      image: string;
      buttonText: string;
      order: number;
      active: boolean;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

const PRESET_PROGRAM_IMAGES = [
  { label: 'Gây quỹ trường học', url: '/images/trangChu/sponsor-gay-quy.png', category: 'school_fundraising' },
  { label: 'Tài trợ dọn dẹp', url: '/images/trangChu/sponsor-hoat-dong.png', category: 'cleanup_sponsorship' },
  { label: 'Tài trợ BOM Nổi', url: '/images/trangChu/sponsor-bom-noi.png', category: 'bom_noi' },
];

export const AddEditProgramModal: React.FC<AddEditProgramModalProps> = ({
  isOpen,
  onClose,
  program,
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
      setUploadError(err.message || 'Không thể tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
            {program ? 'Chỉnh Sửa Chương Trình Gây Quỹ / Tài Trợ' : 'Thêm Chương Trình Gây Quỹ / Tài Trợ Mới'}
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
            {/* Left Column */}
            <div>
              <div className="form-group">
                <label>Phân loại hạng mục *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="school_fundraising">Gây quỹ trường học / cộng đồng</option>
                  <option value="cleanup_sponsorship">Tài trợ hoạt động dọn dẹp</option>
                  <option value="bom_noi">Tài trợ BOM NỔI - Rào cản rác</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tiêu đề chương trình *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Tổ chức gây quỹ với trường học hoặc cộng đồng của bạn..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phụ đề / Nhãn vinh danh</label>
                <input
                  type="text"
                  placeholder="VD: Hợp tác giáo dục & Hành động xanh..."
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label>Chữ trên nút</label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                    placeholder="Liên hệ"
                  />
                </div>
                <div className="form-group">
                  <label>Thứ tự hiển thị</label>
                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Image & Preview */}
            <div>
              <div className="form-group">
                <label>Ảnh nền card *</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <input
                    type="text"
                    required
                    placeholder="/images/trangChu/... hoặc URL"
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

                {/* Quick preset images */}
                <div style={{ marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Ảnh tiêu chuẩn:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {PRESET_PROGRAM_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            image: preset.url,
                            category: preset.category,
                          })
                        }
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

                {/* Preview Thumbnail */}
                <div style={{ marginTop: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Xem trước Card:</span>
                  <div
                    style={{
                      marginTop: '6px',
                      width: '100%',
                      height: '140px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative',
                      background: '#0f172a',
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
                    {!form.image?.includes('sponsor-') && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}
                        >
                          {form.title || 'Tiêu đề chương trình'}
                        </p>
                        <button
                          type="button"
                          style={{
                            alignSelf: 'flex-start',
                            marginTop: '6px',
                            padding: '3px 10px',
                            background: '#fff',
                            color: '#000',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 700,
                          }}
                        >
                          {form.buttonText || 'Liên hệ'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '8px' }}>
            <label>Mô tả chi tiết / Lợi ích khi tham gia</label>
            <textarea
              rows={3}
              placeholder="Mô tả nội dung chương trình để người xem hiểu rõ quyền lợi và hình thức đồng hành..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0 20px' }}>
            <input
              type="checkbox"
              id="programActive"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="programActive" style={{ cursor: 'pointer', margin: 0, fontWeight: 500, color: '#1e293b' }}>
              Hiển thị công khai trên Website
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
              ) : program ? (
                'Cập Nhật Chương Trình'
              ) : (
                'Tạo Chương Trình Mới'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
