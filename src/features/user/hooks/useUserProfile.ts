// src/features/user/hooks/useUserProfile.ts
import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../api/userApi';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
  });
};
