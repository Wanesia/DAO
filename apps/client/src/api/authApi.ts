import {
  LoginPayload,
  LoginResponse,
  RegisterUserPayload,
} from "@shared/types";
import axiosInstance from "./axiosInstance";

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const registerUser = async (
  data: RegisterUserPayload
): Promise<void> => {
  try {
    await axiosInstance.post("/auth/register", data);
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw { field: "email", message: "E-mailen findes allerede" };
    }
    if (error.response?.status === 400) {
      const validationErrors = error.response?.data?.message || [];
      const fieldErrors: Record<string, string> = {};

      validationErrors.forEach((err: string) => {
        if (err.includes("Email")) {
          fieldErrors.email = err;
        }
        if (err.includes("Password")) {
          fieldErrors.password = err;
        }
      });

      throw fieldErrors; 
    }
    if (error.response?.status === 500) {
      throw { message: "Noget gik galt. Prøv venligst igen senere." };
    }
    if (!error.response) {
      throw {
        message:
          "Ingen forbindelse til serveren. Tjek din internetforbindelse.",
      };
    }

    throw { message: "En ukendt fejl opstod." };
  }
};
