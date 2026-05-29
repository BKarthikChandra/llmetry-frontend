import axios from 'axios';

function extractMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  const data = error.response?.data;
  if (data?.message) {
    return Array.isArray(data.message) ? data.message.join(', ') : String(data.message);
  }
  return null;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  return extractMessage(error) ?? fallback;
}

export function getAuthErrorMessage(error: unknown): string {
  const msg = extractMessage(error);
  if (msg) return msg;
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return 'Invalid email or password.';
    if (error.response?.status === 409) return 'An account with this email already exists.';
  }
  return 'Something went wrong. Please try again.';
}
