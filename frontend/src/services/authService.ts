import api from './api';

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (userData: {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

