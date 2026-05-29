import type { ChangeEvent } from 'react';
import { useProviders } from '../../context/ProviderContext';
import { useChat } from '../../context/ChatContext';

export function ProviderSelector() {
  const { registered, providers } = useProviders();
  const { selectedProviderId, setSelectedProvider } = useChat();

  // Map the currently selected catalog ID back to the registered entry's id (for the select value)
  const selectedCatalogProvider = selectedProviderId
    ? providers.find((p) => p.id === selectedProviderId)
    : null;
  const selectValue = selectedCatalogProvider
    ? (registered.find((r) => r.displayName === selectedCatalogProvider.displayName)?.id ?? '')
    : '';

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (!val) {
      setSelectedProvider(null);
      return;
    }
    const reg = registered.find((r) => r.id === Number(val));
    if (!reg) return;
    const catalogProvider = providers.find((p) => p.displayName === reg.displayName);
    if (catalogProvider) setSelectedProvider(catalogProvider.id);
  }

  return (
    <select className="chat-select" value={selectValue} onChange={handleChange}>
      <option value="">Provider</option>
      {registered.map((r) => (
        <option key={r.id} value={r.id}>
          {r.displayName}
        </option>
      ))}
    </select>
  );
}
