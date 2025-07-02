// src/features/auth/api/authApi.ts
import axios from 'axios';
import { apiClient } from '@/lib/apiClient';
import type { LoginRequest, UserInfo } from '../types';

export const loginApi = async (payload: LoginRequest): Promise<string> => {
  const response = await apiClient.post('/api/auth/login/email', payload, {
    withCredentials: true, // Refresh 쿠키 받기 위해 필요
  });
  return response.data.data;
};

export const getMyInfoApi = async (): Promise<UserInfo> => {
  const response = await apiClient.get('/api/users/me');
  return response.data.data;
};

export const reissueApi = async (): Promise<string> => {
  try {
    const response = await apiClient.post('/api/auth/reissue', null, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || '토큰 재발급에 실패했습니다';
      console.error('토큰 재발급 실패:', message);
    } else {
      console.error('알 수 없는 에러 발생:', error);
    }
    throw error;
  }
};

export const logoutApi = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout', null, {
    withCredentials: true, // Refresh 쿠키 받기 위해 필요
  });
};