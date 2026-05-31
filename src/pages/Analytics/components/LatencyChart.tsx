import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { LatencyBucket } from '../../../types/analytics';
import { formatDateInputToLocal, formatUtcDateToLocal } from '../../../utils/dateTime';
import { AnalyticsCard } from './AnalyticsCard';
import styles from './LatencyChart.module.css';

interface LatencyChartProps {
  data: LatencyBucket[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function formatBucket(bucket: unknown) {
  const s = String(bucket ?? '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return formatDateInputToLocal(s);
  return formatUtcDateToLocal(s);
}

export function LatencyChart({ data, loading, error, onRetry }: LatencyChartProps) {
  const isEmpty = !loading && !error && (!data || data.length === 0);

  return (
    <AnalyticsCard
      title="Latency trend"
      subtitle="avg ms / day"
      loading={loading}
      error={error}
      onRetry={onRetry}
      className={styles.card}
    >
      {isEmpty ? (
        <div className={styles.empty}>No data for selected filters</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data ?? []} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="bucket"
              tickFormatter={formatBucket}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
              }}
              labelFormatter={formatBucket}
            />
            <Line
              type="monotone"
              dataKey="averageLatencyMs"
              name="Avg ms"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#14b8a6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </AnalyticsCard>
  );
}
