// src/app/AppInitializer.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const checkLogin = useAuthStore((state) => state.checkLogin);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkLogin(); // 로그인 확인이 완료될 때까지 대기
      setInitialized(true);
    };

    init();
  }, []);
  
  if (!initialized) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default AppInitializer;