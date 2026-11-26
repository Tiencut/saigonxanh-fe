import React,{useEffect,useRef} from 'react';
import { Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import type { CampaignItem } from '../types';

interface UpcomingCampaignsTimelineProps {
  campaigns: CampaignItem[];
  onSelectCampaign: (camp: CampaignItem) => void;
  onViewAll?: () => void;
  onViewResult?: () => void;
}

export const UpcomingCampaignsTimeline: React.FC<UpcomingCampaignsTimelineProps> = ({
  campaigns,
  onSelectCampaign,
  onViewAll,
  onViewResult,
}) => {
  const handled=useRef(false);
  useEffect(()=>{
    const requested=new URLSearchParams(window.location.search).get('campaign');
    if(!requested||handled.current)return;
    const campaign=campaigns.find(item=>item.id===requested&&['UPCOMING','ONGOING'].includes(item.status));
    if(campaign){handled.current=true;onSelectCampaign(campaign);}
  },[campaigns,onSelectCampaign]);
  return (
    <div id="volunteer-campaigns" tabIndex={-1} aria-label="Chiến dịch tình nguyện sắp tới" className="showcase-panel showcase-panel-right">
      <div className="panel-header-row">
        <div className="section-title-wrap">
          <div className="decor-line" />
          <h2>HOẠT ĐỘNG SẮP TỚI</h2>
        </div>
        {onViewAll && (
          <button
            type="button"
            className="btn-link-all-timeline"
            onClick={onViewAll}
            title="Xem toàn bộ lịch trình chiến dịch"
          >
            <span>Xem tất cả</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
      <p className="panel-sub-desc">
        Các chiến dịch ra quân giải cứu kênh rạch gần nhất đang mở cổng đăng ký tình nguyện viên.
      </p>

      {/* Scrollable Timeline Area */}
      <div className="campaign-timeline-scrollbox">
        {campaigns.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b' }}>
            <Calendar size={28} color="#16a34a" style={{ margin: '0 auto 10px', opacity: 0.8 }} />
            <p style={{ fontWeight: 600, color: '#334155', marginBottom: 4 }}>Chưa có chiến dịch mới</p>
            <p style={{ fontSize: '13px' }}>Ban điều phối sẽ thông báo kế hoạch ra quân sớm nhất.</p>
          </div>
        ) : (
          <div className="campaign-timeline-list">
            {campaigns.map((camp, idx) => {
              const isUpcoming = camp.status === 'UPCOMING';
              const isOngoing = camp.status === 'ONGOING';
              const statusClass = isUpcoming ? 'upcoming' : isOngoing ? 'ongoing' : 'completed';
              const isLast = idx === campaigns.length - 1;

              return (
                <div key={camp.id} className="timeline-node-item">
                  <div className="timeline-node-rail">
                    <span className={`timeline-dot ${statusClass}`} />
                    {!isLast && <span className="timeline-vertical-line" />}
                  </div>

                  <div className="timeline-content-card">
                    <div className="timeline-img-box">
                      <img
                        className="timeline-thumb-img"
                        src={camp.bannerImage || `/images/trangChu/${(idx % 4) + 1}.png`}
                        alt={camp.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `/images/trangChu/${(idx % 4) + 1}.png`;
                        }}
                      />
                      <span className={`timeline-status-pill ${statusClass}`}>
                        {isUpcoming ? 'Sắp diễn ra' : isOngoing ? 'Đang triển khai' : 'Hoàn thành'}
                      </span>
                    </div>

                    <div className="timeline-text-body">
                      <div className="timeline-meta-row">
                        <span className="timeline-date-tag">
                          <Calendar size={13} />
                          {new Date(camp.startDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="timeline-vol-tag">
                          <Users size={13} />
                          {camp.currentVolunteers || 0}/{camp.targetVolunteers} TNV
                        </span>
                      </div>

                      <h3 className="timeline-item-title" title={camp.title}>{camp.title}</h3>
                      <p className="timeline-item-desc">{camp.description}</p>

                      <div className="timeline-item-footer">
                        <span className="timeline-location-text" title={camp.location}>
                          <MapPin size={13} />
                          {camp.location}
                        </span>

                        {isUpcoming ? (
                          <button
                            type="button"
                            className="btn-timeline-action btn-register"
                            onClick={() => onSelectCampaign(camp)}
                          >
                            Đăng ký tham gia
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-timeline-action btn-view-result"
                            onClick={onViewResult}
                          >
                            Xem kết quả
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
