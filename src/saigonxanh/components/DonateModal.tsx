import React from 'react';
import { CheckCircle } from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  donorMsg: string;
  setDonorMsg: (msg: string) => void;
  donorName: string;
  setDonorName: (name: string) => void;
  donateAmount: number;
  setDonateAmount: (amount: number) => void;
  donateSuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  donorMsg,
  setDonorMsg,
  donorName,
  setDonorName,
  donateAmount,
  setDonateAmount,
  donateSuccess,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const isBomNoi = donorMsg.includes('BOM NỔI');
  const isSchool = donorMsg.includes('trường học');

  const title = isBomNoi
    ? 'Tài trợ BOM NỔI – Rào Cản Rác'
    : isSchool
    ? 'Đồng hành gây quỹ cùng Sài Gòn Xanh'
    : 'Quyên góp ủng hộ Sài Gòn Xanh';

  const desc = isBomNoi
    ? 'Đơn giá chuẩn: 500.000 đ / mét phao rào cản rác (bao gồm phao xốp mật độ cao, lưới chắn rác chìm 1.2m và cáp neo chịu tải). Mỗi mét phao giúp giữ sạch dòng kênh liên tục nhiều năm.'
    : isSchool
    ? 'Sài Gòn Xanh đồng hành cùng các trường học, câu lạc bộ sinh viên và doanh nghiệp tổ chức các chiến dịch gây quỹ, workshop môi trường và trải nghiệm thực tế.'
    : 'Mọi sự đóng góp của bạn đều được chuyển thẳng vào quỹ mua sắm găng tay bảo hộ, ủng lội nước, vắc xin uốn ván và sản xuất phao chắn rác.';

  const amounts = isBomNoi
    ? [500000, 1000000, 5000000, 15000000, 30000000]
    : [50000, 100000, 200000, 500000, 1000000];

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <h3>{title}</h3>
        <p className="modal-desc">{desc}</p>

        {donateSuccess ? (
          <div className="modal-success-box">
            <CheckCircle size={40} color="#16a34a" />
            <h4>Cảm ơn bạn đã chung tay vì môi trường!</h4>
            <p>Khoản đóng góp của bạn đã được ghi nhận vào sổ minh bạch tài chính.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="donate-amounts-grid">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`amt-btn ${donateAmount === amt ? 'active' : ''}`}
                  onClick={() => setDonateAmount(amt)}
                >
                  {amt.toLocaleString()} đ
                  {isBomNoi && amt === 500000 && ' (1m phao)'}
                  {isBomNoi && amt === 5000000 && ' (Cụm 10m)'}
                  {isBomNoi && amt === 15000000 && ' (Cụm 30m)'}
                </button>
              ))}
            </div>

            <div className="modal-qr-section">
              <p className="modal-qr-title">Quét mã QR chuyển khoản ủng hộ trực tiếp (MB Bank / VietQR):</p>
              <img
                src="/images/qr-code.png"
                alt="Mã QR quyên góp Sài Gòn Xanh"
                className="modal-qr-img"
                width={180}
                height={260}
              />
            </div>

            <div className="form-group">
              <label>Họ tên người ủng hộ</label>
              <input
                type="text"
                placeholder="Để trống nếu muốn ẩn danh"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Lời nhắn gửi gắm</label>
              <input
                type="text"
                placeholder="Cố lên các chiến binh Sài Gòn Xanh..."
                value={donorMsg}
                onChange={(e) => setDonorMsg(e.target.value)}
              />
            </div>

            <div className="modal-actions-row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Đóng
              </button>
              <button type="submit" className="btn btn-primary">
                Xác nhận ủng hộ {donateAmount.toLocaleString()} đ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
