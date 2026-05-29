import type { ComparisonItem } from '../../../types/analytics';
import { AnalyticsCard } from './AnalyticsCard';
import styles from './ComparisonChart.module.css';

interface ComparisonChartProps {
  data: ComparisonItem[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  comparisonType: 'provider' | 'model';
}

const BAR_COLORS = ['#4ade80', '#818cf8', '#f59e0b', '#06b6d4', '#ec4899', '#a78bfa', '#f87171'];

function fmtK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function getLabel(item: ComparisonItem): string {
  if ('model' in item && item.model) return `${item.provider} / ${item.model}`;
  return item.provider;
}

export function ComparisonChart({
  data,
  loading,
  error,
  onRetry,
  comparisonType,
}: ComparisonChartProps) {
  const title = comparisonType === 'model' ? 'Model comparison' : 'Provider comparison';
  const isEmpty = !loading && !error && (!data || data.length === 0);
  const maxReqs = (data ?? []).reduce((m, d) => Math.max(m, d.totalRequests), 1);

  return (
    <AnalyticsCard
      title={title}
      loading={loading}
      error={error}
      onRetry={onRetry}
      className={styles.card}
    >
      {isEmpty ? (
        <div className={styles.empty}>No data for selected filters</div>
      ) : (
        <div className={styles.list}>
          {(data ?? []).map((item, idx) => {
            const widthPct = (item.totalRequests / maxReqs) * 100;
            const color = BAR_COLORS[idx % BAR_COLORS.length];
            return (
              <div key={getLabel(item)} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.name}>{getLabel(item)}</span>
                  <span className={styles.stats}>
                    {item.averageLatencyMs.toFixed(0)}ms · {fmtK(item.totalRequests)} req
                  </span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${widthPct}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AnalyticsCard>
  );
}
