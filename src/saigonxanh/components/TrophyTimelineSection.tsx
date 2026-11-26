import React from 'react';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import type { CampaignItem } from '../types';

interface TrophyTimelineSectionProps {
  campaigns: CampaignItem[];
  onSelectCampaign: (camp: CampaignItem) => void;
  onViewMap: () => void;
}

export const TrophyTimelineSection: React.FC<TrophyTimelineSectionProps> = ({
  campaigns,
  onSelectCampaign,
  onViewMap,
}) => {
  return (
    <div className="sgx-page-trophy">
      {/* Banner / Hero chiến tích */}
      <section className="trophy-hero">
        <div className="trophy-hero-content">
          <h1>CHIẾN TÍCH SÀI GÒN XANH</h1>
          <p>
            Hành trình hơn 2 năm bền bỉ giải cứu hàng trăm con kênh đen, hồi sinh dòng nước và lan
            toả ý thức bảo vệ môi trường tới hàng triệu người dân TP.HCM.
          </p>
        </div>
      </section>

      {/* Solutions highlight */}
      <section className="trophy-solutions">
        <div className="section-title-wrap">
          <div className="decor-line" />
          <h2>GIẢI PHÁP TOÀN DIỆN</h2>
        </div>

        <div className="solutions-grid">
          <div className="solution-card">
            <div className="sol-icon">
              <img src="/images/chienTich/clean.svg" alt="Dọn rác" />
            </div>
            <h3>Dọn rác thủ công</h3>
            <p>
              Tình nguyện viên mặc đồ bảo hộ chuyên dụng, lội trực tiếp xuống dòng kênh để vớt
              rác thải sinh hoạt, xà bần và các vật sắc nhọn.
            </p>
          </div>

          <div className="solution-card">
            <div className="sol-icon">
              <img src="/images/chienTich/barrier.svg" alt="Phao chắn rác" />
            </div>
            <h3>Phao chắn rác BOM NỔI</h3>
            <p>
              Hệ thống phao rào cản thông minh giữ rác nổi không trôi ra sông lớn, giúp việc thu
              gom định kỳ trở nên dễ dàng và an toàn hơn.
            </p>
          </div>

          <div className="solution-card">
            <div className="sol-icon">
              <img src="/images/chienTich/propagate.svg" alt="Tuyên truyền" />
            </div>
            <h3>Tuyên truyền</h3>
            <p>
              Tham gia các buổi workshop tại các trường học và cơ quan để chia sẻ kiến thức
              bảo vệ môi trường, giúp mọi người đều có trách nhiệm hơn.
            </p>
          </div>
        </div>
      </section>

      {/* Comprehensive Campaigns Timeline Section on Trophy Page */}
      <section className="trophy-timeline-section" id="campaigns-timeline">
        <div className="section-title-wrap">
          <div className="decor-line" />
          <h2>HÀNH TRÌNH & DÒNG THỜI GIAN CHIẾN DỊCH</h2>
        </div>
        <p className="kols-intro">
          Theo dõi toàn bộ lịch sử các chiến dịch ra quân giải cứu kênh rạch TP.HCM của Sài Gòn Xanh từ những ngày đầu khởi xướng đến các hoạt động sắp diễn ra.
        </p>

        <div className="timeline-cards-flow">
          {campaigns.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <p>Chưa có dữ liệu chiến dịch trong cơ sở dữ liệu.</p>
            </div>
          ) : (
            campaigns.map((camp) => {
              const isUpcoming = camp.status === 'UPCOMING';
              return (
                <div key={camp.id} className="timeline-item-card">
                  <div className={`timeline-marker-dot ${isUpcoming ? 'upcoming' : 'completed'}`}>
                    {isUpcoming ? <Clock size={20} color="#15803d" /> : <CheckCircle size={20} color="#16a34a" />}
                  </div>
                  <div className="timeline-card-content">
                    <div className="timeline-card-media">
                      <img
                        src={camp.bannerImage || camp.afterImage || camp.beforeImage || '/images/chienTich/banner.png'}
                        alt={camp.title}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className={`timeline-badge-float ${isUpcoming ? 'upcoming' : 'completed'}`}>
                        {isUpcoming ? 'Sắp diễn ra' : 'Đã hoàn thành'}
                      </span>
                    </div>
                    <div className="timeline-card-details">
                      <div>
                        <div className="timeline-date-row">
                          <Calendar size={15} />
                          <span>{new Date(camp.startDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <h3 className="timeline-item-title">{camp.title}</h3>
                        <p className="timeline-item-desc">{camp.description}</p>
                        <div className="timeline-metrics-strip">
                          <span>📍 <strong>Địa điểm:</strong> {camp.location}</span>
                          <span>👥 <strong>TNV:</strong> {camp.currentVolunteers}/{camp.targetVolunteers}</span>
                          {camp.wasteCollectedKg && (
                            <span>♻️ <strong>Rác thu gom:</strong> {camp.wasteCollectedKg.toLocaleString()} kg</span>
                          )}
                        </div>
                      </div>
                      <div className="timeline-card-actions">
                        {isUpcoming ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => onSelectCampaign(camp)}
                          >
                            Đăng ký tham gia ngay
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-sm flex items-center gap-1">
                            <CheckCircle size={16} /> Chiến dịch hoàn thành xuất sắc
                          </span>
                        )}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={onViewMap}
                        >
                          Xem vị trí bản đồ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
