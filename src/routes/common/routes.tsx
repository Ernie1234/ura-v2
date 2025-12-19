import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from './routePaths';

import Home from '@/pages/public/Home';
import GoogleOAuthFailure from '@/pages/auth/GoogleOAuthFailure';
import Dashboard from '@/pages/dashboard/Dashboard';
import SettingsPage from '@/pages/dashboard/Settings';
import About from '@/pages/public/About';
import ForgotPasswordPage from '@/pages/auth/ForgetPassword';
import LoginPage from '@/pages/auth/SignIn';
import RegisterPage from '@/pages/auth/SignUp';
import ProductDetails from '@/pages/ProductDetails';
import CreateProduct from '@/pages/dashboard/CreateProduct';
import Bookmark from '@/pages/dashboard/Bookmark';
import { Edit } from 'lucide-react';
import MenuPage from '@/pages/dashboard/MenuPage';
import { ChatsPage } from '@/pages/dashboard/ChatPage';
import ProfilePage from '@/pages/dashboard/Profile';

// --- Auth Routes ---
export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <LoginPage /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <RegisterPage /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
  { path: AUTH_ROUTES.FORGET_PASSWORD, element: <ForgotPasswordPage /> },
];

// --- Protected Routes ---
export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <SettingsPage /> },
  { path: PROTECTED_ROUTES.USER_PROFILE, element: <ProfilePage /> },
  { path: PROTECTED_ROUTES.BUSINESS_PROFILE, element: <ProfilePage /> },
  { path: PROTECTED_ROUTES.MENU, element: <MenuPage /> },
  { path: PROTECTED_ROUTES.CHAT, element: <ChatsPage /> },
  { path: PROTECTED_ROUTES.PRODUCT_DETAIL, element: <ProductDetails /> },
  { path: PROTECTED_ROUTES.BOOKMARK, element: <Bookmark /> },
  { path: PROTECTED_ROUTES.CREATE_PRODUCT, element: <CreateProduct /> },
];

// --- Public/Base Routes ---
export const baseRoutePaths = [
  { path: BASE_ROUTE.HOME, element: <Home /> },
  { path: BASE_ROUTE.ABOUT, element: <About /> },
];

// --- Utility ---
export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};
