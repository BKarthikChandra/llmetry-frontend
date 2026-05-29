import axios from 'axios';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(', ') : String(data.message);
    }
    if (error.response?.status === 401) return 'Invalid email or password.';
    if (error.response?.status === 409) return 'An account with this email already exists.';
  }
  return fallback;
}
