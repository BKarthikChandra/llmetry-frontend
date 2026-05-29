import { type ReactNode } from 'react';
import styles from './AnalyticsCard.module.css';

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children?: ReactNode;
  className?: string;
}

export function AnalyticsCard({
  title,
  subtitle,
  loading,
  error,
  onRetry,
  children,
  className,
}: AnalyticsCardProps) {
  return (
    <div className={`${styles.card} ${className ?? ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>

      <div className={styles.body}>
        {loading && (
          <div className={styles.skeleton}>
            <div className={styles.skeletonBar} style={{ width: '60%' }} />
            <div className={styles.skeletonBar} style={{ width: '80%' }} />
            <div className={styles.skeletonBar} style={{ width: '40%' }} />
          </div>
        )}

        {!loading && error && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>!</span>
            <p className={styles.errorMessage}>{error}</p>
            {onRetry && (
              <button className={styles.retryBtn} onClick={onRetry}>
                Retry
              </button>
            )}
          </div>
        )}

        {!loading && !error && children}
      </div>
    </div>
  );
}
