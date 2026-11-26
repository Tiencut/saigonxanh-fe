import React from 'react';
import { Award, X } from 'lucide-react';

export const AwardPointsModal: React.FC<{
  volunteer: any;
  onClose: () => void;
  pointsDelta: number;
  setPointsDelta: (val: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ volunteer, onClose, pointsDelta, setPointsDelta, onSubmit }) => {
  if (!volunteer) return null;

  const presets = [100, 500, 1000, 2000, 5000];

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <Award size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              Cộng Điểm Tình Nguyện Viên
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Volunteer Identity Summary */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px' }}>
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {volunteer.user?.name || 'Chiến binh SGX'}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            {volunteer.user?.email || volunteer.phone || 'Chưa có email'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: '#475569' }}>Điểm hiện có:</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
              {(volunteer.points || 0).toLocaleString()} pts
            </span>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Số điểm cộng thêm (points) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="50"
              value={pointsDelta || ''}
              onChange={(e) => setPointsDelta(Number(e.target.value))}
              style={{
                width: '100%',
                height: '40px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0f172a',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Quick point presets */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
              Chọn nhanh:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {presets.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPointsDelta(amt)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: pointsDelta === amt ? '1px solid #16a34a' : '1px solid #e2e8f0',
                    background: pointsDelta === amt ? '#dcfce7' : '#ffffff',
                    color: pointsDelta === amt ? '#15803d' : '#475569',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  +{amt.toLocaleString()} pts
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <button type="button" className="btn-secondary-admin" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary-admin" style={{ fontWeight: 600 }}>
              Xác Nhận Cộng Điểm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
