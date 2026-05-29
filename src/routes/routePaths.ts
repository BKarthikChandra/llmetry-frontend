export const ROUTES = {
  LOGIN: '/login',
  CHAT: '/chat',
  PROVIDERS: '/providers',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
