// src/features/user/api/userApi.ts
import { apiClient } from '@/lib/apiClient';
import type { UserProfile } from '../types/user.types';

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const res = await apiClient.get('/api/users/me');
  return res.data.data;
};

export const updateUserProfile = async (
  formData: UserProfile
): Promise<UserProfile> => {
  const res = await apiClient.put('/api/users/me', formData);
  return res.data.data;
};