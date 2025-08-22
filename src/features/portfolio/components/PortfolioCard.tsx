// src/features/portfolio/components/PortfolioCard.tsx
import { memo, useEffect, useState, KeyboardEvent, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ImageOff } from 'lucide-react';
import type { PortfolioCard as CardType } from '../types/portfolio.types';

interface Props {
  card: CardType;
}

/**
 * 포인트
 * - 썸네일 "고정 크기": h-44/sm:h-48/md:h-52로 균일한 카드 그리드 유지
 * - 썸네일 없음/로드 실패: 파선 박스 + 아이콘 + "썸네일 없음" 문구 노출
 * - 카드 전체 클릭 가능(키보드 Enter/Space 포함), 작성자만 개별 링크
 * - 중첩 링크 제거
 */
const PortfolioCard = memo(({ card }: Props) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(!card.thumbnail);

  useEffect(() => {
    // 새 카드/새 URL이 들어오면 에러 상태 초기화
    setImgError(!card.thumbnail);
    console.log(`카드 slug: ${card.slug}`);
  }, [card.slug, card.thumbnail]);

  const goDetail = () => navigate(`/portfolio/${card.id}`);
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goDetail();
    }
  };
  const onAuthorClick = (e: MouseEvent) => e.stopPropagation();

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`${card.title} 상세 보기`}
      onClick={goDetail}
      onKeyDown={onKey}
      className="group relative w-full h-full cursor-pointer rounded-xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
    >
      {/* 썸네일 영역: 고정 높이 */}
      <figure className="relative w-full overflow-hidden rounded-t-xl bg-gray-50">
        <div className="h-44 w-full sm:h-48 md:h-52">
          {!imgError && card.thumbnail ? (
            <img
              src={card.thumbnail}
              alt={card.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
          ) : (
            // 썸네일 없음(명확한 시각적 신호)
            <div
              className="flex h-full w-full items-center justify-center bg-white/60"
              aria-label="썸네일 없음"
            >
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-5 text-gray-500">
                <ImageOff className="mb-1 h-6 w-6" />
                <span className="text-sm font-medium">썸네일 없음</span>
              </div>
            </div>
          )}
        </div>
      </figure>

      <div className="flex flex-col p-4">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-base font-semibold text-gray-900">{card.title}</h3>

          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="text-gray-500">by.</span>
            <Link
              to={`/user/${card.slug}`}
              onClick={onAuthorClick}
              className="inline-flex items-center gap-1 text-indigo-600 underline-offset-2 transition-colors hover:text-indigo-700 hover:underline"
              aria-label={`${card.nickname ?? '작성자 없음'} 프로필로 이동`}
            >
              <User className="h-4 w-4" />
              {card.nickname || '작성자 없음'}
            </Link>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end text-sm text-gray-600">
          <span className="mr-1 text-red-500">❤️</span>
          {card.likeCount}
        </div>
      </div>
    </article>
  );
});

export default PortfolioCard;
