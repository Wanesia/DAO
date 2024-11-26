import { LoginPayload, LoginResponse, RegisterUserPayload } from "@shared/types";
import axiosInstance from "./axiosInstance";

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
  return response.data;
};


export const registerUser = async (data: RegisterUserPayload): Promise<void> => {
  console.log("registerUser", data);
  await axiosInstance.post("/auth/register", data);
};
