import React from 'react';
import { Users, ChevronRight, Building, Calendar } from 'lucide-react';
import type { RiverProtectionInitiative } from '../types';

interface SchoolCommunityColumnProps {
  items: RiverProtectionInitiative[];
  onSelectItem: (item: RiverProtectionInitiative) => void;
  onOpenSchoolRegister: (item?: RiverProtectionInitiative) => void;
}

export const SchoolCommunityColumn: React.FC<SchoolCommunityColumnProps> = ({
  items,
  onSelectItem,
  onOpenSchoolRegister,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '24px 20px',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '520px',
      }}
    >
      {/* Header */}
      <div className="program-column-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              flexShrink: 0,
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 'var(--program-heading-size)', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
              Tổ chức gây quỹ với trường học hoặc cộng đồng
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--program-body-size)', color: '#64748b' }}>
              Cùng lan toả lối sống xanh trong cộng đồng
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenSchoolRegister(items[0])}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: 'var(--program-body-size)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            whiteSpace: 'normal',
            padding: '4px 0',
          }}
        >
          <span>Xem tất cả</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* List Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: items.length === 0 ? 'center' : 'flex-start' }}>
        {items.length === 0 ? (
          <div style={{ padding: '36px 12px', textAlign: 'center', color: '#64748b' }}>
            <Users size={28} color="#2563eb" style={{ margin: '0 auto 8px', opacity: 0.8 }} />
            <p style={{ fontWeight: 600, color: '#334155', margin: '0 0 4px', fontSize: 'var(--program-title-size)' }}>Chưa có dự án trường học & cộng đồng</p>
            <p style={{ fontSize: 'var(--program-body-size)', margin: 0 }}>Dữ liệu được cập nhật từ hệ thống quản lý.</p>
          </div>
        ) : (
          items.map((item) => (
          <div
            key={item.id}
                className="program-list-item program-school-row"
            onClick={() => onSelectItem(item)}
            style={{
              display: 'grid',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 10px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'background 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'translateX(3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: 'var(--program-image-size)',
                height: 'var(--program-image-size)',
                borderRadius: '10px',
                objectFit: 'cover',
                flexShrink: 0,
              }}
              onError={(e) => {
                e.currentTarget.src = '/images/trangChu/logo.png';
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4
                style={{
                  margin: '0 0 4px',
                  fontSize: 'var(--program-title-size)',
                  fontWeight: 700,
                  color: '#0f172a',
                  whiteSpace: 'normal',
                  overflow: 'hidden',
                  lineHeight: 1.45,
                }}
              >
                {item.title}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--program-meta-size)', flexWrap: 'wrap', color: '#64748b', marginBottom: '3px' }}>
                <Building size={11} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.locationOrOrg}
                </span>
              </div>
              {item.metaInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--program-meta-size)', flexWrap: 'wrap', color: '#64748b' }}>
                  <Calendar size={11} />
                  <span>{item.metaInfo}</span>
                </div>
              )}
            </div>
            {/* Status Badge */}
            <span
              style={{
                fontSize: 'var(--program-meta-size)',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '999px',
                whiteSpace: 'normal',
                background:
                  item.status === 'ongoing' ? '#dbeafe' : item.status === 'upcoming' ? '#e0f2fe' : '#f1f5f9',
                color:
                  item.status === 'ongoing' ? '#1d4ed8' : item.status === 'upcoming' ? '#0369a1' : '#64748b',
              }}
            >
              {item.status === 'ongoing' ? 'Đang diễn ra' : item.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
            </span>
            <ChevronRight size={16} color="#94a3b8" />
          </div>
        )))}
      </div>
    </div>
  );
};
