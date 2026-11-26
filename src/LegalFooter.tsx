import { Link } from 'react-router-dom';
import { useI18n } from './i18n';
import type { PublicConfig } from './App';

export function LegalFooter({ config }: { config: PublicConfig }) {
  const { t } = useI18n();
  return (
    <footer className="legal-footer">
      <div>
        <Link to="/legal/terms">{t('legalFooterTerms')}</Link>
        <Link to="/legal/privacy">{t('legalFooterPrivacy')}</Link>
        <Link to="/legal/complaints">{t('legalFooterComplaints')}</Link>
      </div>
      {config.company?.name && (
        <address>
          {config.company.name} · {config.company.address}
          <br />
          {config.company.taxId} · {config.company.email} · {config.company.phone}
          {config.company.representative && (
            <>
              <br />
              {config.company.representative}
            </>
          )}
          {config.company.registration && (
            <>
              <br />
              {config.company.registration}
            </>
          )}
        </address>
      )}
      {config.commerce?.verificationUrl && (
        <a href={config.commerce.verificationUrl} target="_blank" rel="noopener noreferrer">
          {t('moitVerification')}
        </a>
      )}
    </footer>
  );
}

