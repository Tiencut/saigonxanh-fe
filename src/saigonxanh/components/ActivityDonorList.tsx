import React from 'react';
import { Heart, Clock } from 'lucide-react';
import type { ActivityDonation } from '../types';

export function ActivityDonorList({ donations }: { donations: ActivityDonation[] }) {
  return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              maxHeight: '340px',
              overflowY: 'auto',
              paddingRight: '4px',
              marginBottom: '14px',
            }}
          >
            {donations.length === 0 ? (
            <div style={{ padding: '40px 12px', textAlign: 'center', color: '#64748b' }}>
              <Heart size={28} color="#ea580c" style={{ margin: '0 auto 8px', opacity: 0.8 }} />
              <p style={{ fontWeight: 600, color: '#334155', margin: '0 0 4px', fontSize: '13px' }}>Chưa có lượt đóng góp nào</p>
              <p style={{ fontSize: '12px', margin: 0 }}>Hãy là người đầu tiên tiếp sức cho đội ngũ!</p>
            </div>
          ) : (
            donations.map((d) => (
              <div
                key={d.id}
                style={{
                  padding: '10px 12px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {d.donorName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                      {d.donorName}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={10} /> {d.timeAgo || 'Vừa xong'}
                  </span>
                </div>

                {/* Item or Amount */}
                <div style={{ fontSize: '12px', color: '#ea580c', fontWeight: 700, marginBottom: '2px' }}>
                  {d.itemSponsored && <span>✨ {d.itemSponsored}</span>}
                  {d.amount > 0 && (
                    <span style={{ marginLeft: d.itemSponsored ? '6px' : 0 }}>
                      ({d.amount.toLocaleString('vi-VN')} đ)
                    </span>
                  )}
                </div>

                {/* Message quote */}
                {d.message && (
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#475569', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{d.message}"
                  </p>
                )}
              </div>
            )))}
          </div>
  );
}
