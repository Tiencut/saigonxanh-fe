import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  Search,
  Plus,
  X,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

import { useEnvironmentalMap } from './components/useEnvironmentalMap';
import { MapReportModal } from './components/MapReportModal';
import './components/mapLocation.css';
import './components/compactMap.css';
export type { MapPoint } from './components/mapSupport';

export function SaiGonXanhMap({ compact: embedded = false }: { compact?: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(embedded);
  const [listExpanded, setListExpanded] = useState(false);
  const compact = embedded || narrow;
  const mapState = useEnvironmentalMap();
  const { locating } = mapState;
  const {
    mapContainerRef,
    mapInstanceRef,
    points,
    statusFilter,
    setStatusFilter,
    selectedPoint,
    setSelectedPoint,
    loading,
    searchQuery,
    setSearchQuery,
    searchResults,
    setShowReportModal,
    setIsPickingLocation,
    reportLat,
    handleSearch,
    handleSelectSearchResult,
    handleMapClick,
    handleMyLocation,
    locationMessage,
    locationState,
  } = mapState;
  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 768));
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => mapInstanceRef.current?.invalidateSize());
    return () => cancelAnimationFrame(frame);
  }, [compact, listExpanded, mapInstanceRef]);
  return (
    <div
      ref={wrapperRef}
      className={`sgx-map-page-wrapper ${compact ? 'is-compact' : ''} ${embedded ? 'is-embedded' : ''} ${listExpanded ? 'is-list-expanded' : ''}`}
    >
      {/* SIDEBAR: Controls & Point list */}
      <aside className="sgx-map-sidebar">
        {/* Header Search */}
        <div className="map-search-box">
          <form onSubmit={handleSearch} className="map-search-form">
            <input
              aria-label="Tìm địa chỉ trên bản đồ"
              type="text"
              placeholder="Tìm địa chỉ, cây cầu, con kênh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="map-search-input"
            />
            <button type="submit" className="map-search-btn" title="Tìm kiếm">
              <Search size={16} />
            </button>
          </form>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="search-result-item"
                  onClick={() => handleSelectSearchResult(item)}
                >
                  <MapPin size={14} className="flex-shrink-0" />
                  <span className="search-item-text">{item.displayName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filters */}
        <div className="map-filter-row">
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            Tất cả ({points.length})
          </button>
          <button
            type="button"
            className={`filter-pill red ${statusFilter === 'VERIFIED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('VERIFIED')}
          >
            Chưa dọn
          </button>
          <button
            type="button"
            className={`filter-pill orange ${statusFilter === 'IN_PROGRESS' ? 'active' : ''}`}
            onClick={() => setStatusFilter('IN_PROGRESS')}
          >
            Đang dọn
          </button>
          <button
            type="button"
            className={`filter-pill green ${statusFilter === 'RESOLVED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('RESOLVED')}
          >
            Đã dọn
          </button>
          <button
            type="button"
            className={`filter-pill campaign ${statusFilter === 'CAMPAIGN' ? 'active' : ''}`}
            onClick={() => setStatusFilter('CAMPAIGN')}
          >
            Chiến dịch
          </button>
        </div>

        {/* Points List */}
        <div className="map-points-list">
          <div className="points-list-title">
            <span>
              {compact ? `Điểm trong khu vực (${points.length})` : 'Điểm môi trường trong khu vực'}
            </span>
            {loading && <span className="loading-dot">Đang tải...</span>}
            {compact && (
              <button
                className="map-list-toggle"
                type="button"
                aria-expanded={listExpanded}
                aria-label={listExpanded ? 'Thu gọn danh sách' : 'Mở rộng danh sách'}
                onClick={() => setListExpanded((value) => !value)}
              >
                {listExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
            )}
          </div>

          {points.length === 0 ? (
            <div className="empty-points-state">
              <p>Chưa có điểm rác nào trong khu vực bản đồ này.</p>
              <p className="text-xs text-muted">
                Kéo bản đồ hoặc bấm nút "Báo điểm rác" để phản ánh.
              </p>
            </div>
          ) : (
            points.map((p) => (
              <div
                key={p.id}
                className={`map-point-card ${selectedPoint?.id === p.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedPoint(p);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([p.latitude, p.longitude], Math.min(16, mapInstanceRef.current.getMaxZoom()));
                  }
                }}
              >
                <div className="point-card-header">
                  <span
                    className={`point-status-tag ${
                      p.kind === 'CAMPAIGN'
                        ? 'campaign'
                        : p.status === 'VERIFIED'
                          ? 'verified'
                          : p.status === 'IN_PROGRESS'
                            ? 'in-progress'
                            : 'resolved'
                    }`}
                  >
                    {p.kind === 'CAMPAIGN'
                      ? 'Chiến dịch ra quân'
                      : p.status === 'VERIFIED'
                        ? 'Chưa xử lý'
                        : p.status === 'IN_PROGRESS'
                          ? 'Đang xử lý'
                          : 'Đã dọn sạch'}
                  </span>
                  {p.severity && (
                    <span className={`point-severity ${p.severity.toLowerCase()}`}>
                      {p.severity}
                    </span>
                  )}
                </div>
                <h4 className="point-card-title">{p.title}</h4>
                <p className="point-card-address">📍 {p.address}</p>
                {p.wasteWeightKg ? (
                  <p className="point-card-waste">
                    ♻️ Thu gom được: {p.wasteWeightKg.toLocaleString()} kg
                  </p>
                ) : null}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* MAP STAGE */}
      <main className="sgx-map-stage">
        <div ref={mapContainerRef} className="leaflet-map-canvas" />

        <p className={`map-location-status is-${locationState}`} role="status">
          {locationMessage}
        </p>

        {/* Floating Controls */}
        <div className="map-floating-controls">
          <button
            type="button"
            className="btn-map-control"
            onClick={handleMyLocation}
            title={locating ? 'Đang định vị…' : 'Vị trí của tôi'}
            disabled={locating}
            aria-busy={locating}
          >
            <Navigation size={18} />
          </button>
          <button
            type="button"
            className="btn-map-report"
            onClick={() => {
              setShowReportModal(true);
              setIsPickingLocation(true);
              // Set default near current map center if not set
              if (mapInstanceRef.current && reportLat === null) {
                const c = mapInstanceRef.current.getCenter();
                handleMapClick(c.lat, c.lng);
              }
            }}
          >
            <Plus size={18} />
            <span>Báo điểm rác</span>
          </button>
        </div>

        {/* Selected Point Bottom Sheet / Card */}
        {selectedPoint && (
          <div className="map-detail-sheet">
            <div className="detail-sheet-header">
              <span
                className={`sheet-tag ${
                  selectedPoint.kind === 'CAMPAIGN'
                    ? 'campaign'
                    : selectedPoint.status === 'VERIFIED'
                      ? 'verified'
                      : selectedPoint.status === 'IN_PROGRESS'
                        ? 'in-progress'
                        : 'resolved'
                }`}
              >
                {selectedPoint.kind === 'CAMPAIGN'
                  ? 'Chiến dịch ra quân'
                  : selectedPoint.status === 'VERIFIED'
                    ? 'Chưa xử lý'
                    : selectedPoint.status === 'IN_PROGRESS'
                      ? 'Đang xử lý'
                      : 'Đã dọn sạch'}
              </span>
              <button
                type="button"
                className="btn-close-sheet"
                onClick={() => setSelectedPoint(null)}
              >
                <X size={16} />
              </button>
            </div>
            <h3 className="detail-sheet-title">{selectedPoint.title}</h3>
            <p className="detail-sheet-address">📍 {selectedPoint.address}</p>
            <p className="detail-sheet-desc">{selectedPoint.description}</p>

            {selectedPoint.cleanedImages && selectedPoint.cleanedImages.length > 0 && (
              <div className="detail-sheet-images">
                <span className="images-title">Hình ảnh sau khi dọn sạch:</span>
                <div className="images-row">
                  {selectedPoint.cleanedImages.map((img, i) => (
                    <img key={i} src={img} alt="Đã dọn sạch" className="sheet-thumb" />
                  ))}
                </div>
              </div>
            )}

            <div className="detail-sheet-actions">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.latitude},${selectedPoint.longitude}`}
                target="_blank"
                rel="noopener"
                className="btn-directions"
              >
                <ExternalLink size={14} />
                <span>Chỉ đường trên Google Maps</span>
              </a>
            </div>
          </div>
        )}
      </main>

      <MapReportModal mapState={mapState} />
    </div>
  );
}
