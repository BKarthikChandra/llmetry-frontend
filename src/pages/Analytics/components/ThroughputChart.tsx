import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ThroughputBucket } from '../../../types/analytics';
import { formatDateInputToLocal, formatUtcDateToLocal } from '../../../utils/dateTime';
import { AnalyticsCard } from './AnalyticsCard';
import styles from './ThroughputChart.module.css';

interface ThroughputChartProps {
  data: ThroughputBucket[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function formatBucket(bucket: unknown) {
  const s = String(bucket ?? '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return formatDateInputToLocal(s);
  return formatUtcDateToLocal(s);
}

export function ThroughputChart({ data, loading, error, onRetry }: ThroughputChartProps) {
  const isEmpty = !loading && !error && (!data || data.length === 0);

  return (
    <AnalyticsCard
      title="Throughput"
      subtitle="requests / day"
      loading={loading}
      error={error}
      onRetry={onRetry}
      className={styles.card}
    >
      {isEmpty ? (
        <div className={styles.empty}>No data for selected filters</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data ?? []} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="gradThroughput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="totalRequests"
              name="Requests"
              stroke="#14b8a6"
              fill="url(#gradThroughput)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#14b8a6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </AnalyticsCard>
  );
}
