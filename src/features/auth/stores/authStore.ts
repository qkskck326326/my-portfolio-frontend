// src/features/auth/stores/authStore.ts
import { create } from 'zustand';
import { saveAccessToken, getAccessToken, clearToken } from '../utils/token';
import type { UserInfo } from '../types';
import { getMyInfoApi } from '../api/authApi';

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  checkLogin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,

  login: async (token: string) => {
  saveAccessToken(token);
  const user = await getMyInfoApi(); // 썸네일, slug, nickname 정보 가져오기
  set({ isLoggedIn: true, user });
  },

  logout: () => {
    clearToken();
    set({ isLoggedIn: false });
  },

  checkLogin: async () => {
  const token = getAccessToken();
  if (!token) {
    set({ isLoggedIn: false, user: null });
    return;
  }

  try {
    const user = await getMyInfoApi();
    set({ isLoggedIn: true, user });
  } catch {
    clearToken();
    set({ isLoggedIn: false, user: null });
  }
}
  
}));