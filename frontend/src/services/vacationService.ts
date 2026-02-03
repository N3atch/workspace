import api from './api';
import { Vacation } from '../store/slices/vacationSlice';

export const vacationService = {
  getAll: async (): Promise<Vacation[]> => {
    const response = await api.get('/vacations');
    return response.data;
  },

  getById: async (id: number): Promise<Vacation> => {
    const response = await api.get(`/vacations/${id}`);
    return response.data;
  },

  create: async (vacation: Partial<Vacation>): Promise<Vacation> => {
    const response = await api.post('/vacations', vacation);
    return response.data;
  },

  update: async (id: number, vacation: Partial<Vacation>): Promise<Vacation> => {
    const response = await api.put(`/vacations/${id}`, vacation);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/vacations/${id}`);
  },

  follow: async (vacationId: number): Promise<void> => {
    await api.post(`/follows/${vacationId}`);
  },

  unfollow: async (vacationId: number): Promise<void> => {
    await api.delete(`/follows/${vacationId}`);
  },

  getReports: async (): Promise<Array<{ id: number; vacation_name: string; followers_count: number }>> => {
    const response = await api.get('/vacations/reports/followers');
    return response.data;
  },

  uploadImage: async (file: File): Promise<{ filename: string; path: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

