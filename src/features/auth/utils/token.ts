// src/features/auth/utils/token.ts

const ACCESS_TOKEN_KEY = 'accessToken';

export const saveAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};