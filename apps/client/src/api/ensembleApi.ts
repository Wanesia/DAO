import { Genre } from "@shared/enums";
import axiosInstance from "./axiosInstance";
import { Ensemble, EnsembleDto } from "@shared/types";
import axios from "axios";

export const createEnsemble = async (formData: FormData): Promise<void> => {
  try {
    const response = await axiosInstance.post("/ensembles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response;
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

export const getEnsembles = async (
  searchTerm: string = "",
  page: number = 1,
  limit: number = 6, // the number of results per page, default is 6
  filters: { genre?: Genre; location?: Location } = {} // we can add more filters here
): Promise<{ data: Ensemble[]; total: number }> => {
  const response = await axiosInstance.get<{ data: Ensemble[]; total: number }>(
    "/ensembles",
    {
      params: {
        searchTerm,
        page,
        limit,
        ...filters,
      },
    }
  );
  return response.data;
};

export const updateEnsemble = async (
  id: string,
  ensembleDto: EnsembleDto
): Promise<Ensemble> => {
  const response = await axiosInstance.patch<Ensemble>(
    `/ensembles/${id}`,
    ensembleDto
  );
  return response.data;
};

export const deleteEnsemble = async (id: string): Promise<void> => {
  try {
    console.log("in delete ensemble api");
    await axiosInstance.delete(`/ensembles/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to delete ensemble:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Failed to delete ensemble. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const getEnsemblesByIds = async (
  ensembleIds: string[]
): Promise<Ensemble[]> => {
  try {
    const ensemblePromises = ensembleIds.map(async (ensembleId) => {
      const response = await axiosInstance.get(`/ensembles/find/${ensembleId}`);
      return response.data;
    });

    const fetchedEnsembles = await Promise.all(ensemblePromises);
    return fetchedEnsembles;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to fetch ensembles:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch ensembles. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
export const getEnsembleById = async (
  ensembleId: string
): Promise<Ensemble> => {
  try {
    console.log("ensembleId", ensembleId);

    const response = await axiosInstance.get<Ensemble>(
      `/ensembles/find/${ensembleId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to fetch ensemble:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch ensemble. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const getEnsemblesByCreator = async (
  userId?: string
): Promise<Ensemble[]> => {
  try {
    const url = userId
      ? `/ensembles/creator?userId=${userId}`
      : `/ensembles/creator`;
    const response = await axiosInstance.get<Ensemble[]>(url);
    return response.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to fetch ensembles:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch ensembles. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const getEnsemblesByMember = async (
  slug: string
): Promise<Ensemble[]> => {
  try {
    const response = await axiosInstance.get<Ensemble[]>(
      `/ensembles/member/${slug}`
    );
    return response.data|| [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to fetch ensembles:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch ensembles. Please try again."
      );
    } else {
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
