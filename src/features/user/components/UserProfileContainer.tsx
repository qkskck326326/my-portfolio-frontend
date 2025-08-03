// src/features/user/components/UserProfileContainer.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileViewer from './UserProfileViewer';
import UserProfileEditor from './UserProfileEditor';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';
import PortfolioInfiniteSearchResult from '@/features/portfolio/components/PortfolioSearchResult';
import UserTagList from '@/features/user/components/UserTagList';
import axios from 'axios';

interface Props {
  slug: string;
}

const UserProfileContainer = ({ slug }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, error } = useUserProfile({ slug });
  const navigate = useNavigate();
  const { reset: resetPortfolioStore } = usePortfolioStore();

  console.log("data : ", data);

  useEffect(() => {
    if (axios.isAxiosError(error)) {
      console.warn('사용자 정보를 불러오지 못했습니다.', error.response?.status);
      if (error.response?.status === 403 || error.response?.status === 404) {
        navigate('/error', { replace: true });
      }
    }
  }, [error, navigate]);

  useEffect(() => {
    resetPortfolioStore(); // 이 페이지 진입 시 검색 상태 초기화
  }, [slug, resetPortfolioStore]);

  if (isLoading) return <div className="text-center py-10 text-gray-500">로딩 중...</div>;
  if (!data) return null;

  return (
    <div>
      {isEditing ? (
        <UserProfileEditor slug={slug} onCancel={() => setIsEditing(false)} onComplete={() => setIsEditing(false)} />
      ) : (
        <UserProfileViewer 
          slug={slug} 
          data={data}
          isLoading={isLoading}
          error={error}
        onEdit={() => setIsEditing(true)} />
      )}

      <div className="flex gap-10">
      {/* 좌측 태그 리스트 */}
      <div className="w-1/4">
        <UserTagList tags={data.tags} />
      </div>

      {/* 우측 카드 리스트*/}
      <div className="w-3/4 flex flex-col gap-4">
        <PortfolioInfiniteSearchResult />
      </div>
    </div>
    </div>
  );
  
  
}

export default UserProfileContainer;
