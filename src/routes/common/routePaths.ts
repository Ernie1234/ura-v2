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
  BOOKMARK: '/dashboard/bookmark',
  USER_PROFILE: '/dashboard/profile/user/:userId',
  BUSINESS_PROFILE: '/dashboard/profile/business/:userId',
  CREATE_PRODUCT: 'dashboard/post/create',
  MENU: '/dashboard/menu',
  CHAT: '/dashboard/chats',
  PRODUCT_DETAIL: '/product/:productId',
};

export const BASE_ROUTE = {
  HOME: '/',
  ABOUT: '/about',
  INVITE_URL: '/invite/workspace/:inviteCode/join',
} as const;
