import React from 'react';
import './communityPrograms.css';
import { BomNoiColumn } from './BomNoiColumn';
import { SchoolCommunityColumn } from './SchoolCommunityColumn';
import { CleanupActivityColumn } from './CleanupActivityColumn';
import type { RiverProtectionInitiative, ActivityDonation } from '../types';

interface CommunityProgramsSectionProps {
  initiatives: RiverProtectionInitiative[];
  donations: ActivityDonation[];
  onSelectInitiative: (initiative: RiverProtectionInitiative) => void;
  onOpenDonate: (initiative?: RiverProtectionInitiative) => void;
  onOpenSchoolRegister: (initiative?: RiverProtectionInitiative) => void;
}

export const CommunityProgramsSection: React.FC<CommunityProgramsSectionProps> = ({
  initiatives,
  donations,
  onSelectInitiative,
  onOpenDonate,
  onOpenSchoolRegister,
}) => {
  const bomNoiItems = initiatives
    .filter((i) => i.category === 'bom_noi' && i.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const schoolItems = initiatives
    .filter((i) => i.category === 'school_community' && i.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const cleanupItems = initiatives
    .filter((i) => i.category === 'cleanup_activity' && i.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="sgx-community-programs-section" style={{ padding: '60px 0', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '1480px', margin: '0 auto', padding: '0 20px' }}>
        {/* Section Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ width: '48px', height: '2px', background: '#16a34a' }} />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#15803d',
              }}
            >
              Bạn cũng có thể bảo vệ các dòng sông
            </span>
          </div>

          <h2
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.3,
              maxWidth: '820px',
              margin: '0 0 10px',
            }}
          >
            Hãy giúp chúng tôi đặt thêm rào cản ở những dòng sông ô nhiễm nhất thế giới!
          </h2>
          <p style={{ margin: 0, fontSize: '15px', color: '#64748b', maxWidth: '720px', lineHeight: 1.5 }}>
            Sài Gòn Xanh mở rộng cánh cửa đồng hành cùng mọi trường học, tổ chức thanh niên và doanh nghiệp vì mục tiêu hồi sinh các dòng kênh chết.
          </p>
        </div>

        {/* 3-Column Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* CỘT 1: BOM NỔI */}
          <BomNoiColumn items={bomNoiItems} onSelectItem={onSelectInitiative} />

          {/* CỘT 2: TRƯỜNG HỌC & CỘNG ĐỒNG */}
          <SchoolCommunityColumn
            items={schoolItems}
            onSelectItem={onSelectInitiative}
            onOpenSchoolRegister={onOpenSchoolRegister}
          />

          {/* CỘT 3: TÀI TRỢ DỌN DẸP VỆ SINH & SIDEBAR NHỮNG NGƯỜI ĐÃ ĐÓNG GÓP */}
          <CleanupActivityColumn
            items={cleanupItems}
            donations={donations}
            onSelectItem={onSelectInitiative}
            onOpenDonate={onOpenDonate}
          />
        </div>
      </div>
    </section>
  );
};
