// src/features/portfolio/components/PortfolioDetail.tsx
import MarkdownViewer from '@/features/portfolio/components/MarkdownViewer';
import { PortfolioDetail as DetailType } from '../types/portfolio.types';
import { useCallback, useEffect, useState } from 'react';
import { Heart, Link as LinkIcon } from 'lucide-react';
import { portfolioLikeToggle, checkPortfolioLiked } from '../api/portfolioApi';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';

const PortfolioDetail = ({ portfolio }: { portfolio: DetailType }) => {
  const { isLoggedIn } = useAuthStore();
  const [likeCount, setLikeCount] = useState(portfolio.likeCount);
  const [liked, setLiked] = useState(false);
  const queryClient = useQueryClient();

  // 현재 링크 복사
  const handleCopyLink = useCallback(() => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('링크가 클립보드에 복사되었습니다!');
    });
  }, []);

  // 좋아요 상태 확인
  useEffect(() => {
    if (!isLoggedIn) {
        setLiked(false);
        return;
      }

    checkPortfolioLiked(portfolio.id)
      .then((res) => setLiked(res))
      .catch(() => setLiked(false));
  }, [isLoggedIn, portfolio.id]);

  // 포트폴리오 좋아요 토글
  const handleLikeToggle = useCallback(async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const { liked: newLiked, likeCount: newCount } = await portfolioLikeToggle(portfolio.id);
      setLiked(newLiked);
      setLikeCount(newCount);
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['portfolioDetail', portfolio.id] });
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  }, [isLoggedIn, portfolio.id, queryClient]);

  return (
    <div className="relative space-y-6">
      {/* 🔹 우측 고정 네비게이션 바 */}
      <div className="fixed top-1/3 right-6 flex flex-col items-center space-y-4 z-50">
        <button
          onClick={handleLikeToggle}
          className={`flex flex-col items-center shadow-md rounded-full px-4 py-3 transition 
            ${liked ? 'bg-red-100' : 'bg-white hover:bg-gray-100'}`}
        >
          <Heart className={liked ? 'text-red-500 fill-red-500' : 'text-gray-500'} size={20} />
          <span className="text-sm text-gray-700 mt-1">{likeCount}</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center bg-white shadow-md rounded-full px-4 py-3 hover:bg-gray-100 transition"
        >
          <LinkIcon size={20} />
          <span className="text-xs mt-1">공유</span>
        </button>
      </div>

      {/* 🔹 본문 */}
      <div className="space-y-6 border border-gray-200 rounded-lg p-8 shadow-sm bg-white">
        {/* 제목 + 작성자 */}
        <div>
          <h1 className="text-3xl font-bold">{portfolio.title}</h1>
          <p className="text-sm text-gray-500 mt-1">by {portfolio.authorNickname}</p>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2">
          {portfolio.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Markdown 렌더링 */}
        <MarkdownViewer content={portfolio.content} />
      </div>
    </div>
  );
};

export default PortfolioDetail;