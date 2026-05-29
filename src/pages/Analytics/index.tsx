import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AnalyticsFilters,
  ComparisonItem,
  ErrorsData,
  LatencyBucket,
  OverviewData,
  ThroughputBucket,
} from '../../types/analytics';
import {
  fetchComparison,
  fetchErrors,
  fetchLatency,
  fetchOverview,
  fetchThroughput,
} from '../../services/analyticsService';
import { FilterBar } from './components/FilterBar';
import { OverviewCards } from './components/OverviewCards';
import { ThroughputChart } from './components/ThroughputChart';
import { LatencyChart } from './components/LatencyChart';
import { ComparisonChart } from './components/ComparisonChart';
import { ErrorsSection } from './components/ErrorsSection';
import styles from './Analytics.module.css';

const STORAGE_KEY = 'llmetry_analytics_filters';

function getDefaultFilters(): AnalyticsFilters {
  const now = new Date();
  const to = now.toISOString().split('T')[0];
  const from = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];
  return { interval: 'day', comparisonType: 'provider', from, to };
}

function loadFilters(): AnalyticsFilters {
  const defaults = getDefaultFilters();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...(JSON.parse(raw) as AnalyticsFilters) };
  } catch {
    return defaults;
  }
}

function saveFilters(f: AnalyticsFilters) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
  } catch { /* ignore */ }
}

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function idle<T>(): AsyncState<T> {
  return { data: null, loading: true, error: null };
}

export function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>(loadFilters);
  const [globalLoading, setGlobalLoading] = useState(false);

  const [overview, setOverview] = useState<AsyncState<OverviewData>>(idle);
  const [throughput, setThroughput] = useState<AsyncState<ThroughputBucket[]>>(idle);
  const [latency, setLatency] = useState<AsyncState<LatencyBucket[]>>(idle);
  const [comparison, setComparison] = useState<AsyncState<ComparisonItem[]>>(idle);
  const [errors, setErrors] = useState<AsyncState<ErrorsData>>(idle);

  const abortRef = useRef<AbortController | null>(null);

  const runFetch = useCallback((currentFilters: AnalyticsFilters) => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const sig = ctrl.signal;

    setGlobalLoading(true);
    setOverview(idle());
    setThroughput(idle());
    setLatency(idle());
    setComparison(idle());
    setErrors(idle());

    const settle = <T,>(
      promise: Promise<T>,
      setter: React.Dispatch<React.SetStateAction<AsyncState<T>>>,
    ) =>
      promise
        .then((data) => {
          if (!sig.aborted) setter({ data, loading: false, error: null });
        })
        .catch((err: unknown) => {
          if (sig.aborted) return;
          setter({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load',
          });
        });

    Promise.allSettled([
      settle(fetchOverview(currentFilters, sig), setOverview),
      settle(fetchThroughput(currentFilters, sig), setThroughput),
      settle(fetchLatency(currentFilters, sig), setLatency),
      settle(fetchComparison(currentFilters, sig), setComparison),
      settle(fetchErrors(currentFilters, sig), setErrors),
    ]).finally(() => {
      if (!sig.aborted) setGlobalLoading(false);
    });
  }, []);

  useEffect(() => {
    runFetch(filters);
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltersChange = (updated: AnalyticsFilters) => {
    setFilters(updated);
    saveFilters(updated);
    runFetch(updated);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <FilterBar filters={filters} onChange={handleFiltersChange} loading={globalLoading} />
      </div>

      <OverviewCards
        data={overview.data}
        loading={overview.loading}
        error={overview.error}
        onRetry={() => runFetch(filters)}
      />

      <div className={styles.chartsRow}>
        <ThroughputChart
          data={throughput.data}
          loading={throughput.loading}
          error={throughput.error}
          onRetry={() => runFetch(filters)}
        />
        <LatencyChart
          data={latency.data}
          loading={latency.loading}
          error={latency.error}
          onRetry={() => runFetch(filters)}
        />
      </div>

      <div className={styles.bottomRow}>
        <ErrorsSection
          data={errors.data}
          loading={errors.loading}
          error={errors.error}
          onRetry={() => runFetch(filters)}
        />
        <ComparisonChart
          data={comparison.data}
          loading={comparison.loading}
          error={comparison.error}
          onRetry={() => runFetch(filters)}
          comparisonType={filters.comparisonType ?? 'provider'}
        />
      </div>
    </div>
  );
}
