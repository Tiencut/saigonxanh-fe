import { AdminInitiativesTable, AdminDonationsTable, AdminSubmissionsTable } from './AdminProgramTables';
import { AdminCommunityPrograms } from './AdminCommunityPrograms';
import { AdminCrudButton, AdminCrudRow } from './AdminCrud';
import React, { useState } from 'react';
import {
  Plus,
  Download,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Leaf,
  Users,
  HeartHandshake,
  Heart,
  Clock,
  Sparkles,
  PhoneCall,
  CheckCircle,
  School,
} from 'lucide-react';
import { exportToCsv } from './adminExportUtils';
import type { RiverProtectionInitiative, ActivityDonation, ProgramSubmission } from '../types';

interface AdminProgramsTabProps {
  programs: any[];
  initiatives: RiverProtectionInitiative[];
  donations: ActivityDonation[];
  submissions: ProgramSubmission[];
  onOpenAddInitiative: () => void;
  onEditInitiative: (init: RiverProtectionInitiative) => void;
  onDeleteInitiative: (id: string, title: string) => void;
  onToggleInitiativeStatus: (init: RiverProtectionInitiative) => void;
  onOpenAddDonation: () => void;
  onEditDonation: (donation: ActivityDonation) => void;
  onDeleteDonation: (id: string, name: string) => void;
  onUpdateSubmissionStatus: (id: string, status: string, notes?: string) => void;
  onDeleteSubmission: (id: string, name: string) => void;
  onRefresh: () => void;
}

export const AdminProgramsTab: React.FC<AdminProgramsTabProps> = ({
  programs,
  initiatives,
  donations,
  submissions,
  onOpenAddInitiative,
  onEditInitiative,
  onDeleteInitiative,
  onToggleInitiativeStatus,
  onOpenAddDonation,
  onEditDonation,
  onDeleteDonation,
  onUpdateSubmissionStatus,
  onDeleteSubmission,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'initiatives' | 'donors' | 'submissions' | 'programs'>('initiatives');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'bom_noi' | 'school_community' | 'cleanup_activity'>('ALL');
  const [search, setSearch] = useState('');

  const filteredInitiatives = initiatives.filter((item) => {
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.locationOrOrg.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredDonations = donations.filter((d) => {
    return (
      d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      (d.itemSponsored && d.itemSponsored.toLowerCase().includes(search.toLowerCase())) ||
      (d.message && d.message.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const filteredSubmissions = submissions.filter((s) => {
    return (
      s.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      s.representativeName.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="admin-programs-tab">
      {/* Sub-tab navigation bar */}
      <div className="admin-actions-bar" style={{ marginBottom: '16px' }}>
        <div className="actions-left">
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${activeSubTab === 'initiatives' ? 'active' : ''}`}
              onClick={() => {
                setActiveSubTab('initiatives');
                setSearch('');
              }}
            >
              <Leaf size={14} style={{ marginRight: 6 }} />
              Dự án gây quỹ ({initiatives.length})
            </button>

            <button
              type="button"
              className={`filter-pill ${activeSubTab === 'donors' ? 'active' : ''}`}
              onClick={() => {
                setActiveSubTab('donors');
                setSearch('');
              }}
            >
              <Heart size={14} style={{ marginRight: 6 }} />
              Người đã đóng góp ({donations.length})
            </button>

            <button
              type="button"
              className={`filter-pill ${activeSubTab === 'submissions' ? 'active' : ''}`}
              onClick={() => {
                setActiveSubTab('submissions');
                setSearch('');
              }}
            >
              <Users size={14} style={{ marginRight: 6 }} />
              Đơn đăng ký tài trợ ({submissions.length})
            </button>

            <button
              type="button"
              className={`filter-pill ${activeSubTab === 'programs' ? 'active' : ''}`}
              onClick={() => {
                setActiveSubTab('programs');
                setSearch('');
              }}
            >
              <School size={14} style={{ marginRight: 6 }} />
              Chương trình hợp tác ({programs.length})
            </button>
          </div>
        </div>

        {activeSubTab === 'submissions' && <AdminCrudButton resource="program-submissions" />}
      </div>

      {activeSubTab === 'programs' && <AdminCommunityPrograms programs={programs} />}
      {/* Control bar */}
      {activeSubTab !== 'programs' && <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {activeSubTab === 'initiatives' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
              }}
            >
              <option value="ALL">Tất cả danh mục</option>
              <option value="bom_noi">Bom nổi</option>
              <option value="school_community">Cột 2: Trường học & Cộng đồng</option>
              <option value="cleanup_activity">Cột 3: Hoạt động Dọn dẹp</option>
            </select>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>Tải lại</span>
          </button>

          {activeSubTab === 'initiatives' && (
            <button
              type="button"
              onClick={onOpenAddInitiative}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#16a34a',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>Thêm Hạng Mục Mới</span>
            </button>
          )}

          {activeSubTab === 'donors' && (
            <button
              type="button"
              onClick={onOpenAddDonation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#ea580c',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>Thêm Người Đóng Góp</span>
            </button>
          )}
        </div>
      </div>

      }
      {activeSubTab === 'initiatives' && <AdminInitiativesTable {...{ filteredInitiatives, onToggleInitiativeStatus, onEditInitiative, onDeleteInitiative }} />}
      {activeSubTab === 'donors' && <AdminDonationsTable {...{ filteredDonations, onEditDonation, onDeleteDonation }} />}
      {activeSubTab === 'submissions' && <AdminSubmissionsTable {...{ filteredSubmissions, onUpdateSubmissionStatus, onDeleteSubmission }} />}
    </div>
  );
};
