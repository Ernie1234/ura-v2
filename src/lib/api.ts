import type { CurrentUserResponseType, LoginResponseType, loginType, registerType } from "@/types/api.types";
import API from "./axios-client";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (data: registerType) =>
  await API.post("/auth/register", data);

export const verifyEmailMutationFn = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => await API.post("/auth/verify-email", { email, token });

export const logoutMutationFn = async () => await API.post("/auth/logout");

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/user/current`);
    return response.data;
  };