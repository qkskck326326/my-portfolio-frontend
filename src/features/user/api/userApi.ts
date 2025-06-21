// src/features/user/api/userApi.ts
import { apiClient } from '@/lib/apiClient';
import type { UserProfileResponse } from '../types/user.types';

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  const res = await apiClient.get('/api/users/me');
  return res.data.data;
};