import axiosInstance from "./axiosInstance";
import { User } from "@shared/types";

// don't know
export const getUserStatus = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("/auth/status");
  console.log(response.data);
  return response.data;
};
