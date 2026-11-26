import React, { useState, useEffect } from 'react';
import { Home, Sprout, RefreshCw, User as UserIcon } from 'lucide-react';
import { sgxApi } from './api';
import { useAuth } from '../api';
import { useMobileData } from './mobile/useMobileData';
import './mobile/mobileData.css';
import { MobileAccountCenter } from './mobile/account/MobileAccountCenter';
import type { AccountPage } from './mobile/account/accountTypes';
import type {
  CampaignItem,
  RewardItem,
  MobileUser,
} from './types';
import {
  MobileHomeTab,
  MobileActivitiesTab,
  MobileRewardsTab,
  MobileProfileTab,
  MobileLoginScreen,
  MobileInviteScreen,
  MobileLeaderboardScreen,
  MobileMapScreen,
  MobileCampaignRegisterModal,
  MobileRedeemGiftModal,
} from './mobile';

export function SaiGonXanhMobile({
  onSwitchToWeb,
  onSwitchToAdmin,
}: {
  onSwitchToWeb?: () => void;
  onSwitchToAdmin?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'home' | 'activities' | 'rewards' | 'profile'>(() => { const tab = new URLSearchParams(window.location.search).get('tab'); return tab === 'activities' || tab === 'rewards' || tab === 'profile' ? tab : 'home'; });
  const [currentScreen, setCurrentScreen] = useState<'main' | 'invite' | 'login' | 'leaderboard_all' | 'map' | 'account'>('main');
  const [accountPage, setAccountPage] = useState<AccountPage>('edit');

  const authUser = useAuth(s => s.user);
  const { loading, error: dataError, campaigns, leaderboard, wasteItems, rewardItems, profile, refresh } = useMobileData(authUser?.id);
  const user: MobileUser | null = authUser ? profile?.id === authUser.id ? profile : { ...authUser, points: 0, rank: 9999, referralCode: '', volunteerHours: 0, completedCampaigns: 0 } : null;
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Rewards tab sub-state
  const [rewardSubTab, setRewardSubTab] = useState<'waste' | 'gift' | 'history'>('waste');
  const [selectedWasteItems, setSelectedWasteItems] = useState<Record<string, number>>({});
  const [wasteSuccessMsg, setWasteSuccessMsg] = useState('');

  // Selected gift modal
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState('');
  const [redeemErrorMsg, setRedeemErrorMsg] = useState('');

  // Campaign registration modal
  const [regCampaign, setRegCampaign] = useState<CampaignItem | null>(null);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  useEffect(() => { localStorage.removeItem('sgx_mobile_user'); }, []);
  useEffect(() => {
    if (!authUser && currentScreen === 'account' && accountPage !== 'permissions') {
      setCurrentScreen('main');
      setActiveTab('profile');
    }
  }, [authUser, currentScreen, accountPage]);
  useEffect(() => { setVolunteerPhone(profile?.phone || ''); }, [profile]);
  const handleLogout = () => { void useAuth.getState().logout(); };
  const handleWasteSubmit = async (wasteId: string, qty: number) => {
    if (!user) {
      setCurrentScreen('login');
      return;
    }
    try {
      const res = await sgxApi.submitWaste({
        wasteItemId: wasteId,
        quantity: qty,
        volunteerName: user.name,
        volunteerPhone,
      });
      setWasteSuccessMsg(res.message);
      await refresh();
      setTimeout(() => setWasteSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setCurrentScreen('login');
      return;
    }
    if (!selectedReward) return;
    setRedeemErrorMsg('');
    try {
      const res = await sgxApi.redeemReward({
        rewardItemId: selectedReward.id,
        recipientName: recipientName || user.name,
        recipientPhone,
        recipientAddress,
      });
      setRedeemSuccessMsg(res.message);
      await refresh();
      setTimeout(() => {
        setSelectedReward(null);
        setRedeemSuccessMsg('');
      }, 2500);
    } catch (err: any) {
      setRedeemErrorMsg(err.message || 'Không thể đổi quà');
    }
  };

  const handleCampaignRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regCampaign) return;
    try {
      const res = await sgxApi.registerCampaign(regCampaign.id, {
        fullName: regName,
        phone: regPhone,
        email: regEmail,
      });
      setRegSuccess(res.message);
      await refresh();
      setTimeout(() => {
        setRegCampaign(null);
        setRegSuccess('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Lỗi đăng ký');
    }
  };

  return (
    <div className="sgx-mobile-wrapper">
      {/* Screen Router */}
      <div className={`mobile-content-area ${currentScreen === 'map' ? 'is-map-screen' : ''}`}>
        {loading && currentScreen !== 'map' && <p className="mobile-data-status" role="status">Đang cập nhật dữ liệu...</p>}
        {dataError && currentScreen !== 'map' && <div role="alert" className="mobile-data-error">{dataError}<button type="button" onClick={refresh}>Thử lại</button></div>}
        {currentScreen === 'login' && (
          <MobileLoginScreen
            onSuccess={() => { setCurrentScreen('main'); setActiveTab(activeTab === 'rewards' || activeTab === 'activities' ? activeTab : 'home'); }}
            onBack={() => setCurrentScreen('main')}
          />
        )}

        {currentScreen === 'account' && <MobileAccountCenter key={authUser?.id || 'guest'} page={accountPage} onBack={() => { setActiveTab('profile'); setCurrentScreen('main'); }} onSaved={() => { void refresh(); }} />}

        {currentScreen === 'invite' && (
          <MobileInviteScreen
            user={user}
            onBack={() => setCurrentScreen('main')}
          />
        )}

        {currentScreen === 'leaderboard_all' && (
          <MobileLeaderboardScreen
            leaderboard={leaderboard}
            onBack={() => setCurrentScreen('main')}
          />
        )}

        {currentScreen === 'map' && (
          <MobileMapScreen
            onBack={() => setCurrentScreen('main')}
          />
        )}

        {currentScreen === 'main' && (
          <div className="mobile-main-tab-content">
            {activeTab === 'home' && (
              <MobileHomeTab
                user={user}
                loading={loading}
                onOpenProfile={() => { if (user) setActiveTab('profile'); else setCurrentScreen('login'); }}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={() => setActiveTab('activities')}
                onOpenMap={() => setCurrentScreen('map')}
                campaigns={campaigns}
                onRegisterCampaign={(c) => setRegCampaign(c)}
                onNavigateActivities={() => setActiveTab('activities')}
                leaderboard={leaderboard}
                onViewAllLeaderboard={() => setCurrentScreen('leaderboard_all')}
              />
            )}

            {activeTab === 'activities' && (
              <MobileActivitiesTab
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                dateFrom={dateFrom}
                onDateFromChange={setDateFrom}
                dateTo={dateTo}
                onDateToChange={setDateTo}
                campaigns={campaigns}
                onRegisterCampaign={(c) => setRegCampaign(c)}
              />
            )}

            {activeTab === 'rewards' && (
              <MobileRewardsTab
                user={user}
                rewardSubTab={rewardSubTab}
                setRewardSubTab={setRewardSubTab}
                wasteItems={wasteItems}
                rewardItems={rewardItems}
                selectedWasteItems={selectedWasteItems}
                setSelectedWasteItems={setSelectedWasteItems}
                wasteSuccessMsg={wasteSuccessMsg}
                volunteerPhone={volunteerPhone}
                setVolunteerPhone={setVolunteerPhone}
                profile={profile}
                loading={loading}
                onWasteSubmit={handleWasteSubmit}
                onSelectReward={(rew) => {
                  if (!user) {
                    setCurrentScreen('login');
                    return;
                  }
                  setSelectedReward(rew);
                }}
                onOpenLogin={() => setCurrentScreen('login')}
              />
            )}

            {activeTab === 'profile' && (
              <MobileProfileTab
                user={user}
                onLogout={handleLogout}
                onOpenLogin={() => setCurrentScreen('login')}
                onOpenInvite={() => setCurrentScreen('invite')}
                onOpenAccount={(page) => { setAccountPage(page); setCurrentScreen('account'); }}
                canAdmin={authUser?.roles.includes('ADMIN')}
                onSwitchToWeb={onSwitchToWeb}
                onSwitchToAdmin={onSwitchToAdmin}
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      {currentScreen !== 'map' && <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
        <button
          type="button"
          className={`nav-btn ${activeTab === 'home' && currentScreen === 'main' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('home');
            setCurrentScreen('main');
          }}
        >
          <Home size={22} />
          <span>Trang chủ</span>
        </button>

        <button
          type="button"
          className={`nav-btn ${activeTab === 'activities' && currentScreen === 'main' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('activities');
            setCurrentScreen('main');
          }}
        >
          <Sprout size={22} />
          <span>Hoạt động</span>
        </button>

        <button
          type="button"
          className={`nav-btn ${activeTab === 'rewards' && currentScreen === 'main' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('rewards');
            setCurrentScreen('main');
          }}
        >
          <RefreshCw size={22} />
          <span>Đổi điểm</span>
        </button>

        <button
          type="button"
          className={`nav-btn ${(activeTab === 'profile' && currentScreen === 'main') || currentScreen === 'login' || currentScreen === 'account' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('profile');
            setCurrentScreen('main');
          }}
        >
          <UserIcon size={22} />
          <span>Cá nhân</span>
        </button>
      </nav>}

      {/* Modals */}
      <MobileCampaignRegisterModal
        campaign={regCampaign}
        onClose={() => setRegCampaign(null)}
        regName={regName}
        setRegName={setRegName}
        regPhone={regPhone}
        setRegPhone={setRegPhone}
        regEmail={regEmail}
        setRegEmail={setRegEmail}
        regSuccess={regSuccess}
        onSubmit={handleCampaignRegister}
      />

      <MobileRedeemGiftModal
        reward={selectedReward}
        user={user}
        onClose={() => setSelectedReward(null)}
        recipientName={recipientName}
        setRecipientName={setRecipientName}
        recipientPhone={recipientPhone}
        setRecipientPhone={setRecipientPhone}
        recipientAddress={recipientAddress}
        setRecipientAddress={setRecipientAddress}
        redeemSuccessMsg={redeemSuccessMsg}
        redeemErrorMsg={redeemErrorMsg}
        onSubmit={handleRedeem}
      />
    </div>
  );
}
