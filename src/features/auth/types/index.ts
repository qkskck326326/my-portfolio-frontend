// src/features/auth/types/index.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  userThumbnail: string;
  nickname: string;
  slug: string;
}