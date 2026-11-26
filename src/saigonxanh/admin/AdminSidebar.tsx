import { OrganizationLogo, OrganizationName } from '../../organizations/OrganizationBrand';
import React from 'react';
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
  LogOut, 
  Users, 
  Building2, 
  Landmark, 
  ShieldCheck, 
  Target, 
  Sparkles 
} from 'lucide-react';

export function AdminSidebar({ activeTab, setActiveTab, reports, redemptions, partners, programs, kols, newsList, programSubmissions, logout, baseRoute = '' }: any) {
  return (
    <aside className="sgx-admin-sidebar">
      <div className="sidebar-header">
        <div className="admin-brand-row">
          <OrganizationLogo alt="Logo" className="admin-logo-img" />
          <div>
            <div className="admin-title"><OrganizationName /></div>
            <div className="admin-subtitle">HỆ THỐNG QUẢN TRỊ</div>
          </div>
        </div>
      </div>

      <nav className="admin-nav-menu">
        {/* NHÓM 1: VẬN HÀNH & HOẠT ĐỘNG */}
        <div className="admin-nav-group-title">Vận hành & Điểm nóng</div>
        <button
          className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Tổng quan KPI</span>
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <MapPin size={18} />
          <span>Điểm rác báo cáo</span>
          {reports.filter((r: any) => r.status === 'SUBMITTED').length > 0 && (
            <span className="badge-alert">
              {reports.filter((r: any) => r.status === 'SUBMITTED').length}
            </span>
          )}
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          <Calendar size={18} />
          <span>Chiến dịch dọn rác</span>
        </button>

        {/* NHÓM 2: CỘNG ĐỒNG & TÌNH NGUYỆN */}
        <div className="admin-nav-group-title">Cộng đồng & Tình nguyện</div>
        <button
          className={`admin-nav-item ${activeTab === 'volunteers' ? 'active' : ''}`}
          onClick={() => setActiveTab('volunteers')}
        >
          <Award size={18} />
          <span>Tình nguyện viên</span>
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          <Gift size={18} />
          <span>Đổi rác & Quà tặng</span>
          {redemptions.filter((r: any) => r.status === 'PENDING').length > 0 && (
            <span className="badge-alert">
              {redemptions.filter((r: any) => r.status === 'PENDING').length}
            </span>
          )}
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'privacy' ? 'active' : ''}`} 
          onClick={() => setActiveTab('privacy')}
        >
          <ShieldCheck size={18}/>
          <span>Yêu cầu tài khoản</span>
        </button>

        {/* NHÓM 3: TÀI CHÍNH & TÀI TRỢ */}
        <div className="admin-nav-group-title">Tài chính & Nguồn lực</div>
        <button
          className={`admin-nav-item ${activeTab === 'finances' ? 'active' : ''}`}
          onClick={() => setActiveTab('finances')}
        >
          <DollarSign size={18} />
          <span>Quỹ & Thu chi minh bạch</span>
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'bank-accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('bank-accounts')}
        >
          <Landmark size={18} />
          <span>Tài khoản ngân hàng</span>
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'partners' ? 'active' : ''}`}
          onClick={() => setActiveTab('partners')}
        >
          <Handshake size={18} />
          <span>Đồng hành & Tài trợ ({partners.length})</span>
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'programs' ? 'active' : ''}`}
          onClick={() => setActiveTab('programs')}
        >
          <Target size={18} />
          <span>Gây quỹ & Dự án ({programs.length})</span>
          {programSubmissions.filter((s: any) => s.status === 'PENDING').length > 0 && (
            <span className="badge-alert">
              {programSubmissions.filter((s: any) => s.status === 'PENDING').length}
            </span>
          )}
        </button>

        {/* NHÓM 4: TRUYỀN THÔNG & TỔ CHỨC */}
        <div className="admin-nav-group-title">Truyền thông & Tổ chức</div>
        <button
          className={`admin-nav-item ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          <Newspaper size={18} />
          <span>Tin tức & Hoạt động ({newsList.length})</span>
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'kols' ? 'active' : ''}`}
          onClick={() => setActiveTab('kols')}
        >
          <Sparkles size={18} />
          <span>Gương mặt KOLs ({kols.length})</span>
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'team' ? 'active' : ''}`} 
          onClick={() => setActiveTab('team')}
        >
          <Users size={18} />
          <span>Thành viên các ban</span>
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'branding' ? 'active' : ''}`} 
          onClick={() => setActiveTab('branding')}
        >
          <Building2 size={18} />
          <span>Nhận diện tổ chức</span>
        </button>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="links-title">ĐIỀU HƯỚNG NHANH</div>
        <a href={baseRoute || '/'} className="sidebar-link-btn">
          <ExternalLink size={16} />
          <span>Xem Website Desktop</span>
        </a>
        <a href={baseRoute ? `${baseRoute}/map` : '/map'} className="sidebar-link-btn">
          <MapPin size={16} />
          <span>Xem Bản đồ Môi trường</span>
        </a>
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={() => logout()}
          title="Đăng xuất khỏi hệ thống quản trị"
        >
          <LogOut size={16} />
          <span>Đăng xuất Ban Điều Phối</span>
        </button>
      </div>
    </aside>
  );
}
