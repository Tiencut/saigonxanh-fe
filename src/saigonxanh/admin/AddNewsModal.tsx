import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, X, AlertCircle, Newspaper } from 'lucide-react';
import { uploadAdminImage } from './adminImageUpload';
export const AddNewsModal: React.FC<{
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
      setForm({ ...form, coverImage: url });
    } catch (err: any) {
      setUploadError(err.message || 'Không thể upload ảnh lên máy chủ');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-dialog" style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <Newspaper size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Đăng Tin Tức & Hoạt Động Mới</h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>Chia sẻ hình ảnh và cập nhật tiến độ chiến dịch dọn rác</p>
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
          <div className="form-group">
            <label>Tiêu đề bài viết *</label>
            <input
              type="text"
              required
              placeholder="Tiêu đề tin tức..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Chuyên mục *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Hoạt động cộng đồng">Hoạt động cộng đồng</option>
                <option value="Chiến dịch làm sạch">Chiến dịch làm sạch</option>
                <option value="Câu chuyện tình nguyện">Câu chuyện tình nguyện</option>
                <option value="Truyền thông">Truyền thông & Báo chí</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Nguồn tin</label>
              <input
                type="text"
                placeholder="VD: Báo Tuổi Trẻ, VTV, Sài Gòn Xanh Media..."
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              />
            </div>
          </div>

          {/* Chọn ảnh từ máy hoặc URL */}
          <div className="form-group">
            <label>Hình ảnh bài viết</label>
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
                placeholder="Hoặc dán URL ảnh..."
                value={form.coverImage || ''}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                style={{ flex: 1 }}
              />
            </div>
            {uploadError && (
              <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={14} />
                <span>{uploadError}</span>
              </div>
            )}
            {form.coverImage && (
              <div style={{ marginTop: '8px', position: 'relative', display: 'inline-block' }}>
                <img
                  src={form.coverImage}
                  alt="Xem trước ảnh"
                  style={{ maxHeight: '110px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, coverImage: '' })}
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
            <label>Tóm tắt ngắn (Excerpt) *</label>
            <textarea
              rows={2}
              required
              placeholder="Tóm tắt nội dung bài viết..."
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Nội dung chi tiết *</label>
            <textarea
              rows={4}
              required
              placeholder="Nội dung bài viết..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary-admin" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary-admin">
              Xuất Bản Bài Viết
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
