import axios from "axios";
import axiosInstance from "./axiosInstance";
import { User } from "@shared/types";
import { FieldValues } from "react-hook-form";

// don't know
export const getUserStatus = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("/auth/status");
  console.log(response.data);
  return response.data;
};

export const updateUserProfile = async (userEmail: string, data: FieldValues): Promise<void> => {
  try {
    const updateData = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      location: {
        postCode: data.postcode,
        city: data.city,
      },
      profileText: data.profileText,
      isSeeking: data.isSeeking,
      profilePicture: data.profilePicture,
    };

    console.log("Updating profile with data:", updateData);

    const response = await axiosInstance.patch(`/users/${userEmail}`, updateData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });

    console.log("Profile update successful:", response.data);
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

