// src/features/auth/api/authApi.ts
import { apiClient } from '@/lib/apiClient';
import type { LoginRequest } from '../types';

export const loginApi = async (payload: LoginRequest): Promise<string> => {
  const response = await apiClient.post('/api/login/email', payload, {
    withCredentials: true, // Refresh 쿠키 받기 위해 필요
  });
  return response.data.data;
};

export const reissueApi = async (): Promise<string> => {
  const response = await apiClient.post('/api/auth/reissue', null, {
    withCredentials: true, // Refresh 쿠키 받기 위해 필요
  });
  return response.data.data;
};