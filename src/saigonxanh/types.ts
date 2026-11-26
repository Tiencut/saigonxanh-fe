export type CampaignItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  targetVolunteers: number;
  currentVolunteers: number;
  wasteCollectedKg: number;
  bannerImage?: string | null;
  beforeImage?: string | null;
  afterImage?: string | null;
  organizer?: string;
  isFeatured?: boolean;
  _count?: { registrations: number };
};

export type LeaderboardUser = {
  rank: number;
  id?: string;
  userId?: string;
  name: string;
  email?: string;
  avatar?: string | null;
  points: number;
  completedCampaigns?: number;
  volunteerHours?: number;
  referralCode?: string;
};

export type RecycleWasteItem = {
  id: string;
  name: string;
  category: string;
  pointsPerUnit: number;
  unit: string;
  requirement?: string | null;
  icon?: string | null;
};

export type RewardItem = {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  stockQuantity: number;
  image?: string | null;
  category: string;
};

export type CleanupReport = {
  id: string;
  trackingCode: string;
  title: string;
  description: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  wasteType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'SUBMITTED' | 'VERIFIED' | 'SCHEDULED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  images: string;
  adminNotes?: string | null;
  createdAt: string;
};

export type FinancialTransaction = {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  description: string;
  donorName?: string | null;
  receiptProofUrl?: string | null;
  transactionDate: string;
  isVerified: boolean;
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category?: string;
  source?: string | null;
  url?: string | null;
  publishedAt: string;
};

export type PartnerSponsor = {
  verificationStatus: 'PENDING' | 'VERIFIED' | 'HIDDEN';
  verificationSource?: string;
  id: string;
  name: string;
  type: string;
  group: 'org' | 'sponsor' | 'individual' | string;
  purpose: string;
  date: string;
  amount: string;
  amountNum?: number;
  active?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type KolItem = {
  id: string;
  name: string;
  role?: string | null;
  desc?: string | null;
  image: string;
  badge?: string | null;
  order?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CommunityProgram = {
  id: string;
  slug: string;
  category: 'school_fundraising' | 'cleanup_sponsorship' | 'bom_noi' | string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image: string;
  buttonText?: string | null;
  order?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: { submissions: number };
};

export type ProgramSubmission = {
  id: string;
  programId?: string | null;
  program?: CommunityProgram | null;
  category: 'school_fundraising' | 'cleanup_sponsorship' | 'bom_noi' | string;
  programTitle: string;
  organizationName: string;
  representativeName: string;
  phone: string;
  email: string;
  scaleOrAmount?: string | null;
  message?: string | null;
  status: 'PENDING' | 'CONTACTED' | 'CONFIRMED' | 'REJECTED';
  adminNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type ActivityDonation = {
  id: string;
  initiativeId?: string | null;
  initiative?: { id?: string; title: string; category?: string } | null;
  donorName: string;
  avatar?: string | null;
  amount: number;
  itemSponsored?: string | null;
  message?: string | null;
  timeAgo?: string | null;
  createdAt: string;
};

export type RiverProtectionInitiative = {
  id: string;
  category: 'bom_noi' | 'school_community' | 'cleanup_activity' | string;
  title: string;
  locationOrOrg: string;
  metaInfo?: string | null;
  image: string;
  targetAmount?: number;
  raisedAmount?: number;
  targetQuantity?: string | null;
  status?: 'ongoing' | 'upcoming' | 'completed' | string;
  order?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  donations?: ActivityDonation[];
};
export type OverviewData = {
  stats: {
    wasteTons: number;
    volunteersCount: number;
    cleanupsCount: number;
    reportsSubmitted: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
  upcomingCampaigns: CampaignItem[];
  recentNews: NewsArticle[];
  topVolunteers: LeaderboardUser[];
};

export type MobileUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  points: number;
  rank: number;
  referralCode: string;
  volunteerHours: number;
  completedCampaigns: number;
};
