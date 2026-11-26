import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { RiverProtectionInitiative } from '../types';
interface AddEditInitiativeModalProps {
  isOpen: boolean;
  initiative: RiverProtectionInitiative | null;
  onClose: () => void;
  onSave: (data: Partial<RiverProtectionInitiative>) => Promise<void>;
}
export const AddEditInitiativeModal: React.FC<AddEditInitiativeModalProps> = ({
  isOpen,
  initiative,
  onClose,
  onSave,
}) => {
  const [category, setCategory] = useState<'bom_noi' | 'school_community' | 'cleanup_activity'>('bom_noi');
  const [title, setTitle] = useState('');
  const [locationOrOrg, setLocationOrOrg] = useState('');
  const [metaInfo, setMetaInfo] = useState('');
  const [targetQuantity, setTargetQuantity] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [raisedAmount, setRaisedAmount] = useState<number>(0);
  const [status, setStatus] = useState('ongoing');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  useEffect(() => {
    if (initiative) {
      setCategory((initiative.category as any) || 'bom_noi');
      setTitle(initiative.title || '');
      setLocationOrOrg(initiative.locationOrOrg || '');
      setMetaInfo(initiative.metaInfo || '');
      setTargetQuantity(initiative.targetQuantity || '');
      setTargetAmount(initiative.targetAmount || 0);
      setRaisedAmount(initiative.raisedAmount || 0);
      setStatus(initiative.status || 'ongoing');
      setImage(initiative.image || '');
      setOrder(initiative.order || 1);
      setActive(initiative.active !== false);
    } else {
      setCategory('bom_noi');
      setTitle('');
      setLocationOrOrg('');
      setMetaInfo('');
      setTargetQuantity('');
      setTargetAmount(30);
      setRaisedAmount(0);
      setStatus('ongoing');
      setImage('/images/trangChu/1.png');
      setOrder(1);
      setActive(true);
    }
  }, [initiative, isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationOrOrg.trim()) {
      setErrorMsg('Vui lòng điền tiêu đề và địa điểm/đơn vị');
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      await onSave({
        category,
        title: title.trim(),
        locationOrOrg: locationOrOrg.trim(),
        metaInfo: metaInfo.trim(),
        targetQuantity: targetQuantity.trim(),
        targetAmount: Number(targetAmount) || 0,
        raisedAmount: Number(raisedAmount) || 0,
        status,
        image: image.trim() || '/images/trangChu/1.png',
        order: Number(order) || 0,
        active,
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
          maxWidth: '560px',
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
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
            {initiative ? 'Chỉnh Sửa Hạng Mục Dự Án' : 'Thêm Hạng Mục Dự Án Mới'}
          </h3>
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
          {/* Category */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Cột danh mục *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value="bom_noi">Cột 1: Tài trợ BOM NỔI - Rào Cản Rác</option>
              <option value="school_community">Cột 2: Tổ chức gây quỹ với trường học hoặc cộng đồng</option>
              <option value="cleanup_activity">Cột 3: Tài trợ cho các hoạt động dọn dẹp vệ sinh</option>
            </select>
          </div>
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Tiêu đề hạng mục / địa điểm *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Rào chắn kênh Nhiêu Lộc hoặc Găng tay & dụng cụ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          {/* Location / Org */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                {category === 'school_community' ? 'Trường học / Đơn vị' : category === 'cleanup_activity' ? 'Quy mô cần (VD: Cần 500 bộ)' : 'Quận / Địa điểm'} *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Quận Bình Thạnh hoặc ĐH Khoa học..."
                value={locationOrOrg}
                onChange={(e) => setLocationOrOrg(e.target.value)}
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
                {category === 'school_community' ? 'Thời gian (VD: 15/10/2026)' : 'Ghi chú phụ (VD: Dự kiến 2 bom)'}
              </label>
              <input
                type="text"
                placeholder="VD: Dự kiến đặt 2 bom nổi"
                value={metaInfo}
                onChange={(e) => setMetaInfo(e.target.value)}
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
          {/* Target Amount / Raised Amount */}
          {category !== 'school_community' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Đã quyên góp (triệu đ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={raisedAmount}
                  onChange={(e) => setRaisedAmount(parseFloat(e.target.value) || 0)}
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
                  Mục tiêu cần (triệu đ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(parseFloat(e.target.value) || 0)}
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
          ) : (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Trạng thái hoạt động
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="ongoing">Đang diễn ra</option>
                <option value="upcoming">Sắp diễn ra</option>
                <option value="completed">Đã kết thúc</option>
              </select>
            </div>
          )}
          {/* Image & Order */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                URL ảnh đại diện
              </label>
              <input
                type="text"
                placeholder="/images/trangChu/1.png"
                value={image}
                onChange={(e) => setImage(e.target.value)}
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
                Thứ tự (#)
              </label>
              <input
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
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
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="initActive"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <label htmlFor="initActive" style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              Hiển thị công khai trên Website
            </label>
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
                background: '#16a34a',
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
              <span>{initiative ? 'Lưu thay đổi' : 'Tạo mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
