import { OrganizationLogo } from '../../organizations/OrganizationBrand';
import { ArrowLeft } from 'lucide-react';
import { SaiGonXanhMap } from '../SaiGonXanhMap';

export function MobileMapScreen({ onBack }: { onBack: () => void }) {
  return (
    <section className="mobile-map-screen" aria-label="Bản đồ môi trường">
      <header className="mobile-map-header">
        <button
          type="button"
          className="mobile-map-back"
          aria-label="Quay lại trang trước"
          onClick={onBack}
        >
          <ArrowLeft size={21} />
        </button>
        <h1>Bản đồ môi trường</h1>
        <OrganizationLogo alt="Sài Gòn Xanh" />
      </header>
      <div className="mobile-map-body">
        <SaiGonXanhMap compact />
      </div>
    </section>
  );
}
