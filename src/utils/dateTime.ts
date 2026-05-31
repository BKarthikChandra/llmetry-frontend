const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_INPUT_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_WITH_TIMEZONE_RE = /(?:Z|[+-]\d{2}:?\d{2})$/i;

function parseDateInput(value: string): Date | null {
  if (!DATE_INPUT_RE.test(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function parseUtcValue(value: string): Date | null {
  const normalized = ISO_WITH_TIMEZONE_RE.test(value) ? value : `${value}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function nowUtcIso(): string {
  return new Date().toISOString();
}

export function getLocalDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addLocalDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function daysBetweenDateInputs(from: string, to: string): number | null {
  const fromDate = parseDateInput(from);
  const toDate = parseDateInput(to);
  if (!fromDate || !toDate) return null;
  return Math.round((toDate.getTime() - fromDate.getTime()) / DAY_MS);
}

export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

export function formatDateInputToLocal(
  value: string,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
): string {
  const date = parseDateInput(value);
  return date ? date.toLocaleDateString(undefined, options) : value;
}

export function sortUtcDesc(a: string, b: string): number {
  const aDate = parseUtcValue(a);
  const bDate = parseUtcValue(b);
  return (bDate?.getTime() ?? 0) - (aDate?.getTime() ?? 0);
}

export function formatUtcDateToLocal(
  value: string,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
): string {
  const date = parseUtcValue(value);
  return date ? date.toLocaleDateString(undefined, options) : value;
}

export function formatUtcDateTimeToLocal(value: string): string {
  const date = parseUtcValue(value);
  return date ? date.toLocaleString() : value;
}

export function formatUtcRelativeTime(value: string): string {
  const date = parseUtcValue(value);
  if (!date) return value;

  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  return `${Math.floor(hrs / 24)}d ago`;
}

export function formatUtcRelativeDate(value: string): string {
  const date = parseUtcValue(value);
  if (!date) return value;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - target.getTime()) / DAY_MS);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatUtcDateToLocal(value);
}
