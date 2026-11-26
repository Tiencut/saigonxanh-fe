import React from 'react';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import type { NewsArticle } from '../types';

interface LatestNewsSectionProps {
  newsList: NewsArticle[];
  onViewAll?: () => void;
  onSelectNews?: (item: NewsArticle) => void;
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({
  newsList,
  onViewAll,
  onSelectNews,
}) => {
  return (
    <section className="sgx-news-section">
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div className="panel-tag-row">
            <span className="panel-dash-line" />
            <span className="panel-tag-label">TIN TỨC VỀ SÀI GÒN XANH</span>
          </div>
          <h2 className="panel-main-heading">
            Tin tức và <span className="highlight-green">hoạt động</span>
          </h2>
        </div>
        {onViewAll && (
          <button
            type="button"
            className="btn-link-action"
            onClick={onViewAll}
            title="Xem tất cả tin tức & hoạt động"
          >
            <span>Xem tất cả</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* News Rows Container Card (from DB) */}
      <div className="news-rows-card">
        {newsList.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b' }}>
            <BookOpen size={28} color="#16a34a" style={{ margin: '0 auto 10px', opacity: 0.8 }} />
            <p style={{ fontWeight: 600, color: '#334155', marginBottom: 4 }}>Chưa có bài viết tin tức mới</p>
            <p style={{ fontSize: '13px' }}>Ban truyền thông Sài Gòn Xanh sẽ cập nhật thông tin sớm nhất.</p>
          </div>
        ) : (
          newsList.map((item: any) => {
            const thumb = item.coverImage || '/images/trangChu/1.png';
            const dateStr = item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('vi-VN')
              : item.date || 'Hôm nay';
            const category = item.category || 'Hoạt động cộng đồng';

            return (
              <a
                key={item.id}
                className="news-row-item"
                href={item.url || '#'}
                target={item.url ? '_blank' : undefined}
                rel={item.url ? 'noopener noreferrer' : undefined}
                style={{ color: 'inherit', textDecoration: 'none' }}
                onClick={(event) => {
                  if (item.url) return;
                  event.preventDefault();
                  if (onSelectNews) onSelectNews(item);
                  else onViewAll?.();
                }}
                title={item.title}
              >
                <div className="news-row-thumb">
                  <img src={thumb} alt={item.title} />
                </div>
                <div className="news-row-info">
                  <div className="news-row-meta">
                    <span className="news-row-date">
                      <Calendar size={12} className="calendar-icon" />
                      <span>{dateStr}</span>
                    </span>
                    <span className="news-row-pill">{category}</span>
                  </div>
                  <h4 className="news-row-title">{item.title}</h4>
                  {item.source && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>Nguồn: {item.source}</p>}
                </div>
                <div className="news-row-action">
                  <span className="action-circle-btn">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </a>
            );
          })
        )}
      </div>
    </section>
  );
};
