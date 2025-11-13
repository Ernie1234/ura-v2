import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  loginMutationFn,
  registerMutationFn,
  logoutMutationFn,
} from "@/lib/api";
import { tokenStorage } from "@/lib/token-storage";
import type { loginType, registerType, LoginResponseType } from "@/types/api.types";

/**
 * Hook for user login
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginMutationFn,
    onSuccess: (data: LoginResponseType) => {
      // Store tokens from backend
      tokenStorage.setToken(data.data.accessToken);
      tokenStorage.setRefreshToken(data.data.refreshToken);

      // Invalidate and refetch auth user
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      toast.success(data.message || "Login successful!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerMutationFn,
    onSuccess: (response: any) => {
      const message = response.data?.message || "Registration successful! Please log in.";
      toast.success(message);
      navigate("/auth/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStorage.getRefreshToken();
      return logoutMutationFn(refreshToken || undefined);
    },
    onSuccess: () => {
      // Clear tokens
      tokenStorage.clearTokens();

      // Clear all queries
      queryClient.clear();

      toast.success("Logged out successfully");
      navigate("/auth/login");
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local tokens
      tokenStorage.clearTokens();
      queryClient.clear();

      const message = error.response?.data?.message || "Logout failed";
      toast.error(message);
      navigate("/auth/login");
    },
  });
};

/**
 * Export all auth mutation hooks
 */
export const useAuthMutations = () => {
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();

  return {
    login,
    register,
    logout,
  };
};
