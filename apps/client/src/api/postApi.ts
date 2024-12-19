import { InstrumentName } from "../constants/enums";
import axiosInstance from "./axiosInstance";
import { Post, PostWithEnsembleDTO } from "@shared/types";

export const getPosts = async (
  searchTerm: string = "",
  page: number = 1,
  limit: number = 6, // the number of results per page, default is 6
  filters: { instrumentName?: InstrumentName; location?: Location } = {} // we can add more filters here
): Promise<{ data: PostWithEnsembleDTO[]; total: number }> => {
  const response = await axiosInstance.get<{ data: PostWithEnsembleDTO[]; total: number }>(
    "/posts",
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

export const getPostsByUser = async (userId?: string): Promise<PostWithEnsembleDTO[]> => {
  try {
    const response = await axiosInstance.get<PostWithEnsembleDTO[]>("/posts/user", {
      params: userId ? { userId } : undefined,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
};

interface CreatePostResponse {
  success: boolean;
  post?: Post;
  error?: string;
}

export const createPost = async (post: any): Promise<CreatePostResponse> => {
  try {
    const response = await axiosInstance.post<CreatePostResponse>(
      "/posts",
      post
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      return {
        success: false,
        error: error.response.data.error,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getPostById = async (postId: string): Promise<PostWithEnsembleDTO> => {
  try {
    const response = await axiosInstance.get<PostWithEnsembleDTO>(`/posts/${postId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getPostsByEnsembleId = async (
  ensembleId: string
): Promise<PostWithEnsembleDTO[]> => {
  try {
    const response = await axiosInstance.get<PostWithEnsembleDTO[]>(
      `/posts/ensemble/${ensembleId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
};
