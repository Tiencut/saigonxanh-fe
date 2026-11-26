import React from 'react';
import {
  Users,
  MapPinPlus,
  ArrowRight,
  Trash2,
  Waves,
  Leaf,
  Map,
} from 'lucide-react';
import type { SgxPageKey } from './SgxNavbar';
import './hero.css';

interface HeroSectionProps {
  onNavClick: (page: SgxPageKey) => void;
  stats?: {
    wasteTons?: number;
    volunteersCount?: number;
    cleanupsCount?: number;
    reportsSubmitted?: number;
  } | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavClick, stats }) => {
  return (
    <section className="sgx-hero-banner hero-refresh">
      <div className="hero-content">
        <div className="hero-badge-pill">
          <Leaf className="hero-badge-icon" size={15} />
          <span>SÀI GÒN XANH</span>
        </div>
        <h1 className="hero-title">
          <span>Chung tay hành động,</span>
          <span className="text-highlight">Vì một Việt Nam xanh.</span>
        </h1>
        <p className="hero-desc">
          Cùng cộng đồng dọn rác, hồi sinh kênh rạch và xây dựng môi trường sống xanh, sạch, đẹp.
        </p>
      </div>
      <div className="hero-btn-row">
          <button
            type="button"
            className="hero-btn-primary"
            onClick={() => onNavClick('map')}
          >
            <Map size={20} aria-hidden="true" />
            <span>Bản đồ môi trường</span>
            <ArrowRight size={17} className="btn-arrow" />
          </button>
          <button
            type="button"
            className="hero-btn-secondary"
            onClick={() => onNavClick('map')}
          >
            <MapPinPlus size={20} aria-hidden="true" />
            <span>Báo điểm rác</span>
            <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
          </button>
          <a href="#volunteer-campaigns" className="hero-btn-secondary hero-btn-volunteer">
            <Users size={18} aria-hidden="true" />
            <span>Tham gia tình nguyện</span>
            <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
          </a>
      </div>

      <div className="hero-image-wrap">
        <img
          src="/images/hero/saigon-canal.webp"
          alt="Dòng kênh xanh sạch giữa hàng cây và thành phố Hồ Chí Minh"
          className="hero-img"
          width={1536}
          height={1024}
          fetchPriority="high"
        />
      </div>

      {/* Existing statistics retain their data and formatting. */}
      <div className="hero-stats-grid">
        <div className="hero-stat-item">
          <div className="stat-icon-circle">
            <Trash2 size={21} aria-hidden="true" />
          </div>
          <Trash2 className="hero-stat-watermark" aria-hidden="true" />
          <div className="stat-info">
            <span className="stat-number">
              {stats?.wasteTons ? `${stats.wasteTons.toLocaleString('vi-VN')}+` : '2000+'}
            </span>
            <span className="stat-label">Tấn rác thải thu gom</span>
          </div>
        </div>
        <div className="hero-stat-item">
          <div className="stat-icon-circle">
            <Users size={21} aria-hidden="true" />
          </div>
          <Users className="hero-stat-watermark" aria-hidden="true" />
          <div className="stat-info">
            <span className="stat-number">
              {stats?.volunteersCount ? `${stats.volunteersCount.toLocaleString('vi-VN')}+` : '1000+'}
            </span>
            <span className="stat-label">Tình nguyện viên đồng hành</span>
          </div>
        </div>
        <div className="hero-stat-item">
          <div className="stat-icon-circle">
            <Waves size={21} aria-hidden="true" />
          </div>
          <Waves className="hero-stat-watermark" aria-hidden="true" />
          <div className="stat-info">
            <span className="stat-number">
              {stats?.cleanupsCount ? `${stats.cleanupsCount.toLocaleString('vi-VN')}+` : '250+'}
            </span>
            <span className="stat-label">Con kênh rạch được giải cứu</span>
          </div>
        </div>
        <div className="hero-stat-item">
          <div className="stat-icon-circle">
            <Leaf size={21} aria-hidden="true" />
          </div>
          <Leaf className="hero-stat-watermark" aria-hidden="true" />
          <div className="stat-info">
            <span className="stat-number">
              {stats?.reportsSubmitted ? `${stats.reportsSubmitted.toLocaleString('vi-VN')}+` : '100+'}
            </span>
            <span className="stat-label">Phao chắn rác thông minh</span>
          </div>
        </div>
      </div>
    </section>
  );
};
