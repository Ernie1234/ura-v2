export const AUTH_ROUTES = {
  SIGN_IN: '/auth/login',
  SIGN_UP: '/auth/register',
  GOOGLE_OAUTH_CALLBACK: '/google/oauth/callback',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGET_PASSWORD: '/auth/forget-password',
};

export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  SETTINGS: '/dashboard/settings',
  PROFILE: 'dashboard/profile/:userId',
};

export const BASE_ROUTE = {
  HOME: '/',
  ABOUT: '/about',
  INVITE_URL: '/invite/workspace/:inviteCode/join',
} as const;
