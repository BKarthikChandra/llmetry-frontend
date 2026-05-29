import { useProviders } from '../../context/ProviderContext';
import { ProviderIcon } from './ProviderIcon';

export function ProviderList() {
  const { providers, selectedProviderId, selectProvider, isRegistered, loadingProviders } = useProviders();

  if (loadingProviders) {
    return (
      <div className="provider-list">
        <div className="provider-list-header">
          <span className="provider-list-title">Providers</span>
          <span className="provider-list-subtitle">API keys &amp; model configuration</span>
        </div>
        <div className="provider-list-loading">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="provider-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="provider-list">
      <div className="provider-list-header">
        <span className="provider-list-title">Providers</span>
        <span className="provider-list-subtitle">API keys &amp; model configuration</span>
      </div>

      <ul className="provider-list-items" role="listbox" aria-label="Provider list">
        {providers.map((provider) => {
          const registered = isRegistered(provider.id);
          const selected = provider.id === selectedProviderId;

          return (
            <li
              key={provider.id}
              role="option"
              aria-selected={selected}
              className={`provider-list-item${selected ? ' selected' : ''}`}
              onClick={() => selectProvider(provider.id)}
            >
              <ProviderIcon displayName={provider.displayName} size={36} />
              <div className="provider-list-item-info">
                <span className="provider-list-item-name">{provider.displayName}</span>
                <span className={`provider-status-dot ${registered ? 'connected' : 'unregistered'}`}>
                  <span className="status-dot-indicator" />
                  {registered ? 'Connected' : 'Not registered'}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
