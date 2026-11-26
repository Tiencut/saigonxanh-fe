import { OrganizationLogo, OrganizationName } from '../../organizations/OrganizationBrand';
import { useState } from 'react';
import {
  Search,
  ChevronRight,
  ArrowRight,
  Map,
  MapPin,
  CalendarDays,
  Users,
  Sprout,
  UserRound,
  CalendarSearch,
} from 'lucide-react';
import type { CampaignItem, LeaderboardUser, MobileUser } from '../types';
import './mobileHome.css';
import { SgxMoreMenu } from '../components/SgxMoreMenu';

interface MobileHomeTabProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onOpenMap: () => void;
  campaigns: CampaignItem[];
  onRegisterCampaign: (c: CampaignItem) => void;
  onNavigateActivities: () => void;
  leaderboard: LeaderboardUser[];
  onViewAllLeaderboard: () => void;
  user: MobileUser | null;
  loading: boolean;
  onOpenProfile: () => void;
}

export function MobileHomeTab({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenMap,
  campaigns,
  onRegisterCampaign,
  onNavigateActivities,
  leaderboard,
  onViewAllLeaderboard,
  user,
  loading,
  onOpenProfile,
}: MobileHomeTabProps) {
  const upcoming = campaigns
    .filter((c) => c.status === 'UPCOMING')
    .sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))[0];
  const [failedImage, setFailedImage] = useState('');
  return (
    <div className="tab-home mobile-home">
      <header className="mobile-home-header">
        <div className="mobile-home-brand">
          <OrganizationLogo alt="" />
          <div>
            <strong><OrganizationName /></strong>
            <span>Cộng đồng vì môi trường</span>
          </div>
        </div>
        <div className="mobile-home-header-actions">
          <SgxMoreMenu compact />
          <button
            type="button"
            className="mobile-home-account"
            aria-label={user ? 'Mở tài khoản cá nhân' : 'Đăng nhập'}
            onClick={onOpenProfile}
          >
            <UserRound size={21} />
          </button>
        </div>
      </header>
      <div className="mobile-home-welcome">
        <p>{user ? `Chào, ${user.name}` : <>Chào bạn đến với <OrganizationName /></>}</p>
        {user && (
          <button type="button" onClick={onOpenProfile}>
            <Sprout size={15} />
            {loading ? 'Đang cập nhật…' : `${user.points.toLocaleString('vi-VN')} điểm`}
            <ChevronRight size={14} />
          </button>
        )}
      </div>
      <form
        className="mobile-home-search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearchSubmit();
        }}
      >
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          aria-label="Tìm chiến dịch tình nguyện"
          placeholder="Tìm hoạt động, địa điểm…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button type="submit" aria-label="Tìm kiếm hoạt động">
          <ArrowRight size={18} />
        </button>
      </form>
      <button
        type="button"
        className="mobile-map-shortcut-card mobile-home-map"
        onClick={onOpenMap}
      >
        <span className="mobile-home-map-icon">
          <Map size={23} />
        </span>
        <span>
          <strong>Bản đồ môi trường</strong>
          <small>Tìm điểm rác và hoạt động quanh bạn</small>
        </span>
        <ChevronRight size={19} />
      </button>
      <section className="mobile-home-section" aria-labelledby="home-campaigns-title">
        <div className="mobile-home-section-heading">
          <h2 id="home-campaigns-title">Hoạt động sắp tới</h2>
          <button type="button" onClick={onNavigateActivities}>
            Xem tất cả <ChevronRight size={15} />
          </button>
        </div>
        {loading && !upcoming ? (
          <div className="mobile-home-loading" role="status">
            Đang tải hoạt động…
          </div>
        ) : upcoming ? (
          <article className="mobile-home-campaign activity-card-featured">
            {upcoming.bannerImage && failedImage !== upcoming.bannerImage && (
              <img
                className="mobile-home-campaign-image"
                src={upcoming.bannerImage}
                alt=""
                loading="lazy"
                onError={() => setFailedImage(upcoming.bannerImage!)}
              />
            )}
            <div className="mobile-home-campaign-body">
              <div className="mobile-home-campaign-meta">
                <span>Sắp diễn ra</span>
                <time dateTime={upcoming.startDate}>
                  <CalendarDays size={14} />
                  {new Date(upcoming.startDate).toLocaleDateString('vi-VN')}
                </time>
              </div>
              <h3>{upcoming.title}</h3>
              <p className="mobile-home-campaign-location">
                <MapPin size={15} />
                {upcoming.location}
              </p>
              <div className="mobile-home-campaign-bottom">
                <span>
                  <Users size={16} />
                  {upcoming.currentVolunteers}/{upcoming.targetVolunteers} tình nguyện viên
                </span>
                <button
                  type="button"
                  className="btn-register-action"
                  onClick={() => onRegisterCampaign(upcoming)}
                >
                  Tham gia <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </article>
        ) : (
          <div className="mobile-home-empty">
            <CalendarSearch size={26} />
            <h3>Chưa có hoạt động sắp tới</h3>
            <p>Bạn có thể xem các chiến dịch đã và đang diễn ra.</p>
            <button type="button" onClick={onNavigateActivities}>
              Khám phá hoạt động <ArrowRight size={15} />
            </button>
          </div>
        )}
      </section>
      <section className="mobile-home-section" aria-labelledby="home-leaderboard-title">
        <div className="mobile-home-section-heading">
          <div>
            <h2 id="home-leaderboard-title">Bảng xếp hạng</h2>
            <p>Tình nguyện viên đồng hành</p>
          </div>
          <button type="button" onClick={onViewAllLeaderboard}>
            Xem tất cả <ChevronRight size={15} />
          </button>
        </div>
        <div className="mobile-home-leaderboard">
          {loading && !leaderboard.length ? (
            <p className="mobile-home-loading" role="status">
              Đang tải xếp hạng…
            </p>
          ) : !leaderboard.length ? (
            <p className="mobile-home-empty-copy">Chưa có dữ liệu xếp hạng tình nguyện viên.</p>
          ) : (
            leaderboard.slice(0, 3).map((v) => (
              <div className="leaderboard-row mobile-home-rank" key={`${v.rank}-${v.name}`}>
                <span className="mobile-home-rank-number">{v.rank}</span>
                <span className="mobile-home-rank-avatar">
                  {v.avatar ? (
                    <img
                      src={v.avatar}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <UserRound size={20} />
                  )}
                </span>
                <strong>{v.name}</strong>
                <span className="mobile-home-rank-points">
                  <Sprout size={15} />
                  {v.points.toLocaleString('vi-VN')}
                  <small>điểm</small>
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
