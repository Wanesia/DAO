import axios from "axios";
import axiosInstance from "./axiosInstance";
import { Instrument, User } from "@shared/types";
import { UpdateSettingsDto } from "@shared/userProfile";
import { UserProfile } from "@shared/userProfile";

export const getUserStatus = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("/auth/status");
  return response.data;
};

export const updateUserProfile = async (userEmail: string, formData: FormData): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.patch(`/users/${userEmail}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    return await axiosInstance.patch(
      `/users/instruments/${userEmail}`,
      instrumentData
    );
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

export const deleteUser = async (id: string): Promise<void> => {
  try{
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to delete user", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to delete user. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const getUsers = async (
  searchTerm: string = '',
  page: number = 1,
  limit: number = 6, // the number of results per page, default is 6
  filters: { instrument?: Instrument, location?: Location} = {}, // we can add more filters here
): Promise<{ data: UserProfile[]; total: number }> => {
  const response = await axiosInstance.get<{ data: UserProfile[]; total: number }>(
    '/users',
    {
      params: {
        searchTerm,
        page,
        limit,
        ...filters,
      },
    },
  );
  return response.data;
};

export const getUserBySlug = async (slug: string): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get<UserProfile>(`/users/profile/${slug}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("User not found");
      }
      console.error("Failed to fetch user profile:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user profile. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};