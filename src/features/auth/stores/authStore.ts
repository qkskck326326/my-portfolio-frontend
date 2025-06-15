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
  },

  checkLogin: () => {
    const hasToken = !!getAccessToken();
    set({ isLoggedIn: hasToken });
  },
}));