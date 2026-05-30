import type { OverviewData } from '../../../types/analytics';
import styles from './OverviewCards.module.css';

interface OverviewCardsProps {
  data: OverviewData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function fmtK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function OverviewCards({ data, loading, error, onRetry }: OverviewCardsProps) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.skeletonLabel} />
            <div className={styles.skeletonValue} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorRow}>
        <span className={styles.errorText}>{error}</span>
        <button className={styles.retryBtn} onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const errorRate =
    data.totalRequests > 0
      ? ((data.failedRequests / data.totalRequests) * 100).toFixed(1)
      : '0.0';

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.label}>Total requests</span>
        <span className={styles.value}>{data.totalRequests.toLocaleString()}</span>
      </div>

      <div className={styles.card}>
        <span className={styles.label}>Avg latency</span>
        <span className={styles.value}>
          {data.averageLatencyMs.toFixed(0)}
          <span className={styles.suffix}>ms</span>
        </span>
      </div>

      <div className={styles.card}>
        <span className={styles.label}>Error rate</span>
        <span className={`${styles.value} ${Number(errorRate) > 0 ? styles.valueError : ''}`}>
          {errorRate}
          <span className={styles.suffix}>%</span>
        </span>
      </div>

      <div className={styles.card}>
        <span className={styles.label}>Total tokens</span>
        <span className={styles.value}>{fmtK(data.totalTokens)}</span>
        <div className={styles.tokenBreakdown}>
          <span className={styles.tokenRow}>
            <span className={styles.tokenLabel}>Input tokens</span>
            <span className={styles.tokenValue}>{fmtK(data.totalInputTokens)}</span>
          </span>
          <span className={styles.tokenRow}>
            <span className={styles.tokenLabel}>Output tokens</span>
            <span className={styles.tokenValue}>{fmtK(data.totalOutputTokens)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
