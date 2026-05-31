import api from '../api/axios';
import type {
  AnalyticsFilters,
  OverviewData,
  ThroughputBucket,
  LatencyBucket,
  ComparisonItem,
  ErrorsData,
} from '../types/analytics';
import { getLocalTimezone } from '../utils/dateTime';

type QueryParams = Record<string, string | number | undefined>;

function buildParams(filters: Partial<AnalyticsFilters>): QueryParams {
  const p: QueryParams = { timezone: getLocalTimezone() };
  if (filters.providerId !== undefined) p.providerId = filters.providerId;
  if (filters.providerModelId !== undefined) p.providerModelId = filters.providerModelId;
  if (filters.from) p.from = filters.from;
  if (filters.to) p.to = filters.to;
  if (filters.interval) p.interval = filters.interval;
  if (filters.comparisonType) p.comparisonType = filters.comparisonType;
  return p;
}

export function fetchOverview(filters: AnalyticsFilters, signal?: AbortSignal) {
  const { providerId, providerModelId, from, to } = filters;
  return api
    .get<OverviewData>('/analytics/overview', {
      params: buildParams({ providerId, providerModelId, from, to }),
      signal,
    })
    .then((r) => r.data);
}

export function fetchThroughput(filters: AnalyticsFilters, signal?: AbortSignal) {
  const { providerId, providerModelId, from, to, interval } = filters;
  return api
    .get<ThroughputBucket[]>('/analytics/throughput', {
      params: buildParams({ providerId, providerModelId, from, to, interval }),
      signal,
    })
    .then((r) => r.data);
}

export function fetchLatency(filters: AnalyticsFilters, signal?: AbortSignal) {
  const { providerId, providerModelId, from, to, interval } = filters;
  return api
    .get<LatencyBucket[]>('/analytics/latency', {
      params: buildParams({ providerId, providerModelId, from, to, interval }),
      signal,
    })
    .then((r) => r.data);
}

export function fetchComparison(filters: AnalyticsFilters, signal?: AbortSignal) {
  const { providerId, from, to, comparisonType } = filters;
  return api
    .get<ComparisonItem[]>('/analytics/comparison', {
      params: buildParams({ providerId, from, to, comparisonType }),
      signal,
    })
    .then((r) => r.data);
}

export function fetchErrors(filters: AnalyticsFilters, signal?: AbortSignal) {
  const { providerId, providerModelId, from, to } = filters;
  return api
    .get<ErrorsData>('/analytics/errors', {
      params: buildParams({ providerId, providerModelId, from, to }),
      signal,
    })
    .then((r) => r.data);
}
