import api from '../api/axios';
import type {
  AnalyticsFilters,
  OverviewData,
  ThroughputBucket,
  LatencyBucket,
  ComparisonItem,
  ErrorsData,
} from '../types/analytics';

type QueryParams = Record<string, string | number | undefined>;

function buildParams(filters: Partial<AnalyticsFilters>): QueryParams {
  const p: QueryParams = {};
  if (filters.providerId !== undefined) p.providerId = filters.providerId;
  if (filters.providerModelId !== undefined) p.providerModelId = filters.providerModelId;
  if (filters.from) p.from = filters.from;
  if (filters.to) p.to = filters.to;
  if (filters.interval) p.interval = filters.interval;
  if (filters.comparisonType) p.comparisonType = filters.comparisonType;
  return p;
}

export function fetchOverview(filters: AnalyticsFilters, signal?: AbortSignal) {
  const { interval: _interval, comparisonType: _ct, ...rest } = filters;
  return api
    .get<OverviewData>('/analytics/overview', { params: buildParams(rest), signal })
    .then((r) => r.data);
}

export function fetchThroughput(filters: AnalyticsFilters, signal?: AbortSignal) {
  const { comparisonType: _ct, ...rest } = filters;
  return api
    .get<ThroughputBucket[]>('/analytics/throughput', { params: buildParams(rest), signal })
    .then((r) => r.data);
}

export function fetchLatency(filters: AnalyticsFilters, signal?: AbortSignal) {
  const { comparisonType: _ct, ...rest } = filters;
  return api
    .get<LatencyBucket[]>('/analytics/latency', { params: buildParams(rest), signal })
    .then((r) => r.data);
}

export function fetchComparison(filters: AnalyticsFilters, signal?: AbortSignal) {
  const { providerModelId: _pmid, interval: _i, ...rest } = filters;
  return api
    .get<ComparisonItem[]>('/analytics/comparison', { params: buildParams(rest), signal })
    .then((r) => r.data);
}

export function fetchErrors(filters: AnalyticsFilters, signal?: AbortSignal) {
  const { interval: _i, comparisonType: _ct, ...rest } = filters;
  return api
    .get<ErrorsData>('/analytics/errors', { params: buildParams(rest), signal })
    .then((r) => r.data);
}
