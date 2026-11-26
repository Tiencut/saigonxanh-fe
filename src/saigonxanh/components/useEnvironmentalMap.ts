import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { createCustomIcon, OSM_TILE_URL, OSM_ATTRIBUTION, type MapPoint } from './mapSupport';
import { useMapLocation } from './useMapLocation';

export function useEnvironmentalMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const reportPinMarkerRef = useRef<L.Marker | null>(null);
  const viewportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointsRequestRef = useRef<AbortController | null>(null);

  // States
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [counts, setCounts] = useState({ verified: 0, inProgress: 0, resolved: 0, campaigns: 0 });
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED' | 'CAMPAIGN'
  >('ALL');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const statusFilterRef = useRef(statusFilter);
  statusFilterRef.current = statusFilter;
  const [loading, setLoading] = useState(false);

  // Nominatim Search (On explicit search only, NO autocomplete)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Report Modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [reportLat, setReportLat] = useState<number | null>(null);
  const [reportLon, setReportLon] = useState<number | null>(null);
  const [reportAddress, setReportAddress] = useState('');
  const [reverseLoading, setReverseLoading] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    wasteType: 'Rác thải nhựa & túi nilon',
    severity: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    reporterName: '',
    reporterPhone: '',
    images: [] as string[],
  });
  const [submitSuccessCode, setSubmitSuccessCode] = useState<string | null>(null);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default: Ho Chi Minh City center
    const map = L.map(mapContainerRef.current, {
      center: [10.7769, 106.7009],
      zoom: 10,
      maxZoom: 10,
      bounceAtZoomLimits: false,
      zoomControl: false,
      wheelDebounceTime: 150,
      wheelPxPerZoomLevel: 120,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer(OSM_TILE_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 10,
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 1,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Viewport change listener (bbox query)
    const onMoveEnd = () => {
      if (viewportTimerRef.current) clearTimeout(viewportTimerRef.current);
      viewportTimerRef.current = setTimeout(fetchPointsInBounds, 250);
    };
    map.on('moveend', onMoveEnd);

    // Click map to place report marker if in picking mode
    map.on('click', (e: L.LeafletMouseEvent) => {
      handleMapClick(e.latlng.lat, e.latlng.lng);
    });

    // Initial load
    fetchPointsInBounds();

    return () => {
      if (viewportTimerRef.current) clearTimeout(viewportTimerRef.current);
      pointsRequestRef.current?.abort();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const { handleMyLocation, locating, locationMessage, locationState } = useMapLocation(mapInstanceRef);

  // 2. Fetch points in current map viewport
  const fetchPointsInBounds = async () => {
    if (!mapInstanceRef.current) return;
    if (viewportTimerRef.current) clearTimeout(viewportTimerRef.current);
    pointsRequestRef.current?.abort();
    const controller = new AbortController();
    pointsRequestRef.current = controller;
    const bounds = mapInstanceRef.current.getBounds();
    const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;

    try {
      setLoading(true);
      const url = `/api/map/points?bbox=${bbox}&status=${statusFilterRef.current}`;
      const resp = await fetch(url, { signal: controller.signal });
      if (!resp.ok) throw new Error(`Map points: HTTP ${resp.status}`);
      const res = await resp.json();
      if (!controller.signal.aborted && res.data) {
        setPoints(res.data.points || []);
        if (res.data.counts) setCounts(res.data.counts);
      }
    } catch (err) {
      if (!controller.signal.aborted) console.error('Error fetching map points:', err);
    } finally {
      if (pointsRequestRef.current === controller && !controller.signal.aborted) setLoading(false);
    }
  };

  // 3. Render markers whenever points or statusFilter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    points.forEach((point) => {
      if (typeof point.latitude !== 'number' || typeof point.longitude !== 'number') return;

      const marker = L.marker([point.latitude, point.longitude], {
        icon: createCustomIcon(point.kind, point.status),
      });

      // Marker click opens popup & selection
      marker.on('click', () => {
        setSelectedPoint(point);
      });

      // Quick Leaflet Popup
      const statusText =
        point.kind === 'CAMPAIGN'
          ? 'Đợt ra quân Sài Gòn Xanh'
          : point.status === 'VERIFIED'
            ? 'Chưa xử lý'
            : point.status === 'IN_PROGRESS'
              ? 'Đang dọn dẹp'
              : 'Đã dọn sạch';

      const popupHtml = `
        <div style="font-family: inherit; min-width: 200px; padding: 4px;">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 4px;">${point.title}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">📍 ${point.address}</div>
          <div style="display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #f1f5f9; margin-bottom: 8px;">
            ${statusText}
          </div>
          <div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}" target="_blank" rel="noopener" style="display: inline-block; font-size: 11px; color: #0284c7; text-decoration: none; font-weight: 600;">
              ↗ Chỉ đường tới đây
            </a>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);

      markersLayerRef.current?.addLayer(marker);
    });
  }, [points]);

  // Refetch when filter changes
  useEffect(() => {
    fetchPointsInBounds();
  }, [statusFilter]);

  // 4. Handle Nominatim Search (Explicit Enter or Click button)
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query || query.length < 2) return;

    try {
      setSearchLoading(true);
      const resp = await fetch(`/api/geocoding/search?q=${encodeURIComponent(query)}`);
      const res = await resp.json();
      if (res.data) {
        setSearchResults(res.data);
      } else {
        alert(res.error?.message || 'Không tìm thấy địa chỉ phù hợp');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi tìm kiếm địa chỉ');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectSearchResult = (item: any) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([item.latitude, item.longitude], Math.min(16, mapInstanceRef.current.getMaxZoom()), { duration: 1.5 });
    setSearchResults([]);
    setSearchQuery(item.displayName);
  };

  // 6. Map Click when in picking mode
  const handleMapClick = async (lat: number, lon: number) => {
    setReportLat(lat);
    setReportLon(lon);

    if (mapInstanceRef.current) {
      if (reportPinMarkerRef.current) {
        reportPinMarkerRef.current.setLatLng([lat, lon]);
      } else {
        const pin = L.marker([lat, lon], {
          draggable: true,
          icon: L.divIcon({
            html: '<div style="font-size: 28px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">📍</div>',
            iconSize: [28, 28],
            iconAnchor: [14, 28],
          }),
        }).addTo(mapInstanceRef.current);

        // Reverse geocode ONLY when user stops dragging
        pin.on('dragend', () => {
          const pos = pin.getLatLng();
          setReportLat(pos.lat);
          setReportLon(pos.lng);
          triggerReverseGeocoding(pos.lat, pos.lng);
        });

        reportPinMarkerRef.current = pin;
      }
    }

    // Trigger reverse geocoding to auto-fill address
    await triggerReverseGeocoding(lat, lon);
  };

  // Trigger Nominatim reverse geocode via backend proxy
  const triggerReverseGeocoding = async (lat: number, lon: number) => {
    try {
      setReverseLoading(true);
      const resp = await fetch(`/api/geocoding/reverse?lat=${lat}&lon=${lon}`);
      const res = await resp.json();
      if (res.data) {
        setReportAddress(res.data.formattedAddress || res.data.displayName || '');
      }
    } catch (err) {
      console.error('Reverse geocode failed:', err);
    } finally {
      setReverseLoading(false);
    }
  };

  // 7. Submit Report Form
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reportLat === null || reportLon === null) {
      alert('Vui lòng chọn vị trí trên bản đồ');
      return;
    }

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reportForm,
          address: reportAddress,
          latitude: reportLat,
          longitude: reportLon,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const trackingCode = data.data?.trackingCode || data.trackingCode;
        setSubmitSuccessCode(trackingCode);
        fetchPointsInBounds();
        // Remove draggable pin
        if (reportPinMarkerRef.current && mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(reportPinMarkerRef.current);
          reportPinMarkerRef.current = null;
        }
      } else {
        alert(data.error?.message || data.error || 'Lỗi gửi phản ánh');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi gửi phản ánh');
    }
  };

  return {
    mapContainerRef,
    mapInstanceRef,
    markersLayerRef,
    reportPinMarkerRef,
    points,
    setPoints,
    counts,
    setCounts,
    statusFilter,
    setStatusFilter,
    selectedPoint,
    setSelectedPoint,
    loading,
    setLoading,
    searchQuery,
    setSearchQuery,
    searchLoading,
    setSearchLoading,
    searchResults,
    setSearchResults,
    showReportModal,
    setShowReportModal,
    isPickingLocation,
    setIsPickingLocation,
    reportLat,
    setReportLat,
    reportLon,
    setReportLon,
    reportAddress,
    setReportAddress,
    reverseLoading,
    setReverseLoading,
    reportForm,
    setReportForm,
    submitSuccessCode,
    setSubmitSuccessCode,
    fetchPointsInBounds,
    handleSearch,
    handleSelectSearchResult,
    handleMapClick,
    triggerReverseGeocoding,
    handleSubmitReport,
    handleMyLocation,
    locating,
    locationMessage,
    locationState,
  };
}
