export interface AnalyticsFilters {
  providerId?: number;
  providerModelId?: number;
  from?: string;
  to?: string;
  interval?: 'day' | 'hour';
  comparisonType?: 'provider' | 'model';
}

export interface OverviewData {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
}

export interface ThroughputBucket {
  bucket: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
}

export interface LatencyBucket {
  bucket: string;
  averageLatencyMs: number;
  totalRequests: number;
}

export interface ComparisonByProvider {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatencyMs: number;
  totalTokens: number;
}

export interface ComparisonByModel extends ComparisonByProvider {
  model: string;
}

export type ComparisonItem = ComparisonByProvider | ComparisonByModel;

export interface ErrorsByProvider {
  provider: string;
  count: number;
}

export interface RecentError {
  provider: string;
  model: string;
  errorMessage: string;
  createdOn: string;
}

export interface ErrorsData {
  totalErrors: number;
  errorsByProvider: ErrorsByProvider[];
  recentErrors: RecentError[];
}
