import type { ErrorsData } from '../../../types/analytics';
import { formatUtcDateTimeToLocal, formatUtcRelativeTime } from '../../../utils/dateTime';
import { AnalyticsCard } from './AnalyticsCard';
import styles from './ErrorsSection.module.css';

interface ErrorsSectionProps {
  data: ErrorsData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

interface BadgeInfo {
  label: string;
  bg: string;
  color: string;
}

function getErrorBadge(errorMessage: string): BadgeInfo {
  const msg = errorMessage.toLowerCase();
  const codeMatch = msg.match(/\b([45]\d{2})\b/);
  if (codeMatch) {
    return {
      label: codeMatch[1],
      bg: 'rgba(239,68,68,0.18)',
      color: codeMatch[1].startsWith('5') ? '#ef4444' : '#f97316',
    };
  }
  if (msg.includes('quota') || msg.includes('rate limit') || msg.includes('ratelimit')) {
    return { label: 'quota', bg: 'rgba(245,158,11,0.18)', color: '#f59e0b' };
  }
  if (msg.includes('timeout') || msg.includes('timed out')) {
    return { label: 'timeout', bg: 'rgba(249,115,22,0.18)', color: '#f97316' };
  }
  if (msg.includes('auth') || msg.includes('unauthorized') || msg.includes('forbidden')) {
    return { label: 'auth', bg: 'rgba(139,92,246,0.18)', color: '#8b5cf6' };
  }
  return { label: 'error', bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' };
}

export function ErrorsSection({ data, loading, error, onRetry }: ErrorsSectionProps) {
  return (
    <AnalyticsCard
      title="Recent errors"
      subtitle={data && data.totalErrors > 0 ? `${data.totalErrors} total` : undefined}
      loading={loading}
      error={error}
      onRetry={onRetry}
      className={styles.card}
    >
      {!loading && !error && (!data || data.recentErrors.length === 0) ? (
        <div className={styles.empty}>
          <span className={styles.emptyCheck}>✓</span>
          <span className={styles.emptyTitle}>No errors detected</span>
          <span className={styles.emptySub}>System operating normally</span>
        </div>
      ) : !loading && !error && data ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <colgroup>
              <col className={styles.colSource} />
              <col className={styles.colError} />
              <col className={styles.colTime} />
            </colgroup>
            <thead>
              <tr>
                <th className={styles.th}>Source</th>
                <th className={styles.th}>Error</th>
                <th className={`${styles.th} ${styles.thRight}`}>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.recentErrors.map((row, idx) => {
                const badge = getErrorBadge(row.errorMessage);
                return (
                  <tr key={idx} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.sourceCell}>
                        <span className={styles.providerName}>{row.provider}</span>
                        <span className={styles.modelName} title={row.model}>{row.model}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.errorCell}>
                        <span
                          className={styles.badge}
                          style={{ background: badge.bg, color: badge.color }}
                        >
                          {badge.label}
                        </span>
                        <span className={styles.errorMsg} title={row.errorMessage}>
                          {row.errorMessage}
                        </span>
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdRight}`}>
                      <span
                        className={styles.time}
                        title={formatUtcDateTimeToLocal(row.createdOn)}
                      >
                        {formatUtcRelativeTime(row.createdOn)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </AnalyticsCard>
  );
}
