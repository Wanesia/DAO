import axiosInstance from './axiosInstance';
import { Ensemble, EnsembleDto } from '@shared/types';

export const createEnsemble = async (formData: FormData): Promise<void> => {
  try {
    console.log("in request", formData);
    const response = await axiosInstance.post('/ensembles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  
    return response.data;
  } catch (error) {
    console.error('Failed to create ensemble:', error);
    throw new Error('Could not create ensemble. Please try again.');
  }
};

export const getEnsembles = async (): Promise<Ensemble[]> => {
  const response = await axiosInstance.get<Ensemble[]>('/ensembles');
  return response.data; 
};

export const updateEnsemble = async (id: string, ensembleDto: EnsembleDto): Promise<Ensemble> => {
  const response = await axiosInstance.patch<Ensemble>(`/ensembles/${id}`, ensembleDto);
  return response.data;
};

export const deleteEnsemble = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/ensembles/${id}`);
};