import React, { useState } from 'react';
import {
  HeartHandshake,
  ChevronRight,
  Package,
  Heart,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import type { RiverProtectionInitiative, ActivityDonation } from '../types';
import { ActivityDonorList } from './ActivityDonorList';

interface CleanupActivityColumnProps {
  items: RiverProtectionInitiative[];
  donations: ActivityDonation[];
  onSelectItem: (item: RiverProtectionInitiative) => void;
  onOpenDonate: (item?: RiverProtectionInitiative) => void;
}

export const CleanupActivityColumn: React.FC<CleanupActivityColumnProps> = ({
  items,
  donations,
  onSelectItem,
  onOpenDonate,
}) => {
  const [tab, setTab] = useState<'items' | 'donors'>('items');

  return (
    <div
      data-testid="cleanup-activity-column"
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '24px 20px',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '520px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div className="program-column-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#ffedd5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ea580c',
              flexShrink: 0,
            }}
          >
            <HeartHandshake size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 'var(--program-heading-size)', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
              Tài trợ cho các hoạt động dọn dẹp vệ sinh
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--program-body-size)', color: '#64748b' }}>
              Hỗ trợ trang thiết bị, vật tư và chi phí cho các hoạt động
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenDonate(items[0])}
          style={{
            background: 'none',
            border: 'none',
            color: '#ea580c',
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

      {/* Sub-tab Switch in Column 3: Vật tư cần tài trợ vs Những người đã đóng góp */}
      <div
        style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '16px',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => setTab('items')}
          style={{
            flex: 1,
            padding: '6px 8px',
            border: 'none',
            borderRadius: '7px',
            fontSize: 'var(--program-body-size)',
            fontWeight: 700,
            cursor: 'pointer',
            background: tab === 'items' ? '#ffffff' : 'transparent',
            color: tab === 'items' ? '#ea580c' : '#64748b',
            boxShadow: tab === 'items' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          Vật tư cần tài trợ ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('donors')}
          style={{
            flex: 1,
            padding: '6px 8px',
            border: 'none',
            borderRadius: '7px',
            fontSize: 'var(--program-body-size)',
            fontWeight: 700,
            cursor: 'pointer',
            background: tab === 'donors' ? '#ffffff' : 'transparent',
            color: tab === 'donors' ? '#ea580c' : '#64748b',
            boxShadow: tab === 'donors' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <Heart size={12} fill={tab === 'donors' ? '#ea580c' : 'none'} />
          <span>Người đã đóng góp ({donations.length})</span>
        </button>
      </div>

      {/* TAB 1: Danh sách vật tư cần tài trợ */}
      {tab === 'items' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: items.length === 0 ? 'center' : 'flex-start' }}>
          {items.length === 0 ? (
            <div style={{ padding: '36px 12px', textAlign: 'center', color: '#64748b' }}>
              <Package size={28} color="#ea580c" style={{ margin: '0 auto 8px', opacity: 0.8 }} />
              <p style={{ fontWeight: 600, color: '#334155', margin: '0 0 4px', fontSize: 'var(--program-title-size)' }}>Chưa có vật tư cần tài trợ</p>
              <p style={{ fontSize: 'var(--program-body-size)', margin: 0 }}>Dữ liệu được cập nhật từ hệ thống quản lý.</p>
            </div>
          ) : (
            items.map((item) => {

              return (
              <div
                key={item.id}
                className="program-list-item"
                onClick={() => onSelectItem(item)}
                style={{
                  display: 'flex',
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
                      margin: '0 0 3px',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--program-meta-size)', flexWrap: 'wrap', color: '#64748b', marginBottom: '6px' }}>
                    <Package size={11} /> {item.locationOrOrg}
                  </div>
                  {/* Funding progress is hidden until verified statement data is connected. */}
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </div>
            );
          }))}

          {/* Docked Mini-Sidebar at bottom of Column 3 showing recent donors */}
          <div
            style={{
              marginTop: '10px',
              padding: '12px 14px',
              background: '#fff7ed',
              borderRadius: '14px',
              border: '1px solid #ffedd5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--program-body-size)', fontWeight: 800, color: '#c2410c' }}>
                <Sparkles size={14} color="#ea580c" />
                <span>Nhà tài trợ gần đây</span>
              </div>
              <button
                type="button"
                onClick={() => setTab('donors')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ea580c',
                  fontSize: 'var(--program-meta-size)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Xem tất cả ({donations.length}) &gt;
              </button>
            </div>

            {donations.length === 0 ? (
              <p style={{ fontSize: 'var(--program-meta-size)', color: '#9a3412', margin: '4px 0 8px', fontStyle: 'italic' }}>
                Chưa có lượt đóng góp nào được ghi nhận.
              </p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {donations.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    title={`${d.donorName}: ${d.itemSponsored || ''} - ${(d.amount || 0).toLocaleString('vi-VN')}đ`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid #fed7aa',
                      fontSize: 'var(--program-meta-size)',
                      fontWeight: 600,
                      color: '#334155',
                      whiteSpace: 'normal',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#ea580c',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {d.donorName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {d.donorName}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => onOpenDonate(items[0])}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '8px 12px',
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: 'var(--program-body-size)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <PlusCircle size={14} />
              <span>Tôi muốn đóng góp / tài trợ vật tư</span>
            </button>
          </div>
        </div>
      ) : (
        /* TAB 2: SIDEBAR CHI TIẾT NHỮNG NGƯỜI ĐÃ ĐÓNG GÓP */
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
          <ActivityDonorList donations={donations} />

          {/* Donate CTA button */}
          <button
            type="button"
            onClick={() => onOpenDonate(items[0])}
            style={{
              marginTop: 'auto',
              width: '100%',
              padding: '11px 16px',
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: 'var(--program-title-size)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
            }}
          >
            <Heart size={16} fill="#fff" />
            <span>Tôi muốn tài trợ vật tư / kinh phí</span>
          </button>
        </div>
      )}
    </div>
  );
};
