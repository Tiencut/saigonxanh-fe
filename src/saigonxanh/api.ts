import { api, post } from '../api';
import type {
  CampaignItem,
  LeaderboardUser,
  RecycleWasteItem,
  RewardItem,
  CleanupReport,
  FinancialTransaction,
  NewsArticle,
  OverviewData,
  MobileUser,
  PartnerSponsor,
  KolItem,
  CommunityProgram,
  ProgramSubmission,
  RiverProtectionInitiative,
  ActivityDonation,
} from './types';

const put = <T = any>(path: string, body: unknown = {}) =>
  api<T>(path, { method: 'PUT', body: JSON.stringify(body) });
const del = <T = any>(path: string) =>
  api<T>(path, { method: 'DELETE' });

const BASE = '/public/saigonxanh';

export const sgxApi = {
  getOverview: () => api<OverviewData>(`${BASE}/overview`),
  getCampaigns: (params?: { status?: string; search?: string; from?: string; to?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    if (params?.from) q.append('from', params.from);
    if (params?.to) q.append('to', params.to);
    const query = q.toString() ? `?${q.toString()}` : '';
    return api<CampaignItem[]>(`${BASE}/campaigns${query}`);
  },
  getCampaign: (id: string) => api<CampaignItem>(`${BASE}/campaigns/${id}`),
  registerCampaign: (id: string, data: { fullName: string; phone: string; email: string }) =>
    post<{ registrationId: string; message: string }>(`${BASE}/campaigns/${id}/register`, data),
  getLeaderboard: (limit = 20) => api<LeaderboardUser[]>(`${BASE}/leaderboard?limit=${limit}`),
  getReports: (search?: string) =>
    api<CleanupReport[]>(`${BASE}/reports${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  submitReport: (data: {
    title: string;
    description: string;
    address: string;
    wasteType: string;
    severity: string;
    latitude?: number;
    longitude?: number;
    reporterName?: string;
    reporterPhone?: string;
    images?: string[];
  }) => post<{ report: CleanupReport; trackingCode: string; message: string }>(`${BASE}/reports`, data),
  trackReport: (code: string) => api<CleanupReport>(`${BASE}/reports/track/${code}`),
  getWasteItems: () => api<RecycleWasteItem[]>(`${BASE}/waste-items`),
  submitWaste: (data: {
    wasteItemId: string;
    quantity: number;
    volunteerName: string;
    volunteerPhone: string;
    notes?: string;
  }) => post<{ record: any; pointsEarned: number; message: string }>(`${BASE}/waste/submit`, data),
  getRewards: () => api<RewardItem[]>(`${BASE}/rewards`),
  redeemReward: (data: {
    rewardItemId: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
  }) => post<{ redemption: any; remainingPoints: number; message: string }>(`${BASE}/rewards/redeem`, data),
  getFinances: () =>
    api<{
      summary: { totalIncome: number; totalExpense: number; balance: number; verifiedPercentage: number };
      transactions: FinancialTransaction[];
    }>(`${BASE}/finances`),
  getNews: () => api<NewsArticle[]>(`${BASE}/news`),
  getPartners: (group?: string) =>
    api<PartnerSponsor[]>(`${BASE}/partners${group ? `?group=${encodeURIComponent(group)}` : ''}`),
  getKols: () => api<KolItem[]>(`${BASE}/kols`),
  getPrograms: () => api<CommunityProgram[]>(`${BASE}/programs`),
  submitProgramProposal: (data: {
    programId?: string;
    category?: string;
    programTitle: string;
    organizationName: string;
    representativeName: string;
    phone: string;
    email: string;
    scaleOrAmount?: string;
    message?: string;
  }) => post<{ submission: ProgramSubmission; message: string }>(`${BASE}/programs/submit`, data),

  // River Protection Initiatives (3 columns from user design) & Activity Donations
  getInitiatives: () =>
    api<{ initiatives: RiverProtectionInitiative[]; donations: ActivityDonation[] }>(`${BASE}/initiatives`),
  getInitiativeDonations: () => api<ActivityDonation[]>(`${BASE}/initiatives/donations`),
  donateInitiative: (data: {
    initiativeId?: string;
    donorName: string;
    amount: number;
    itemSponsored?: string;
    message?: string;
  }) => post<{ donation: ActivityDonation; message: string }>(`${BASE}/initiatives/donate`, data),

  // Admin Initiatives & Donations
  adminGetInitiatives: () => api<RiverProtectionInitiative[]>(`${BASE}/admin/initiatives`),
  adminCreateInitiative: (data: Partial<RiverProtectionInitiative>) =>
    post<{ initiative: RiverProtectionInitiative; message: string }>(`${BASE}/admin/initiatives`, data),
  adminUpdateInitiative: (id: string, data: Partial<RiverProtectionInitiative>) =>
    put<{ initiative: RiverProtectionInitiative; message: string }>(`${BASE}/admin/initiatives/${id}`, data),
  adminDeleteInitiative: (id: string) => del<{ message: string }>(`${BASE}/admin/initiatives/${id}`),

  adminGetDonations: () => api<ActivityDonation[]>(`${BASE}/admin/activity-donations`),
  adminCreateDonation: (data: Partial<ActivityDonation>) =>
    post<{ donation: ActivityDonation; message: string }>(`${BASE}/admin/activity-donations`, data),
  adminUpdateDonation: (id: string, data: Partial<ActivityDonation>) =>
    put<{ donation: ActivityDonation; message: string }>(`${BASE}/admin/activity-donations/${id}`, data),
  adminDeleteDonation: (id: string) => del<{ message: string }>(`${BASE}/admin/activity-donations/${id}`),

  getProfile: () => api<any>(`${BASE}/account/me`),
};
