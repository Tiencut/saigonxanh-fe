import L from 'leaflet';

export interface MapPoint {
  id: string;
  kind: 'REPORT' | 'CAMPAIGN';
  trackingCode?: string;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string; // VERIFIED, IN_PROGRESS, RESOLVED, UPCOMING, ONGOING
  wasteType?: string;
  severity?: string;
  images?: string[];
  cleanedImages?: string[];
  cleanedAt?: string;
  wasteWeightKg?: number;
  startDate?: string;
  endDate?: string;
  targetVolunteers?: number;
  currentVolunteers?: number;
  bannerImage?: string;
}

export const OSM_TILE_URL =
  import.meta.env.VITE_OSM_TILE_URL || 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://openstreetmap.fr" target="_blank" rel="noopener">OSM France</a>';

// Custom Marker Icons for Leaflet
export function createCustomIcon(kind: 'REPORT' | 'CAMPAIGN', status: string) {
  let color = '#dc2626'; // Red for VERIFIED (Chưa dọn)
  let iconHtml = '📍';

  if (kind === 'CAMPAIGN') {
    color = '#15803d'; // Green for Campaign
    iconHtml = '🚩';
  } else if (status === 'IN_PROGRESS') {
    color = '#ea580c'; // Orange for in-progress
    iconHtml = '⏳';
  } else if (status === 'RESOLVED') {
    color = '#16a34a'; // Green for resolved
    iconHtml = '✨';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker sgx-marker-pin',
    html: `
      <div class="sgx-marker-pin-inner" style="
        background: ${color};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      ">
        <span style="transform: rotate(45deg); font-size: 14px;">${iconHtml}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}
