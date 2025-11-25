import type { CurrentUserResponseType, LoginResponseType, loginType, RegisterResponseType, registerType } from "@/types/api.types";
import API from "./axios-client";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (
data: registerType
): Promise<RegisterResponseType> => {
 const response = await API.post("/auth/register", data);
 return response.data;
};

export const verifyEmailMutationFn = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => await API.post("/auth/verify-email", { email, token });

export const logoutMutationFn = async (refreshToken?: string) => 
  await API.post("/auth/logout", refreshToken ? { refreshToken } : {});

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/user/current`);
    return response.data;
  };

export const updateProfileMutationFn = async (
  data: Partial<{ firstName: string; lastName: string; profilePicture: string; businessName: string }>
) => {
  const response = await API.patch(`/user/profile`, data);
  return response.data;
};
