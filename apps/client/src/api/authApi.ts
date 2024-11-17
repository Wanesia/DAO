import { LoginResponse } from "@shared/types";
import axiosInstance from "./axiosInstance";

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string): Promise<void> => {
  await axiosInstance.post("/auth/register", { name, email, password });
};
