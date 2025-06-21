// src/app/AppInitializer.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const checkLogin = useAuthStore((state) => state.checkLogin);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    checkLogin();
    setInitialized(true); // 처리 단순화
  }, []);

  if (!initialized) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default AppInitializer;