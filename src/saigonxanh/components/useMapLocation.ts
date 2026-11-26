import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import L from 'leaflet';

export function useMapLocation(mapRef: RefObject<L.Map | null>) {
  const markerRef = useRef<L.CircleMarker | null>(null);
  const requestId = useRef(0);
  const pending = useRef(false);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [locationState, setLocationState] = useState<'locating' | 'located' | 'error'>('locating');

  const handleMyLocation = useCallback(() => {
    if (pending.current) return;
    if (!navigator.geolocation) {
      setLocationState('error');
      setLocationMessage('Trình duyệt không hỗ trợ định vị. Bạn có thể chọn vị trí trên bản đồ.');
      return;
    }
    const id = ++requestId.current;
    pending.current = true;
    setLocating(true);
    setLocationState('locating');
    setLocationMessage('Đang xác định vị trí hiện tại…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (id !== requestId.current || !mapRef.current) return;
        const { latitude, longitude } = position.coords;
        const map = mapRef.current;
        map.setView([latitude, longitude], Math.min(16, map.getMaxZoom()), { animate: false });
        if (markerRef.current) markerRef.current.setLatLng([latitude, longitude]);
        else
          markerRef.current = L.circleMarker([latitude, longitude], {
            radius: 8,
            color: '#0284c7',
            fillColor: '#38bdf8',
            fillOpacity: 0.8,
            weight: 3,
            className: 'sgx-current-location',
          })
            .bindPopup('Vị trí của bạn')
            .addTo(map);
        pending.current = false;
        setLocating(false);
        setLocationState('located');
        setLocationMessage('Đã hiển thị vị trí hiện tại của bạn.');
      },
      (error) => {
        if (id !== requestId.current) return;
        pending.current = false;
        setLocating(false);
        setLocationState('error');
        setLocationMessage(
          error.code === 1
            ? 'Chưa được cấp quyền vị trí. Hãy cho phép trong trình duyệt hoặc chọn vị trí trên bản đồ.'
            : 'Chưa xác định được vị trí. Bạn có thể thử lại hoặc chọn vị trí trên bản đồ.',
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, [mapRef]);

  useEffect(() => {
    handleMyLocation();
    return () => {
      requestId.current++;
      pending.current = false;
      if (mapRef.current) markerRef.current?.remove();
      markerRef.current = null;
    };
  }, [handleMyLocation, mapRef]);

  return { handleMyLocation, locating, locationMessage, locationState };
}
