// src/features/auth/hooks/useLogin.ts
import { useState } from 'react';
import { loginApi } from '../api/authApi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { LoginRequest } from '../types';

export const useLogin = () => {
  const navigate = useNavigate();  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: setLoginState } = useAuthStore();

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await loginApi(credentials);
      setLoginState(token); // 로그인 상태 업데이트

      // 로그인 성공 후 홈으로 이동
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(message ?? '로그인 실패');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('로그인 실패');
      }
    }finally {
        setIsLoading(false);
      }
    };

  return { login, isLoading, error };
};