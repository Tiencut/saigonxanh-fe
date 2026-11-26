import React, { useState } from 'react';
import { ArrowLeft, Sprout, Copy, Check, Mail } from 'lucide-react';
import type { MobileUser, LeaderboardUser } from '../types';

export { MobileLoginScreen } from './MobileLoginScreen';

// 2. INVITE SCREEN
export const MobileInviteScreen: React.FC<{
  user: MobileUser | null;
  onBack: () => void;
}> = ({ user, onBack }) => {
  const [copied, setCopied] = useState(false);

  const copyReferralLink = () => {
    const link = window.location.origin;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mobile-invite-screen">
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={onBack}
        >
          <ArrowLeft size={22} />
        </button>
        <h2>Mời bạn bè tham gia</h2>
        <div style={{ width: 22 }} />
      </div>

      <div className="invite-body">
        <div className="invite-logo-circle">
          <Sprout size={40} color="#16a34a" />
          <span>Sài Gòn Xanh</span>
        </div>

        <h3 className="invite-heading">Cùng nhau chung tay dựng trái đất xanh hơn!</h3>
        <p className="invite-desc">
          Chia sẻ Sài Gòn Xanh để mời bạn bè cùng tham gia các hoạt động bảo vệ môi trường.
        </p>

        <div className="invite-link-box">
          <span className="invite-url">
            {window.location.origin}
          </span>
          <button
            type="button"
            className="copy-btn"
            onClick={copyReferralLink}
            title="Sao chép"
          >
            {copied ? <Check size={18} color="#16a34a" /> : <Copy size={18} />}
          </button>
        </div>

        <a
          href={`mailto:?subject=${encodeURIComponent('Tham gia Sài Gòn Xanh')}&body=${encodeURIComponent('Cùng tham gia hoạt động bảo vệ môi trường: ' + window.location.origin)}`}
          className="invite-email-btn"
        >
          <span>Gửi email</span>
          <Mail size={18} />
        </a>

        {!user && (
          <p className="invite-note">
            Bạn có thể chia sẻ trang web ngay cả khi chưa đăng nhập.
          </p>
        )}
      </div>
    </div>
  );
};

// 3. LEADERBOARD SCREEN
export const MobileLeaderboardScreen: React.FC<{
  leaderboard: LeaderboardUser[];
  onBack: () => void;
}> = ({ leaderboard, onBack }) => {
  return (
    <div className="mobile-leaderboard-screen">
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={onBack}
        >
          <ArrowLeft size={22} />
        </button>
        <h2>Bảng xếp hạng đầy đủ</h2>
        <div style={{ width: 22 }} />
      </div>
      <div className="leaderboard-full-list">
        {!leaderboard.length && <p className="mobile-data-empty">Chưa có dữ liệu xếp hạng tình nguyện viên.</p>}
        {leaderboard.map((v) => (
          <div key={v.rank} className="leaderboard-row">
            <div className={`rank-badge rank-${v.rank <= 3 ? v.rank : 'other'}`}>
              {v.rank}
            </div>
            <div className="rank-avatar">
              {v.avatar ? (
                <img src={v.avatar} alt={v.name} />
              ) : (
                <div className="avatar-initials">{v.name.slice(0, 2).toUpperCase()}</div>
              )}
            </div>
            <div className="rank-info">
              <span className="rank-name">{v.name}</span>
              <small className="rank-sub">
                {v.completedCampaigns || 0} chiến dịch • {v.volunteerHours || 0}h
              </small>
            </div>
            <div className="rank-points">
              <Sprout size={15} color="#16a34a" />
              <span>{v.points.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { MobileMapScreen } from './MobileMapScreen';
