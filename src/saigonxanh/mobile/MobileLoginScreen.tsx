import { ArrowLeft } from 'lucide-react';
import { SgxAuthPanel } from '../components/SgxAuthPage';

export function MobileLoginScreen({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: () => void;
}) {
  return (
    <div className="sgx-mobile-auth">
      <button type="button" aria-label="Quay lại" className="sgx-auth-back" onClick={onBack}>
        <ArrowLeft size={22} />
      </button>
      <SgxAuthPanel onSuccess={onSuccess} />
    </div>
  );
}
