import { ProviderList } from './ProviderList';
import { ProviderDetail } from './ProviderDetail';
import './Providers.css';

export function ProvidersPage() {
  return (
    <div className="providers-page">
      <div className="providers-layout">
        <ProviderList />
        <ProviderDetail />
      </div>
    </div>
  );
}
