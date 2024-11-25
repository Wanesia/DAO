import { Genre } from '@shared/enums';
import axiosInstance from './axiosInstance';
import { Ensemble, EnsembleDto } from '@shared/types';

export const createEnsemble = async (formData: FormData): Promise<void> => {
  try {
    const response = await axiosInstance.post('/ensembles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response;
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

export const getEnsembles = async (
  searchTerm: string = '',
  page: number = 1,
  limit: number = 6, // the number of results per page, default is 6
  filters: { genre?: Genre } = {}, // we can add more filters here
): Promise<{ data: Ensemble[]; total: number }> => {
  const response = await axiosInstance.get<{ data: Ensemble[]; total: number }>(
    '/ensembles',
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


export const updateEnsemble = async (id: string, ensembleDto: EnsembleDto): Promise<Ensemble> => {
  const response = await axiosInstance.patch<Ensemble>(`/ensembles/${id}`, ensembleDto);
  return response.data;
};

export const deleteEnsemble = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/ensembles/${id}`);
};
