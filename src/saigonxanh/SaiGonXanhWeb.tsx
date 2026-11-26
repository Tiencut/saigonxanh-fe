import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sgxApi } from './api';
import { SaiGonXanhMap } from './SaiGonXanhMap';
import { FinanceTransparencySection } from './FinanceTransparencySection';
import { KOLCarouselSection } from './components/KOLCarouselSection';
import { UpcomingCampaignsTimeline } from './components/UpcomingCampaignsTimeline';
import { PartnershipSection } from './components/PartnershipSection';
import { LatestNewsSection } from './components/LatestNewsSection';
import { TrophyTimelineSection } from './components/TrophyTimelineSection';
import { AboutTeamSection } from './components/AboutTeamSection';
import { ReportTrackingSection } from './components/ReportTrackingSection';
import { DonateModal } from './components/DonateModal';
import { CampaignRegisterModal } from './components/CampaignRegisterModal';
import { CommunityProgramsSection } from './components/CommunityProgramsSection';
import { ProgramRegistrationModal } from './components/ProgramRegistrationModal';
import { InitiativeDonationModal } from './components/InitiativeDonationModal';
import { InitiativeDetailModal } from './components/InitiativeDetailModal';
import { SgxNavbar, type SgxPageKey } from './components/SgxNavbar';
import { HeroSection } from './components/HeroSection';
import { SgxFooter } from './components/SgxFooter';
import { KolPartnersSection } from './components/KolPartnersSection';
import { AuthMobileNav } from './components/AuthMobileNav';
import type {
  CampaignItem,
  FinancialTransaction,
  NewsArticle,
  OverviewData,
  PartnerSponsor,
  KolItem,
  CommunityProgram,
  RiverProtectionInitiative,
  ActivityDonation,
} from './types';


export function SaiGonXanhWeb({
  baseRoute = '',
  onSwitchToMobile: _onSwitchToMobile,
  onSwitchToAdmin: _onSwitchToAdmin,
}: {
  baseRoute?: string;
  onSwitchToMobile?: () => void;
  onSwitchToAdmin?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromPath = (path: string): SgxPageKey => {
    const subpath = baseRoute && path.startsWith(baseRoute)
      ? path.slice(baseRoute.length) || '/'
      : path;
    if (subpath.startsWith('/trophy')) return 'trophy';
    if (subpath.startsWith('/cooperate')) return 'cooperate';
    if (subpath.startsWith('/about')) return 'about';
    if (subpath.startsWith('/finances')) return 'finances';
    if (subpath.startsWith('/map')) return 'map';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<SgxPageKey>(() =>
    getPageFromPath(location.pathname)
  );

  useEffect(() => {
    setCurrentPage(getPageFromPath(location.pathname));
  }, [location.pathname, baseRoute]);

  const handleNavClick = (page: SgxPageKey) => {
    setCurrentPage(page);
    const sub = page === 'home' ? '' : `/${page}`;
    const target = (baseRoute || '') + (sub || '/');
    navigate(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State data fetched from backend
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [finances, setFinances] = useState<{
    summary: { totalIncome: number; totalExpense: number; balance: number; verifiedPercentage: number };
    transactions: FinancialTransaction[];
  } | null>(null);
  const [partners, setPartners] = useState<PartnerSponsor[]>([]);
  const [kols, setKols] = useState<KolItem[]>([]);
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [programs, setPrograms] = useState<CommunityProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<CommunityProgram | null>(null);
  const [initiatives, setInitiatives] = useState<RiverProtectionInitiative[]>([]);
  const [activityDonations, setActivityDonations] = useState<ActivityDonation[]>([]);
  const [detailInitiative, setDetailInitiative] = useState<RiverProtectionInitiative | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<RiverProtectionInitiative | null>(null);
  const [donateInitiativeOpen, setDonateInitiativeOpen] = useState(false);


  // Modal & form states
  const [donateOpen, setDonateOpen] = useState(false);
  const [donateAmount, setDonateAmount] = useState(100000);
  const [donorName, setDonorName] = useState('');
  const [donorMsg, setDonorMsg] = useState('');
  const [donateSuccess, setDonateSuccess] = useState(false);
  const [sponsorTab, setSponsorTab] = useState<'org' | 'sponsor' | 'individual'>('org');

  const [selectedCamp, setSelectedCamp] = useState<CampaignItem | null>(null);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMessage, setRegMessage] = useState('');

  const [teamTab, setTeamTab] = useState<'dieuhanh' | 'truyenthong' | 'haucan' | 'codong'>('dieuhanh');

  // Initial API fetch
  useEffect(() => {
    sgxApi.getOverview().then((data) => setOverview(data || null)).catch(console.error);
    sgxApi.getCampaigns().then((data) => setCampaigns(data || [])).catch(console.error);
    sgxApi.getFinances().then((data) => setFinances(data || null)).catch(console.error);
    sgxApi.getPartners().then((data) => setPartners(data || [])).catch(console.error);
    sgxApi.getKols().then((data) => setKols(data || [])).catch(console.error);
    sgxApi.getNews().then((data) => setNewsList(data || [])).catch(console.error);
    sgxApi.getPrograms().then((data) => setPrograms(data || [])).catch(console.error);
    sgxApi.getInitiatives().then((res) => {
      setInitiatives(res?.initiatives || []);
      setActivityDonations(res?.donations || []);
    }).catch(console.error);
  }, []);

  const handleRegisterCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCamp) return;
    try {
      const res = await sgxApi.registerCampaign(selectedCamp.id, {
        fullName: regName,
        phone: regPhone,
        email: regEmail,
      });
      setRegMessage(res.message);
      setTimeout(() => {
        setSelectedCamp(null);
        setRegMessage('');
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'Lỗi đăng ký');
    }
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setDonateSuccess(true);
    setTimeout(() => {
      setDonateSuccess(false);
      setDonateOpen(false);
      setDonorName('');
      setDonorMsg('');
    }, 2000);
  };

  return (
    <div className="sgx-web-container">
      {/* Top Banner Navigation (Matching saigonxanh.org) */}
      <SgxNavbar
        baseRoute={baseRoute}
        currentPage={currentPage}
        onNavClick={handleNavClick}
        onOpenDonate={() => {
          setDonorMsg('Quyên góp ủng hộ Sài Gòn Xanh');
          setDonateOpen(true);
        }}
      />

      {/* Main Content Router */}
      <main className="sgx-main-content">
        {/* PAGE: BẢN ĐỒ MÔI TRƯỜNG */}
        {currentPage === 'map' && (
          <>
            <SaiGonXanhMap />
            <ReportTrackingSection />
          </>
        )}

        {/* PAGE 1: TRANG CHỦ */}
        {currentPage === 'home' && (
          <div className="sgx-page-home">
            <HeroSection onNavClick={handleNavClick} stats={overview?.stats} />

            {/* COMMUNITY SHOWCASE SECTION (CHUNG HÀNG): GƯƠNG MẶT THÂN QUEN & HOẠT ĐỘNG SẮP TỚI */}
            <section className="sgx-community-showcase-section">
              <div className="community-showcase-grid">
                <KOLCarouselSection kols={kols} onViewAll={() => handleNavClick('cooperate')} />
                <UpcomingCampaignsTimeline
                  campaigns={campaigns}
                  onSelectCampaign={setSelectedCamp}
                  onViewAll={() => handleNavClick('trophy')}
                  onViewResult={() => handleNavClick('trophy')}
                />
              </div>
            </section>

            {/* BẠN CŨNG CÓ THỂ BẢO VỆ CÁC DÒNG SÔNG (3 CỘT: BOM NỔI, TRƯỜNG HỌC, DỌN VỆ SINH + SIDEBAR ĐÓNG GÓP) */}
            <CommunityProgramsSection
              initiatives={initiatives}
              donations={activityDonations}
              onSelectInitiative={(init) => setDetailInitiative(init)}
              onOpenDonate={(init) => {
                setSelectedInitiative(init || null);
                setDonateInitiativeOpen(true);
              }}
              onOpenSchoolRegister={(init) => {
                setSelectedProgram({
                  id: init?.id || 'school-prog',
                  slug: 'to-chuc-gay-quy-truong-hoc',
                  category: 'school_fundraising',
                  title: init?.title || 'Tổ chức gây quỹ với trường học hoặc cộng đồng',
                  image: init?.image || '/images/trangChu/sponsor-gay-quy.png',
                });
              }}
            />

            {/* PHẦN 1: ĐỒNG HÀNH CÙNG SÀI GÒN XANH */}
            <PartnershipSection
              partners={partners}
              sponsorTab={sponsorTab}
              setSponsorTab={setSponsorTab}
              onOpenDonate={(msg, amt) => {
                setDonorMsg(msg);
                if (amt) setDonateAmount(amt);
                setDonateOpen(true);
              }}
              onNavigate={handleNavClick}
            />

            {/* PHẦN 2: TIN TỨC VỀ SÀI GÒN XANH */}
            <LatestNewsSection
              newsList={newsList}
              onViewAll={() => handleNavClick('trophy')}
            />
          </div>
        )}

        {/* PAGE 2: CHIẾN TÍCH */}
        {currentPage === 'trophy' && (
          <TrophyTimelineSection
            campaigns={campaigns}
            onSelectCampaign={setSelectedCamp}
            onViewMap={() => handleNavClick('map')}
          />
        )}

        {/* PAGE 3: HỢP TÁC VỚI KOL */}
        {currentPage === 'cooperate' && <KolPartnersSection kols={kols} />}

        {/* PAGE 4: GIỚI THIỆU */}
        {currentPage === 'about' && (
          <AboutTeamSection teamTab={teamTab} setTeamTab={setTeamTab} />
        )}

        {/* PAGE 6: MINH BẠCH TÀI CHÍNH */}
        {currentPage === 'finances' && (
          <FinanceTransparencySection
            finances={finances}
            onOpenDonate={() => {
              setDonorMsg('Quyên góp đồng hành cùng Sài Gòn Xanh');
              setDonateOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <SgxFooter onNavClick={handleNavClick} />
      {['trophy', 'cooperate', 'about', 'finances'].includes(currentPage) && <AuthMobileNav active={null} />}

      {/* Modals */}
      <DonateModal
        isOpen={donateOpen}
        onClose={() => setDonateOpen(false)}
        donorMsg={donorMsg}
        setDonorMsg={setDonorMsg}
        donorName={donorName}
        setDonorName={setDonorName}
        donateAmount={donateAmount}
        setDonateAmount={setDonateAmount}
        donateSuccess={donateSuccess}
        onSubmit={handleDonate}
      />

      <CampaignRegisterModal
        campaign={selectedCamp}
        onClose={() => setSelectedCamp(null)}
        regName={regName}
        setRegName={setRegName}
        regPhone={regPhone}
        setRegPhone={setRegPhone}
        regEmail={regEmail}
        setRegEmail={setRegEmail}
        regMessage={regMessage}
        onSubmit={handleRegisterCampaign}
      />

      <ProgramRegistrationModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onSuccess={() => {
          sgxApi.getPrograms().then((data) => {
            if (data && data.length > 0) setPrograms(data);
          });
        }}
      />

      <InitiativeDetailModal
        initiative={detailInitiative}
        onClose={() => setDetailInitiative(null)}
        onOpenDonate={(init) => {
          setSelectedInitiative(init);
          setDonateInitiativeOpen(true);
        }}
        onOpenRegisterSchool={(init) => {
          setSelectedProgram({
            id: init.id,
            slug: 'truong-hoc',
            category: 'school_fundraising',
            title: init.title,
            image: init.image,
          });
        }}
      />

      <InitiativeDonationModal
        isOpen={donateInitiativeOpen}
        initiative={selectedInitiative}
        onClose={() => setDonateInitiativeOpen(false)}
        onSuccess={() => {
          sgxApi.getInitiatives().then((res) => {
            if (res?.initiatives) setInitiatives(res.initiatives);
            if (res?.donations) setActivityDonations(res.donations);
          });
        }}
      />
    </div>
  );
}
