import { useEffect, useState } from 'react';
import { getRegisteredProviders } from '../../../services/providerService';
import type { RegisteredProvider } from '../../../types/provider';
import type { AnalyticsFilters } from '../../../types/analytics';
import styles from './FilterBar.module.css';

type DatePreset = '7d' | '30d' | '90d' | 'custom';

const PRESET_LABELS: Record<DatePreset, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  custom: 'Custom…',
};

function computeDateRange(preset: Exclude<DatePreset, 'custom'>): { from: string; to: string } {
  const now = new Date();
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90;
  const from = new Date(now.getTime() - days * 86400000).toISOString().split('T')[0];
  const to = now.toISOString().split('T')[0];
  return { from, to };
}

function inferPreset(from?: string, to?: string): DatePreset {
  if (!from || !to) return '7d';
  const diffDays = Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / 86400000,
  );
  if (diffDays === 7) return '7d';
  if (diffDays === 30) return '30d';
  if (diffDays === 90) return '90d';
  return 'custom';
}

interface FilterBarProps {
  filters: AnalyticsFilters;
  onChange: (filters: AnalyticsFilters) => void;
  loading?: boolean;
}

export function FilterBar({ filters, onChange, loading }: FilterBarProps) {
  const [providers, setProviders] = useState<RegisteredProvider[]>([]);
  const [preset, setPreset] = useState<DatePreset>(() => inferPreset(filters.from, filters.to));

  useEffect(() => {
    getRegisteredProviders().then(setProviders).catch(() => {});
  }, []);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    onChange({ ...filters, providerId: raw ? Number(raw) : undefined });
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = e.target.value as DatePreset;
    setPreset(p);
    if (p !== 'custom') {
      onChange({ ...filters, ...computeDateRange(p) });
    }
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, from: e.target.value || undefined });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, to: e.target.value || undefined });
  };

  return (
    <div className={styles.filters}>
      <select
        className={styles.pill}
        value={filters.providerId ?? ''}
        onChange={handleProviderChange}
        disabled={loading}
      >
        <option value="">All providers</option>
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.displayName}
          </option>
        ))}
      </select>

      <select
        className={styles.pill}
        value={preset}
        onChange={handlePresetChange}
        disabled={loading}
      >
        {(Object.entries(PRESET_LABELS) as [DatePreset, string][]).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      {preset === 'custom' && (
        <div className={styles.dateRange}>
          <input
            type="date"
            className={styles.datePill}
            value={filters.from ?? ''}
            onChange={handleFromChange}
            disabled={loading}
          />
          <span className={styles.dateSep}>→</span>
          <input
            type="date"
            className={styles.datePill}
            value={filters.to ?? ''}
            onChange={handleToChange}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}
