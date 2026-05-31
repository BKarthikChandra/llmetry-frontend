import { useProviders } from '../../context/ProviderContext';
import { formatUtcDateToLocal } from '../../utils/dateTime';
import { ProviderIcon } from './ProviderIcon';
import { RegisterForm } from './RegisterForm';
import { ModelsSection } from './ModelsSection';

export function ProviderDetail() {
  const { providers, selectedProviderId, isRegistered, getRegisteredInfo } = useProviders();

  if (selectedProviderId == null) {
    return (
      <div className="provider-detail provider-detail-empty">
        <div className="detail-empty-icon">
          <GridIcon />
        </div>
        <p className="detail-empty-text">Select a provider to view details</p>
      </div>
    );
  }

  const provider = providers.find((p) => p.id === selectedProviderId);
  if (!provider) return null;

  const registered = isRegistered(selectedProviderId);
  const registeredInfo = getRegisteredInfo(selectedProviderId);

  return (
    <div className="provider-detail">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-header-left">
          <ProviderIcon displayName={provider.displayName} size={44} />
          <div className="detail-header-info">
            <h2 className="detail-provider-name">{provider.displayName}</h2>
            {registeredInfo && (
              <p className="detail-registered-date">
                registered {formatDate(registeredInfo.registeredAt)}
              </p>
            )}
          </div>
        </div>
        <span className={`detail-status-badge ${registered ? 'connected' : 'unregistered'}`}>
          {registered ? 'Connected' : 'Not registered'}
        </span>
      </div>

      {/* API Key section — shown only when registered */}
      {registered && (
        <div className="detail-section">
          <span className="detail-section-label">API KEY</span>
          <div className="detail-apikey-row">
            <div className="detail-apikey-display">
              <LockIcon />
              <span className="detail-apikey-text">API key is configured</span>
            </div>
          </div>
        </div>
      )}

      {/* Register form — shown when not registered */}
      {!registered && (
        <div className="detail-section">
          <RegisterForm providerId={provider.id} displayName={provider.displayName} />
        </div>
      )}

      {/* Models section — shown only when registered */}
      {registered && (
        <div className="detail-section">
          <ModelsSection providerId={provider.id} />
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  return formatUtcDateToLocal(iso, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x={2} y={2} width={9} height={9} rx={1} />
      <rect x={13} y={2} width={9} height={9} rx={1} />
      <rect x={2} y={13} width={9} height={9} rx={1} />
      <rect x={13} y={13} width={9} height={9} rx={1} />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
