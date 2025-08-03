// src/features/user/hooks/useUserProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfileBySlug, updateUserProfile } from '../api/userApi';
import { UserProfile } from '../types/user.types'

interface Props {
  slug: string;
}

export const useUserProfile = ({slug} : Props) => {
  const queryClient = useQueryClient();

  const query = useQuery<UserProfile>({
    queryKey: ['userProfile', slug],
    queryFn: () => fetchUserProfileBySlug(slug),
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] }); // 수정 후 캐시 무효화
    },
  });

  return {
    ...query,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};