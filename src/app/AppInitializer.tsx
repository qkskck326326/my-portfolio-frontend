// src/app/AppInitializer.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/authStore';

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const checkLogin = useAuthStore((state) => state.checkLogin);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    checkLogin();
    setInitialized(true); // 단순화된 처리
  }, []);

  if (!initialized) return null;

  return <>{children}</>;
};

export default AppInitializer;