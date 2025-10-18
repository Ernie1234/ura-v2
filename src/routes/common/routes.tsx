import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from "./routePaths";

import Home from "@/pages/public/Home";
import GoogleOAuthFailure from "@/pages/auth/GoogleOAuthFailure";
import Dashboard from "@/pages/dashboard/Dashboard";
import About from "@/pages/public/About";
import ForgotPasswordPage from "@/pages/auth/ForgetPassword";
import LoginPage from "@/pages/auth/SignIn";
import RegisterPage from "@/pages/auth/SignUp";

// --- Auth Routes ---
export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <LoginPage /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <RegisterPage /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
{path:AUTH_ROUTES.FORGET_PASSWORD, element: <ForgotPasswordPage />}
];

// --- Protected Routes ---
export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.DASHBOARD, element: <Dashboard /> },
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
