// src/features/auth/types/index.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  nickname: string;
  slug: string;
}