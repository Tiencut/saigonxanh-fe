import React, { useState, useEffect } from 'react';
import { authFetch, getErrMsg } from './adminRequest';
async function readResponse(response: Response) {
  const result = await response.json();
  if (!response.ok) throw new Error(getErrMsg(result, 'Không thể tải dữ liệu'));
  return result;
}
export function useAdminData({ user }: { user: any }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Data states
  const [data, setData] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [wasteItems, setWasteItems] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [finances, setFinances] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [programSubmissions, setProgramSubmissions] = useState<any[]>([]);
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [activityDonations, setActivityDonations] = useState<any[]>([]);
  const [kols, setKols] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Modal states
  const fetchData = async () => {
    if (!user || !user.roles?.includes('ADMIN')) return;
    try {
      setLoading(true);
      setLoadError(null);
      const [adminOverview, repList, campList, leadList, wasteList, rewList, redempList, finList, partList, progList, subList, initList, donList, kolList, nList] =
        await Promise.all([
          authFetch('/api/public/saigonxanh/admin/overview').then(readResponse),
          authFetch('/api/public/saigonxanh/reports').then(readResponse),
          authFetch('/api/public/saigonxanh/campaigns').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/manage/volunteers').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/manage/waste-items').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/manage/rewards').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/redemptions').then(readResponse),
          authFetch('/api/public/saigonxanh/finances').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/partners').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/programs').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/program-submissions').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/initiatives').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/activity-donations').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/kols').then(readResponse),
          authFetch('/api/public/saigonxanh/admin/news').then(readResponse),
        ]);

      setData(adminOverview.data || adminOverview);
      setReports(Array.isArray(repList.data) ? repList.data : Array.isArray(repList) ? repList : []);
      setCampaigns(Array.isArray(campList.data) ? campList.data : Array.isArray(campList) ? campList : []);
      setVolunteers(Array.isArray(leadList.data) ? leadList.data : Array.isArray(leadList) ? leadList : []);
      setWasteItems(Array.isArray(wasteList.data) ? wasteList.data : Array.isArray(wasteList) ? wasteList : []);
      setRewards(Array.isArray(rewList.data) ? rewList.data : Array.isArray(rewList) ? rewList : []);
      setRedemptions(Array.isArray(redempList.data) ? redempList.data : Array.isArray(redempList) ? redempList : []);
      setFinances(finList.data || finList || null);
      setPartners(Array.isArray(partList.data) ? partList.data : Array.isArray(partList) ? partList : []);
      setPrograms(Array.isArray(progList.data) ? progList.data : Array.isArray(progList) ? progList : []);
      setProgramSubmissions(Array.isArray(subList.data) ? subList.data : Array.isArray(subList) ? subList : []);
      setInitiatives(Array.isArray(initList.data) ? initList.data : Array.isArray(initList) ? initList : []);
      setActivityDonations(Array.isArray(donList.data) ? donList.data : Array.isArray(donList) ? donList : []);
      setKols(Array.isArray(kolList.data) ? kolList.data : Array.isArray(kolList) ? kolList : []);
      setNewsList(Array.isArray(nList.data) ? nList.data : Array.isArray(nList) ? nList : []);


    } catch (err: any) {
      setLoadError(err.message || 'Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.roles?.includes('ADMIN')) {
      fetchData();
    }
  }, [user]);

  const refreshResource = async (resource?: string) => {
    if (!resource) return fetchData();
    const setters: Record<string, (value: any) => void> = {
      reports: setReports, campaigns: setCampaigns, volunteers: setVolunteers,
      rewards: setRewards, 'waste-items': setWasteItems, finances: setFinances,
      news: setNewsList, programs: setPrograms, 'program-submissions': setProgramSubmissions,
    };
    const setter = setters[resource];
    if (!setter) return fetchData();
    try {
      const path = resource === 'finances' ? '/api/public/saigonxanh/finances' : `/api/public/saigonxanh/admin/manage/${resource}`;
      const result = await authFetch(path).then(readResponse);
      setter(result.data);
      setLoadError(null);
    } catch (error: any) {
      setLoadError(error.message || 'Không thể tải lại dữ liệu. Vui lòng thử lại.');
    }
  };

  const notify = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 4000);
  };


  return { refreshResource, loadError, loading, setLoading, data, setData, reports, setReports, campaigns, setCampaigns, volunteers, setVolunteers, wasteItems, setWasteItems, rewards, setRewards, redemptions, setRedemptions, finances, setFinances, partners, setPartners, programs, setPrograms, programSubmissions, setProgramSubmissions, initiatives, setInitiatives, activityDonations, setActivityDonations, kols, setKols, newsList, setNewsList, actionMsg, setActionMsg, fetchData, notify };
}
