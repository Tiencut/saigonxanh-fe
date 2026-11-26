import React from 'react';
import { X, MapPin, Calendar, Building, Package, Heart, CheckCircle2, Waves, ArrowRight } from 'lucide-react';
import type { RiverProtectionInitiative } from '../types';

interface InitiativeDetailModalProps {
  initiative: RiverProtectionInitiative | null;
  onClose: () => void;
  onOpenDonate?: (initiative: RiverProtectionInitiative) => void;
  onOpenRegisterSchool?: (initiative: RiverProtectionInitiative) => void;
}

export const InitiativeDetailModal: React.FC<InitiativeDetailModalProps> = ({
  initiative,
  onClose,
  onOpenDonate,
  onOpenRegisterSchool,
}) => {
  if (!initiative) return null;

  const isBomNoi = initiative.category === 'bom_noi';
  const isSchool = initiative.category === 'school_community';
  const isCleanup = initiative.category === 'cleanup_activity';


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
        role="dialog"
        aria-modal="true"
        aria-label={initiative.title}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
      >
        {/* Cover Photo */}
        <div style={{ position: 'relative', height: '220px', background: '#0f172a' }}>
          <img
            src={initiative.image}
            alt={initiative.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src = '/images/trangChu/logo.png';
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
            }}
          />
          <button
            type="button"
            aria-label="Đóng chi tiết"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>

          {/* Badge & Title */}
          <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '4px 10px',
                borderRadius: '999px',
                background: isBomNoi ? '#16a34a' : isSchool ? '#2563eb' : '#ea580c',
                color: '#fff',
                marginBottom: '8px',
              }}
            >
              {isBomNoi ? 'BOM NỔI - RÀO CẢN RÁC' : isSchool ? 'TRƯỜNG HỌC & CỘNG ĐỒNG' : 'TÀI TRỢ HOẠT ĐỘNG'}
            </span>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: 800 }}>
              {initiative.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Info row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', color: '#475569', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isSchool ? <Building size={16} color="#2563eb" /> : <MapPin size={16} color="#16a34a" />}
              <span style={{ fontWeight: 600 }}>{initiative.locationOrOrg}</span>
            </div>
            {initiative.metaInfo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isSchool ? <Calendar size={16} color="#2563eb" /> : isCleanup ? <Package size={16} color="#ea580c" /> : <Waves size={16} color="#16a34a" />}
                <span>{initiative.metaInfo}</span>
              </div>
            )}
          </div>

          {/* Funding progress is hidden until verified statement data is connected. */}

          {/* Status info */}
          {isSchool && initiative.status && (
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Trạng thái hoạt động:</span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: initiative.status === 'ongoing' ? '#dbeafe' : initiative.status === 'upcoming' ? '#e0f2fe' : '#f1f5f9',
                  color: initiative.status === 'ongoing' ? '#1d4ed8' : initiative.status === 'upcoming' ? '#0369a1' : '#64748b',
                }}
              >
                {initiative.status === 'ongoing' ? 'Đang diễn ra' : initiative.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
              </span>
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              Mục tiêu & Ý nghĩa dự án
            </h4>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {isBomNoi
                ? `Triển khai phao rào chắn rác tại dòng kênh để ngăn chặn hàng tấn rác trôi ra sông Sài Gòn và biển. Mỗi cụm phao giúp giữ sạch mặt nước liên tục 24/7 và hỗ trợ tình nguyện viên gom rác thuận lợi.`
                : isSchool
                ? `Hợp tác cùng nhà trường và cộng đồng tổ chức các buổi hội thảo, ngày hội đổi rác lấy quà và chiến dịch dọn kênh thực tế dành cho học sinh, sinh viên nhằm nâng cao ý thức môi trường.`
                : `Hỗ trợ trang thiết bị, vật tư bảo hộ thiết yếu như găng tay y tế cao su, ủng lội bùn, áo phao, túi rác tự hủy và chi phí hậu cần cho các đợt ra quân dọn rác nguy hiểm.`}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                color: '#475569',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Đóng
            </button>
            {isSchool ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenRegisterSchool) onOpenRegisterSchool(initiative);
                }}
                style={{
                  padding: '10px 22px',
                  background: '#2563eb',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Đăng ký tổ chức với trường học</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenDonate) onOpenDonate(initiative);
                }}
                style={{
                  padding: '10px 22px',
                  background: isCleanup ? '#ea580c' : '#16a34a',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Heart size={16} fill="#fff" />
                <span>Tài trợ cho hoạt động này</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
