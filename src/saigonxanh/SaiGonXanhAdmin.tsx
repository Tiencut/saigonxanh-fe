import { OrganizationBrandingAdmin } from '../organizations/OrganizationBrandingAdmin';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminCrudProvider } from './admin/AdminCrud';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Award,
  Gift,
  DollarSign,
  Handshake,
  Newspaper,
  ExternalLink,
  RefreshCw,
  Lock,
  Mail,
  Key,
  LogOut,
  AlertTriangle,
  Users,
  School,
} from 'lucide-react';
import { useAuth, getAccessToken } from '../api';
import {
  AdminDashboardTab,
  AdminReportsTab,
  AdminCampaignsTab,
  AdminVolunteersTab,
  AdminRewardsTab,
  AdminFinancesTab,
  AdminPartnersTab,
  AdminProgramsTab,
  AddEditProgramModal,
  AddEditInitiativeModal,
  AddEditDonationModal,
  AdminKolsTab,
  AddEditKolModal,
  AdminNewsTab,
  AwardPointsModal,
  AddPartnerModal,
} from './admin';

type AdminTab = 'dashboard' | 'reports' | 'campaigns' | 'volunteers' | 'rewards' | 'finances' | 'bank-accounts' | 'partners' | 'programs' | 'kols' | 'news' | 'privacy' | 'team' | 'branding';

import { useAdminData } from './admin/useAdminData';
import { useAdminOperations } from './admin/useAdminOperations';
import { useAdminPartners } from './admin/useAdminPartners';
import { useAdminPrograms } from './admin/useAdminPrograms';
import { AdminLogin } from './admin/AdminLogin';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminTeamTab } from './admin/AdminTeamTab';
import { AdminPrivacyTab } from './admin/AdminPrivacyTab';
import { BankAccountsTab } from './admin/BankAccountsTab';

export function SaiGonXanhAdmin({ baseRoute = '' }: { baseRoute?: string }) {
  const { user, login, logout, loading: authLoading } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const tabs = ['dashboard', 'reports', 'campaigns', 'volunteers', 'rewards', 'finances', 'bank-accounts', 'partners', 'programs', 'kols', 'news', 'privacy', 'team', 'branding'];
  const searchParams = new URLSearchParams(location.search);
  const legacyTab = searchParams.get('tab');
  const adminBase = baseRoute ? `${baseRoute}/admin` : '/admin';
  const subpath = location.pathname.startsWith(adminBase)
    ? location.pathname.slice(adminBase.length)
    : location.pathname.replace(/^\/admin/, '');
  const pathTab = subpath.replace(/^\/+/, '').split('/')[0] || 'dashboard';
  const tab = pathTab === 'dashboard' && legacyTab && tabs.includes(legacyTab) ? legacyTab : pathTab;
  const activeTab = (tabs.includes(tab) ? tab : 'dashboard') as AdminTab;
  const canonicalPath = activeTab === 'dashboard' ? adminBase : `${adminBase}/${activeTab}`;
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (location.pathname !== canonicalPath || query.has('tab')) {
      query.delete('tab');
      navigate({ pathname: canonicalPath, search: query.toString(), hash: location.hash }, { replace: true });
    }
  }, [canonicalPath, location.pathname, location.search, location.hash, navigate]);
  const setActiveTab = (next: AdminTab) => {
    navigate(next === 'dashboard' ? adminBase : `${adminBase}/${next}`);
  };
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    try {
      await login({ email: loginEmail.trim().toLowerCase(), password: loginPassword });
    } catch (err: any) {
      setLoginError(err.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { refreshResource, loadError, loading, reports, campaigns, volunteers, wasteItems, rewards, redemptions, finances, partners, programs, programSubmissions, initiatives, activityDonations, kols, newsList, actionMsg, fetchData, notify } = useAdminData({ user });
  const { showAwardPoints, setShowAwardPoints, pointsDelta, setPointsDelta, handleUpdateReportStatus, handleDeleteCampaign, handleAwardPoints, handleUpdateRedemption, handleDeleteNews } = useAdminOperations({ fetchData, notify });
  const { showAddPartner, setShowAddPartner, editingPartner, setEditingPartner, showAddKol, setShowAddKol, editingKol, setEditingKol, isSubmittingKol, partnerForm, setPartnerForm, kolForm, setKolForm, handleOpenAddPartner, handleEditPartner, handleSavePartner, handleDeletePartner, handleTogglePartnerStatus, handleOpenAddKol, handleEditKol, handleSaveKol, handleDeleteKol, handleToggleKolStatus } = useAdminPartners({ fetchData, notify, kols });
  const { showAddProgram, setShowAddProgram, editingProgram, setEditingProgram, isSubmittingProgram, showAddInitiative, setShowAddInitiative, editingInitiative, setEditingInitiative, showAddDonation, setShowAddDonation, editingDonation, setEditingDonation, programForm, setProgramForm, handleSaveProgram, handleUpdateSubmissionStatus, handleDeleteSubmission, handleSaveInitiative, handleDeleteInitiative, handleToggleInitiativeStatus, handleSaveDonation, handleDeleteDonation } = useAdminPrograms({ fetchData, notify, programs });
  if (authLoading || !user?.roles?.includes('ADMIN')) return <AdminLogin {...{ authLoading, user, loginError, loginEmail, setLoginEmail, loginPassword, setLoginPassword, isSubmitting, handleAdminLogin }} />;
  return (
    <div className="sgx-admin-container">
      {/* SIDEBAR: NAVY BLUE (#0f172a / #1e293b) */}
      <AdminSidebar {...{ activeTab, setActiveTab, reports, redemptions, partners, programs, kols, newsList, programSubmissions, logout, baseRoute }} />

      {/* MAIN CONTENT AREA */}
      <main className="sgx-admin-main">
        {/* TOPBAR */}
        <header className="sgx-admin-topbar">
          <div className="topbar-left">
            <h1 className="current-tab-heading">
              {activeTab === 'team' && 'Quản lý thành viên các ban'}
              {activeTab === 'branding' && 'Nhận diện tổ chức'}
              {activeTab === 'privacy' && 'Tiếp nhận yêu cầu tài khoản'}
              {activeTab === 'dashboard' && 'Bảng điều khiển Tổng quan & KPI'}
              {activeTab === 'reports' && 'Quản lý Báo cáo Điểm Nóng Ô Nhiễm'}
              {activeTab === 'campaigns' && 'Quản lý Chiến dịch Ra quân Dọn rác'}
              {activeTab === 'volunteers' && 'Quản lý Hồ sơ & Điểm Tình nguyện viên'}
              {activeTab === 'rewards' && 'Quản lý Danh mục Rác, Quà & Đổi điểm'}
              {activeTab === 'finances' && 'Quản lý Quỹ & Thu Chi Minh Bạch'}
              {activeTab === 'bank-accounts' && 'Kết nối tài khoản ngân hàng'}
              {activeTab === 'partners' && 'Quản lý đồng hành và tài trợ'}
              {activeTab === 'programs' && 'Quản lý Gây Quỹ Trường Học, Cộng Đồng & Tài Trợ Dọn Dẹp'}
              {activeTab === 'kols' && 'Quản lý Gương Mặt Thân Quen & Nghệ Sĩ Đồng Hành'}
              {activeTab === 'news' && 'Quản lý Tin Tức & Hoạt Động Truyền Thông'}


            </h1>
          </div>
          <div className="topbar-right">
            {actionMsg && <div className="toast-notify">{actionMsg}</div>}
            <button className="btn-refresh" onClick={fetchData} title="Tải lại dữ liệu">
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              <span>Cập nhật</span>
            </button>
            <div className="admin-user-pill">
              <span className="dot-active"></span>
              <span>{user?.name || 'Administrator'}</span>
            </div>
            <button
              type="button"
              className="btn-logout-topbar"
              onClick={() => logout()}
              title="Đăng xuất khỏi hệ thống quản trị"
            >
              <LogOut size={14} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* CONTENT TABS */}
        <AdminCrudProvider onRefresh={refreshResource}>
        <div className="sgx-admin-body" aria-busy={loading}>
          {loadError && <div role="alert" className="admin-crud-error">{loadError} <button type="button" onClick={fetchData}>Thử lại</button></div>}
          {loading && <p role="status" className="text-muted">Đang tải dữ liệu quản trị...</p>}
          {activeTab === 'privacy' && <AdminPrivacyTab />}
          {activeTab === 'team' && <AdminTeamTab />}
          {activeTab === 'branding' && <OrganizationBrandingAdmin />}
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              reports={reports}
              campaigns={campaigns}
              volunteers={volunteers}
              finances={finances}
              redemptions={redemptions}
              partners={partners}
              newsList={newsList}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'reports' && (
            <AdminReportsTab
              reports={reports}
              onUpdateStatus={handleUpdateReportStatus}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'campaigns' && (
            <AdminCampaignsTab
              campaigns={campaigns}
              onDeleteCampaign={handleDeleteCampaign}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'volunteers' && (
            <AdminVolunteersTab
              volunteers={volunteers}
              onOpenAwardModal={(vol) => setShowAwardPoints(vol)}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'rewards' && (
            <AdminRewardsTab
              rewards={rewards}
              wasteItems={wasteItems}
              redemptions={redemptions}
              onUpdateRedemptionStatus={handleUpdateRedemption}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'finances' && (
            <AdminFinancesTab
              finances={finances}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'bank-accounts' && <BankAccountsTab />}

          {activeTab === 'partners' && (
            <AdminPartnersTab
              partners={partners}
              onOpenAddModal={handleOpenAddPartner}
              onEditPartner={handleEditPartner}
              onDeletePartner={handleDeletePartner}
              onToggleStatus={handleTogglePartnerStatus}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'programs' && (
            <AdminProgramsTab
              programs={programs}
              initiatives={initiatives}
              donations={activityDonations}
              submissions={programSubmissions}
              onOpenAddInitiative={() => {
                setEditingInitiative(null);
                setShowAddInitiative(true);
              }}
              onEditInitiative={(item) => {
                setEditingInitiative(item);
                setShowAddInitiative(true);
              }}
              onDeleteInitiative={handleDeleteInitiative}
              onToggleInitiativeStatus={handleToggleInitiativeStatus}
              onOpenAddDonation={() => {
                setEditingDonation(null);
                setShowAddDonation(true);
              }}
              onEditDonation={(item) => {
                setEditingDonation(item);
                setShowAddDonation(true);
              }}
              onDeleteDonation={handleDeleteDonation}
              onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
              onDeleteSubmission={handleDeleteSubmission}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'kols' && (
            <AdminKolsTab
              kols={kols}
              onOpenAddModal={handleOpenAddKol}
              onEditKol={handleEditKol}
              onDeleteKol={handleDeleteKol}
              onToggleStatus={handleToggleKolStatus}
              onRefresh={fetchData}
            />
          )}


          {activeTab === 'news' && (

            <AdminNewsTab
              newsList={newsList}
              onDeleteNews={handleDeleteNews}
              onRefresh={fetchData}
            />
          )}
        </div>
        </AdminCrudProvider>
      </main>

      {/* REUSABLE MODALS */}


      <AwardPointsModal
        volunteer={showAwardPoints}
        onClose={() => setShowAwardPoints(null)}
        pointsDelta={pointsDelta}
        setPointsDelta={setPointsDelta}
        onSubmit={handleAwardPoints}
      />

      <AddPartnerModal
        isOpen={showAddPartner}
        isEditing={Boolean(editingPartner)}
        onClose={() => {
          setShowAddPartner(false);
          setEditingPartner(null);
        }}
        form={partnerForm}
        setForm={setPartnerForm}
        onSubmit={handleSavePartner}
      />

      <AddEditProgramModal
        isOpen={showAddProgram}
        onClose={() => {
          setShowAddProgram(false);
          setEditingProgram(null);
        }}
        program={editingProgram}
        form={programForm}
        setForm={setProgramForm}
        onSubmit={handleSaveProgram}
        isSubmitting={isSubmittingProgram}
      />

      <AddEditInitiativeModal
        isOpen={showAddInitiative}
        initiative={editingInitiative}
        onClose={() => {
          setShowAddInitiative(false);
          setEditingInitiative(null);
        }}
        onSave={handleSaveInitiative}
      />

      <AddEditDonationModal
        isOpen={showAddDonation}
        donation={editingDonation}
        initiatives={initiatives}
        onClose={() => {
          setShowAddDonation(false);
          setEditingDonation(null);
        }}
        onSave={handleSaveDonation}
      />

      <AddEditKolModal

        isOpen={showAddKol}
        onClose={() => {
          setShowAddKol(false);
          setEditingKol(null);
        }}
        kol={editingKol}
        form={kolForm}
        setForm={setKolForm}
        onSubmit={handleSaveKol}
        isSubmitting={isSubmittingKol}
      />

    </div>
  );
}
