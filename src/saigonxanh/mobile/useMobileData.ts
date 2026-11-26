import { useCallback, useEffect, useRef, useState } from 'react';
import { sgxApi } from '../api';
import type { CampaignItem, LeaderboardUser, RecycleWasteItem, RewardItem } from '../types';

export function useMobileData(email?: string) {
  const requestId = useRef(0);
  const owner = useRef(email);
  owner.current = email;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [wasteItems, setWasteItems] = useState<RecycleWasteItem[]>([]);
  const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const refresh = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError('');
    if (!email) setProfile(null);
    try {
      const [c, l, w, r, p] = await Promise.all([
        sgxApi.getCampaigns(),
        sgxApi.getLeaderboard(20),
        sgxApi.getWasteItems(),
        sgxApi.getRewards(),
        email ? sgxApi.getProfile() : Promise.resolve(null),
      ]);
      if (id !== requestId.current || owner.current !== email) return;
      setCampaigns(c);
      setLeaderboard(l);
      setWasteItems(w);
      setRewardItems(r);
      setProfile(p);
    } catch (err: any) {
      if (id === requestId.current && owner.current === email)
        setError(err.message || 'Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      if (id === requestId.current && owner.current === email) setLoading(false);
    }
  }, [email]);
  useEffect(() => {
    setProfile(null);
    void refresh();
    const visible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', visible);
    return () => {
      requestId.current++;
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [refresh]);
  return { loading, error, campaigns, leaderboard, wasteItems, rewardItems, profile, refresh };
}
