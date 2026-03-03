// src/features/user/components/UserProfileContainer.tsx
import { useState, useEffect } from 'react';
import UserProfileViewer from './UserProfileViewer';
import UserProfileEditor from './UserProfileEditor';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';
import PortfolioInfiniteSearchResult from '@/features/portfolio/components/PortfolioSearchResult';
import UserTagList from '@/features/user/components/UserTagList';
import { createUserPortfolioSearchFn } from '@/features/portfolio/api/portfolioApi';

interface Props {
  slug: string;
}

const UserProfileContainer = ({ slug }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, error } = useUserProfile({ slug });
  const {
    reset: resetPortfolioStore,
    setQueryFn,
    triggerSearch,
    keyword,
    tags,
    sortField,
    sortDirection,
  } = usePortfolioStore();

  // ✅ 1. 슬러그 바뀔 때: 유저 전용 queryFn + 초기 검색
  useEffect(() => {
    // 이전 검색 상태 초기화
    resetPortfolioStore();

    // 이 유저(slug)의 포트폴리오만 검색하는 함수로 queryFn 세팅
    const userQueryFn = createUserPortfolioSearchFn(slug);
    // userQueryFn: (request: PortfolioSearchRequest) => Promise<Page<PortfolioCard>>
    setQueryFn(userQueryFn);

    // 최초 검색 1회 실행
    triggerSearch();
  }, [slug, resetPortfolioStore, setQueryFn, triggerSearch]);

  // ✅ 2. 유저 페이지에서 검색 조건 바뀌면 자동 검색
  useEffect(() => {
    // queryFn은 이미 "이 유저 전용"으로 세팅돼 있다고 가정
    triggerSearch();
  }, [keyword, tags, sortField, sortDirection, triggerSearch]);

  const handleEditStart = () => setIsEditing(true);
  const handleEditDone = () => setIsEditing(false);
  const handleEditCancel = handleEditDone;

  // === return (UI 통일) ===
  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
          <span>사용자 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-red-700">
        에러가 발생했습니다: {String(error)}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      className="mx-auto py-12
    px-6 md:px-8 xl:px-12 2xl:px-16
    max-w-[1400px] 2xl:max-w-[1600px]"
    >
      {isEditing ? (
        <UserProfileEditor slug={slug} onCancel={handleEditCancel} onComplete={handleEditDone} />
      ) : (
        <UserProfileViewer slug={slug} data={data} onEdit={handleEditStart} />
      )}

      {/* 본문: 좌 - 태그 / 우 - 포트폴리오 리스트 */}
      <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-gray-800">태그</h3>
            <UserTagList tags={data.tags} />
          </div>
        </aside>

        <div className="md:col-span-3">
          <PortfolioInfiniteSearchResult />
        </div>
      </section>
    </div>
  );
};

export default UserProfileContainer;
