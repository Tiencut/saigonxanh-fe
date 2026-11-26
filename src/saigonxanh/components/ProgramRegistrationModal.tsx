import React, { useState } from 'react';
import { X, CheckCircle, Loader2, Send, Building, Phone, Mail, User } from 'lucide-react';
import { sgxApi } from '../api';
import type { CommunityProgram } from '../types';

interface ProgramRegistrationModalProps {
  program: CommunityProgram | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProgramRegistrationModal: React.FC<ProgramRegistrationModalProps> = ({
  program,
  onClose,
  onSuccess,
}) => {
  if (!program) return null;

  const [orgName, setOrgName] = useState('');
  const [repName, setRepName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [scale, setScale] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSchool = program.category === 'school_fundraising' || program.title.includes('trường học');
  const isCleanup = program.category === 'cleanup_sponsorship' || program.title.includes('dọn dẹp');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await sgxApi.submitProgramProposal({
        programId: program.id,
        category: program.category,
        programTitle: program.title,
        organizationName: orgName.trim(),
        representativeName: repName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        scaleOrAmount: scale.trim(),
        message: message.trim(),
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể gửi đăng ký, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '580px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#15803d',
                background: '#dcfce7',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              {isSchool ? 'Gây quỹ trường học / Cộng đồng' : isCleanup ? 'Tài trợ chiến dịch dọn dẹp' : 'Đồng hành Sài Gòn Xanh'}
            </span>
            <h3 style={{ margin: '8px 0 4px', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              {program.title}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
              Để lại thông tin để Ban Điều Phối liên hệ trao đổi phương án phối hợp chi tiết.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              Đã gửi thông tin đồng hành thành công!
            </h4>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
              Cảm ơn bạn đã quan tâm. Đại diện Ban Điều Phối Sài Gòn Xanh sẽ liên hệ với bạn qua SĐT/Email trong vòng 24–48 giờ làm việc.
            </p>
            <button
              type="button"
              className="btn-primary-admin"
              onClick={onClose}
              style={{ margin: '0 auto' }}
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '14px',
                }}
              >
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label>
                {isSchool ? 'Tên trường học / Câu lạc bộ / Khu dân cư *' : 'Tên doanh nghiệp / Đơn vị tài trợ *'}
              </label>
              <div style={{ position: 'relative' }}>
                <Building size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder={isSchool ? 'VD: Trường THPT Lê Hồng Phong / CLB Xanh ĐH Bách Khoa...' : 'VD: Công ty TNHH Môi Trường Xanh...'}
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Người đại diện / Liên hệ *</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên..."
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    style={{ paddingLeft: '32px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Số điện thoại Zalo *</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: '32px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Email liên hệ *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '32px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  {isSchool ? 'Quy mô dự kiến' : 'Dự kiến tài trợ'}
                </label>
                <input
                  type="text"
                  placeholder={isSchool ? 'VD: 300 học sinh' : 'VD: 10.000.000 đ / 100 bộ găng tay'}
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Lời nhắn / Đề xuất hình thức triển khai</label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Mong muốn tổ chức workshop vào tuần tới hoặc tài trợ phương tiện thu gom rác..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="modal-actions-row" style={{ marginTop: '20px' }}>
              <button type="button" className="btn-secondary-admin" onClick={onClose} disabled={submitting}>
                Hủy
              </button>
              <button type="submit" className="btn-primary-admin" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="spin" /> Đang gửi...
                  </>
                ) : (
                  <>
                    <Send size={15} /> Gửi Đăng Ký Đồng Hành
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
