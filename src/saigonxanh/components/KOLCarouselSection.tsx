import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Users } from 'lucide-react';
import { sgxApi } from '../api';
import type { KolItem } from '../types';

interface KOLCarouselSectionProps {
  onViewAll?: () => void;
  kols?: KolItem[];
}

export const KOLCarouselSection: React.FC<KOLCarouselSectionProps> = ({ onViewAll, kols: propKols }) => {
  const [items, setItems] = useState<KolItem[]>(propKols || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (propKols !== undefined) {
      setItems(propKols.filter((k) => k.active !== false));
      return;
    }
    sgxApi
      .getKols()
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data.filter((k) => k.active !== false));
        }
      })
      .catch((err) => {
        console.error('Lỗi tải danh sách KOL từ DB:', err);
      });
  }, [propKols]);

  const dragStartX = useRef<number | null>(null);
  const isPointerDown = useRef(false);
  const hasDragged = useRef(false);
  const total = items.length;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused || isDragging || total <= 1) return;
    const timer = setInterval(handleNext, 4500);
    return () => clearInterval(timer);
  }, [isPaused, isDragging, handleNext, total]);


  // Touch Swipe Handlers (dùng tay lướt trên màn hình cảm ứng)
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    isPointerDown.current = true;
    hasDragged.current = false;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPointerDown.current || dragStartX.current === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - dragStartX.current;
    if (Math.abs(diff) > 5) {
      hasDragged.current = true;
      setIsDragging(true);
      setDragOffset(diff * 0.85);
    }
  };

  const handleTouchEnd = () => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    if (dragOffset < -35) {
      handleNext();
    } else if (dragOffset > 35) {
      handlePrev();
    }
    setDragOffset(0);
    setIsDragging(false);
    dragStartX.current = null;
    setIsPaused(false);
  };

  // Mouse Drag Handlers (dùng chuột / trackpad kéo lướt)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Chỉ nhận chuột trái
    dragStartX.current = e.clientX;
    isPointerDown.current = true;
    hasDragged.current = false;
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPointerDown.current || dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 5) {
      hasDragged.current = true;
      setIsDragging(true);
      setDragOffset(diff * 0.85);
    }
  };

  const handleMouseUp = () => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    if (dragOffset < -35) {
      handleNext();
    } else if (dragOffset > 35) {
      handlePrev();
    }
    setDragOffset(0);
    setIsDragging(false);
    dragStartX.current = null;
    setIsPaused(false);
  };

  const handleCardClick = (itemIndex: number) => {
    // Nếu vừa lướt kéo xong thì không kích hoạt sự kiện click thẻ
    if (hasDragged.current) return;
    setActiveIndex(itemIndex);
  };

  if (items.length === 0) {
    return (
      <div className="showcase-panel showcase-panel-left">
        <div className="panel-header-row">
          <div className="section-title-wrap">
            <div className="decor-line" />
            <h2>GƯƠNG MẶT THÂN QUEN</h2>
          </div>
        </div>
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
          <Users size={36} color="#16a34a" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
          <p style={{ fontWeight: 600, color: '#334155', marginBottom: 4 }}>Chưa có nghệ sĩ đồng hành</p>
          <p style={{ fontSize: '13px' }}>Dữ liệu được cập nhật trực tiếp từ cơ sở dữ liệu quản trị viên.</p>
        </div>
      </div>
    );
  }

  // 5 vị trí tính toán chiều sâu: [-2, -1, 0, 1, 2]
  const visibleOffsets = [-2, -1, 0, 1, 2];

  return (
    <div className="showcase-panel showcase-panel-left">
      <div className="panel-header-row">
        <div className="section-title-wrap">
          <div className="decor-line" />
          <h2>GƯƠNG MẶT THÂN QUEN</h2>
        </div>
        {onViewAll && (
          <button
            type="button"
            className="btn-link-all-timeline"
            onClick={onViewAll}
            title="Xem tất cả nhân vật đồng hành"
          >
            <span>Xem tất cả</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* 3D Coverflow Stage với tính năng vuốt / lướt bằng tay hoặc chuột */}
      <div
        className={`panel-coverflow-viewport ${isDragging ? 'is-dragging' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          if (isPointerDown.current) {
            handleMouseUp();
          } else {
            setIsPaused(false);
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="panel-coverflow-stage"
          style={{
            transform: `translateX(${dragOffset}px)`,
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {visibleOffsets.map((offset) => {
            const itemIndex = (activeIndex + offset + total) % total;
            const kol = items[itemIndex];
            if (!kol) return null;
            const isCenter = offset === 0;

            return (
              <div
                key={`${kol.id}-${offset}`}
                className={`panel-coverflow-slot slot-offset-${offset} ${
                  isCenter ? 'slot-active' : ''
                }`}
                onClick={() => handleCardClick(itemIndex)}
                title={kol.name}
              >
                <div className="panel-coverflow-card">
                  <img
                    src={kol.image}
                    alt={kol.name}
                    draggable={false}
                    className="panel-coverflow-img"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('saigonxanh-eb662.web.app')) {
                        target.src = `https://saigonxanh-eb662.web.app${kol.image}`;
                      } else if (!target.src.endsWith('/images/trangChu/logo.png')) {
                        target.src = '/images/trangChu/logo.png';
                      }
                    }}
                  />
                  <div className="panel-coverflow-scrim" />
                  {/* Chỉ để lại tên theo yêu cầu của người dùng */}
                  <div className="panel-coverflow-overlay">
                    <p className="panel-coverflow-name">{kol.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          className="panel-coverflow-btn prev"
          onClick={handlePrev}
          aria-label="Xem trước"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          className="panel-coverflow-btn next"
          onClick={handleNext}
          aria-label="Xem tiếp"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots Pagination */}
      <div className="panel-coverflow-dots">
        {items.map((kol, idx) => (
          <button
            key={kol.id}
            type="button"
            className={`panel-coverflow-dot ${activeIndex === idx ? 'active' : ''}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Chuyển đến ${kol.name}`}
          />
        ))}
      </div>


    </div>
  );
};
