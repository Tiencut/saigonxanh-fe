import { MobileRewardHistory } from './MobileRewardHistory';
import React from 'react';
import { Sprout, Gift, Recycle } from 'lucide-react';
import type { RecycleWasteItem, RewardItem, MobileUser } from '../types';

interface MobileRewardsTabProps {
  volunteerPhone: string;
  setVolunteerPhone: (value: string) => void;
  profile: any;
  loading: boolean;
  user: MobileUser | null;
  rewardSubTab: 'waste' | 'gift' | 'history';
  setRewardSubTab: (tab: 'waste' | 'gift' | 'history') => void;
  wasteItems: RecycleWasteItem[];
  rewardItems: RewardItem[];
  selectedWasteItems: Record<string, number>;
  setSelectedWasteItems: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  wasteSuccessMsg: string;
  onWasteSubmit: (wasteId: string, qty: number) => void;
  onSelectReward: (rew: RewardItem) => void;
  onOpenLogin: () => void;
}

export const MobileRewardsTab: React.FC<MobileRewardsTabProps> = ({
  volunteerPhone, setVolunteerPhone, profile, loading,
  user,
  rewardSubTab,
  setRewardSubTab,
  wasteItems,
  rewardItems,
  selectedWasteItems,
  setSelectedWasteItems,
  wasteSuccessMsg,
  onWasteSubmit,
  onSelectReward,
  onOpenLogin,
}) => {
  return (
    <div className="tab-rewards">
      {/* Header Banner */}
      <div className="rewards-header-banner">
        <p className="rewards-callout">
          Cùng chung tay bảo vệ trái đất xanh bằng cách đăng ký tham gia các hoạt động!
        </p>
        {user ? (
          <div className="user-points-badge">
            <span>Điểm của bạn: </span>
            <strong>{user.points.toLocaleString()} điểm</strong>
          </div>
        ) : (
          <button
            type="button"
            className="header-login-btn"
            onClick={onOpenLogin}
          >
            Đăng nhập
          </button>
        )}
      </div>

      {/* Sub-tabs [Đổi rác] [Đổi quà] [Lịch sử] */}
      <div className="rewards-subtab-row">
        <button
          type="button"
          className={`subtab-btn ${rewardSubTab === 'waste' ? 'active' : ''}`}
          onClick={() => setRewardSubTab('waste')}
        >
          Đổi rác
        </button>
        <button
          type="button"
          className={`subtab-btn ${rewardSubTab === 'gift' ? 'active' : ''}`}
          onClick={() => setRewardSubTab('gift')}
        >
          Đổi quà
        </button>
        <button
          type="button"
          className={`subtab-btn ${rewardSubTab === 'history' ? 'active' : ''}`}
          onClick={() => setRewardSubTab('history')}
        >
          Lịch sử
        </button>
      </div>

      {/* SUBTAB 1: ĐỔI RÁC */}
      {rewardSubTab === 'waste' && (
        <div className="subtab-content waste-subtab">
          {wasteSuccessMsg && (
            <div className="alert-success-banner">{wasteSuccessMsg}</div>
          )}
          <label className="mobile-phone-field">Số điện thoại nhận điểm
            <input type="tel" autoComplete="tel" value={volunteerPhone} onChange={e=>setVolunteerPhone(e.target.value)} placeholder="Nhập số điện thoại của bạn" />
          </label>
          {!loading && wasteItems.length === 0 && <p className="mobile-data-empty">Chưa có danh mục rác quy đổi. Ban điều phối sẽ cập nhật sau.</p>}
          <div className="waste-items-list">
            {wasteItems.map((item) => {
              const isSelected = !!selectedWasteItems[item.id];
              return (
                <div key={item.id} className="waste-item-card">
                  <div className="waste-item-img-wrap">
                    <Recycle size={28} aria-hidden="true" />
                  </div>
                  <div className="waste-item-info">
                    <h4 className="waste-item-title">{item.name}</h4>
                    <p className="waste-item-req">Yêu cầu: {item.requirement}</p>
                    <div className="waste-item-rate">
                      <Sprout size={14} color="#16a34a" />
                      <span>
                        {item.pointsPerUnit.toLocaleString()} / {item.unit}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="qty-input-row">
                        <label>Số lượng:</label>
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          aria-label={`Số lượng ${item.name}`}
                          defaultValue="1"
                          id={`qty-${item.id}`}
                          className="qty-field"
                        />
                        <button
                          type="button"
                          className="btn-submit-waste-qty"
                          disabled={!!user && volunteerPhone.replace(/\D/g, '').length < 9}
                          onClick={() => {
                            const input = document.getElementById(
                              `qty-${item.id}`,
                            ) as HTMLInputElement;
                            if (!input.reportValidity()) return;
                            const val = Number(input.value);
                            onWasteSubmit(item.id, val);
                          }}
                        >
                          Thu gom
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="waste-item-check">
                    <input
                      type="checkbox"
                      aria-label={`Chọn ${item.name}`}
                      checked={isSelected}
                      onChange={(e) => {
                        setSelectedWasteItems((prev) => ({
                          ...prev,
                          [item.id]: e.target.checked ? 1 : 0,
                        }));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ĐỔI QUÀ */}
      {rewardSubTab === 'gift' && (
        <div className="subtab-content gift-subtab">
          <p className="gift-notice">
            * Lưu ý: Sau khi đổi quà thành công, điểm của bạn sẽ bị trừ và vị trí xếp
            hạng của bạn sẽ bị giảm xuống!
          </p>

          {!loading && rewardItems.length === 0 && <p className="mobile-data-empty">Chưa có quà tặng để đổi. Ban điều phối sẽ cập nhật sau.</p>}
          <div className="rewards-grid">
            {rewardItems.map((rew) => (
              <div key={rew.id} className="reward-card">
                <div className="reward-image-box">
                  {rew.image ? (
                    <img src={rew.image} alt={rew.name} />
                  ) : (
                    <div className="reward-img-fallback">
                      <Gift size={36} color="#16a34a" />
                    </div>
                  )}
                </div>
                <div className="reward-info">
                  <div className="reward-pts">
                    <Sprout size={14} color="#16a34a" />
                    <span>{rew.pointsRequired.toLocaleString()}</span>
                  </div>
                  <span className="reward-stock">Số lượng: {rew.stockQuantity}</span>
                  <h4 className="reward-title">{rew.name}</h4>
                  <button
                    type="button"
                    className="btn-redeem-action"
                    disabled={rew.stockQuantity <= 0}
                    onClick={() => onSelectReward(rew)}
                  >
                    {rew.stockQuantity > 0 ? 'Đổi quà' : 'Tạm hết'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: LỊCH SỬ */}
      {rewardSubTab === 'history' && (
        <div className="subtab-content history-subtab">
          <MobileRewardHistory user={user} profile={profile} loading={loading} />
        </div>
      )}
    </div>
  );
};
