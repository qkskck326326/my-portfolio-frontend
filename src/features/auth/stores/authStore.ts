// src/features/auth/stores/authStore.ts
import { create } from 'zustand';
import { saveAccessToken, getAccessToken, clearToken } from '../utils/token';

interface AuthState {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkLogin: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,

  login: (token: string) => {
    saveAccessToken(token);
    set({ isLoggedIn: true });
  },

  logout: () => {
    clearToken();
    set({ isLoggedIn: false });
    alert('로그아웃 되었습니다.');
  },

  checkLogin: () => {
    const hasToken = !!getAccessToken();
    set({ isLoggedIn: hasToken });
  },
}));