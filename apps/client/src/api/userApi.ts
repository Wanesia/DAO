import axios from "axios";
import axiosInstance from "./axiosInstance";
import { User } from "@shared/types";
import { UpdateSettingsDto } from "@shared/userProfile";
import { UserProfile } from "@shared/userProfile";

// don't know
export const getUserStatus = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("/auth/status");
  console.log(response.data);
  return response.data;
};

export const updateUserProfile = async (userEmail: string, formData: FormData): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.patch(`/users/${userEmail}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Profile update successful:", response.data);
    return response.data;
 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to update profile:", error.response?.data);
      throw new Error(error.response?.data?.message || "Could not update profile. Please try again.");
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const addInstrument = async (
  userEmail: string,
  instrumentData: { name: string; level: number; genres: string[] }
): Promise<void> => {
  try {
    const response = await axiosInstance.patch(
      `/users/instruments/${userEmail}`,
      instrumentData
    );
    console.log("Instrument added successfully:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to add instrument:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Could not add instrument. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
export const deleteInstrument = async (email: string, index: number): Promise<any> => {
  try {
    const response = await axiosInstance.patch(`/users/${email}/instruments/delete`, {
      index,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to delete instrument:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to delete instrument. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const getUserById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to fetch user:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const updateUserSettings = async (
  id: string,
  updateSettingsDto: UpdateSettingsDto
): Promise<void> => {
  console.log(`in updateUserSettings`)
  try {
    const response = await axiosInstance.patch(`/users/settings/${id}`, updateSettingsDto);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to update user settings:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to update user settings. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};