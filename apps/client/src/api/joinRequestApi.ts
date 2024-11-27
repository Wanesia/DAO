import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function sendJoinRequest(ensembleId: string, userId: string) {
  try {
    const response = await axiosInstance.post(`/ensembles/join/${ensembleId}`, {
      userId,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to send join request:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Failed to send join request. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}

export async function cancelJoinRequest(ensembleId: string, userId: string) {
  try {
    const response = await axiosInstance.delete(
      `/ensembles/join/${ensembleId}/${userId}`,
      {}
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to cancel join request:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Failed to cancel join request. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}

export const checkJoinRequestStatus = async (ensembleId: string) => {
  try {
    const response = await axiosInstance.get(`/ensembles/join/${ensembleId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error checking join request status:",
        error.response?.data
      );
      throw new Error(
        error.response?.data?.message ||
          "Failed to check join request status. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
export const fetchUserId = async (): Promise<string> => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Access token not found");
      }
  
      const response = await axiosInstance.get("/auth/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.userId;
    } catch (error) {
      console.error("Failed to fetch user ID:", error);
      throw new Error("Could not fetch user ID. Please try again.");
    }
  };
