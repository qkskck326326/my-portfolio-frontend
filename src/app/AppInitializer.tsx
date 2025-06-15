// src/app/AppInitializer.tsx
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/stores/authStore';

const AppInitializer = () => {
  const checkLogin = useAuthStore((state) => state.checkLogin);

  useEffect(() => {
    checkLogin(); // localStorage에 토큰 있으면 isLoggedIn true로 설정
  }, []);

  return null; // 렌더링 안 함
};

export default AppInitializer;