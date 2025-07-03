// src/features/user/api/userApi.ts
import { apiClient } from '@/lib/apiClient';
import type { UserProfile, SignupRequest, UserProfileEditRequest } from '../types/user.types';

// 회원가입 api
export const signup = async (data: SignupRequest): Promise<SignupRequest> => {
  const res = await apiClient.post('/api/users/signup/email/public', data);
  return res.data.data;
};

// 회원 자기정보 조회 api
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const res = await apiClient.get('/api/users/my/info');
  return res.data.data;
}

// slug로 회원정보 조회 api
export const fetchUserProfileBySlug = async (slug: string): Promise<UserProfile> => {
  console.log("slug로 회원정보 api 호출")
  const res = await apiClient.get(`/api/users/${slug}/info/public`);
  return res.data.data;
}



// 회원정보 수정 api
export const updateUserProfile = async (
  formData: UserProfileEditRequest
): Promise<UserProfile> => {
  const res = await apiClient.put('/api/users/me', formData);
  return res.data.data;
};

// 이메일 체크 api
export const checkEmail = async (email: string): Promise<boolean> => {
  const res = await apiClient.post('/api/users/check-email/public', { email });
  return res.data.data; // true면 중복
};

// 닉네임 체크 api
export const checkNickname = async (nickname: string): Promise<boolean> => {
  const res = await apiClient.post('/api/users/check-nickname/public', { nickname });
  return res.data.data;
};