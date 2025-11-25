import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginMutationFn, registerMutationFn, logoutMutationFn } from "@/lib/api";
import { tokenStorage } from "@/lib/token-storage";
import type { LoginResponseType, RegisterResponseType } from "@/types/api.types";
import type { AxiosError } from "axios";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginMutationFn,
    onSuccess: (data: LoginResponseType) => {
      tokenStorage.setToken(data.data.accessToken);
      tokenStorage.setRefreshToken(data.data.refreshToken);

      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      toast.success(data.message || "Login successful!");
      navigate("/dashboard");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
  const message = error.response?.data?.message || "Something went wrong";
  toast.error(message);
}
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerMutationFn,
    onSuccess: (response: RegisterResponseType) => {
      const message =
        response?.message ||
        "Registration successful! Please log in.";
      toast.success(message);
      navigate("/auth/login");
    },
   onError: (error: AxiosError<{ message?: string }>) => {
       const message = error.response?.data?.message || "Something went wrong";
       toast.error(message);
   }
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStorage.getRefreshToken();
      return logoutMutationFn(refreshToken || undefined);
    },
    onSuccess: () => {
      tokenStorage.clearTokens();
      queryClient.clear();

      toast.success("Logged out successfully");
      navigate("/auth/login");
    },
    onError: (error: AxiosError<{message?: string}>) => {
      tokenStorage.clearTokens();
      queryClient.clear();

      const message =
        error.response?.data?.message ||
        "Logout failed";
      toast.error(message);

      navigate("/auth/login");
    },
  });
};
