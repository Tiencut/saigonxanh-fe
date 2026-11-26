import React from 'react';
import { Search, Calendar } from 'lucide-react';
import type { CampaignItem } from '../types';

interface MobileActivitiesTabProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dateFrom: string;
  onDateFromChange: (d: string) => void;
  dateTo: string;
  onDateToChange: (d: string) => void;
  campaigns: CampaignItem[];
  onRegisterCampaign: (c: CampaignItem) => void;
}

export const MobileActivitiesTab: React.FC<MobileActivitiesTabProps> = ({
  searchQuery,
  onSearchChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  campaigns,
  onRegisterCampaign,
}) => {
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFrom = !dateFrom || new Date(c.startDate) >= new Date(dateFrom);
    const matchesTo = !dateTo || new Date(c.startDate) <= new Date(dateTo);
    return matchesSearch && matchesFrom && matchesTo;
  });

  return (
    <div className="tab-activities">
      <div className="mobile-search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="date-filter-row">
        <div className="date-input-wrap">
          <label>Từ ngày:</label>
          <div className="date-box">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
            <Calendar size={18} color="#16a34a" />
          </div>
        </div>
        <div className="date-input-wrap">
          <label>Đến ngày:</label>
          <div className="date-box">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
            <Calendar size={18} color="#16a34a" />
          </div>
        </div>
      </div>

      <div className="activities-list">
        {filteredCampaigns.length === 0 ? (
          <div className="activity-empty-full">
            <div className="empty-illustration">📁</div>
            <p>Không có dữ liệu chiến dịch phù hợp</p>
          </div>
        ) : (
          filteredCampaigns.map((c) => (
            <div key={c.id} className="campaign-card-item">
              {c.bannerImage && (
                <img src={c.bannerImage} alt={c.title} className="card-thumb" />
              )}
              <div className="card-body">
                <div className="card-status-row">
                  <span
                    className={`badge ${c.status === 'UPCOMING' ? 'badge-success' : 'badge-neutral'}`}
                  >
                    {c.status === 'UPCOMING'
                      ? 'Sắp diễn ra'
                      : c.status === 'COMPLETED'
                        ? 'Đã hoàn thành'
                        : 'Đang diễn ra'}
                  </span>
                  <span className="card-time">
                    {new Date(c.startDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h4 className="card-title">{c.title}</h4>
                <p className="card-desc">{c.description}</p>
                <p className="card-address">📍 {c.location}</p>

                <div className="card-stats">
                  <span>
                    👥 TNV: {c.currentVolunteers}/{c.targetVolunteers}
                  </span>
                  {c.wasteCollectedKg > 0 && (
                    <span>♻️ Rác thu gom: {c.wasteCollectedKg} kg</span>
                  )}
                </div>

                {c.status === 'UPCOMING' && (
                  <button
                    type="button"
                    className="btn-register-card"
                    onClick={() => onRegisterCampaign(c)}
                  >
                    Đăng ký tham gia
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
