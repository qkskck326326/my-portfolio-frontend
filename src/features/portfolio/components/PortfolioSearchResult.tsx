// src/features/portfolio/components/PortfolioInfiniteSearchResult.tsx
import { useEffect, useRef } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { useInfinitePortfolioQuery } from '../hooks/useInfiniteSearchPortfolio';
import PortfolioCardList from './PortfolioCardList';

const PortfolioInfiniteSearchResult = () => {
  const { keyword, tags, trigger, queryFn, sortField, sortDirection } = usePortfolioStore();
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useInfinitePortfolioQuery(
      {
        queryKeyBase: 'portfolioSearch',
        queryFn: queryFn!,
        queryParams: { keyword, tags, sort: [{ field: sortField, direction: sortDirection }] },
      },
      [trigger, keyword, tags, sortField, sortDirection],
    );

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0 },
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  // === return (UI 통일) ===
  if (!queryFn) return null;

  if (isLoading) {
    return (
      <section className="mt-10 space-y-6 px-2 sm:px-4">
        <div className="flex items-center justify-center gap-3 py-10 text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
          <span>결과를 불러오는 중...</span>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-10 space-y-6 px-2 sm:px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          검색 결과를 불러오는 중 문제가 발생했습니다.
          <div className="mt-2 text-sm opacity-80">{String(error)}</div>
        </div>
      </section>
    );
  }

  const items = data?.pages.flatMap((page) => page.content) ?? [];
  const isEmpty = items.length === 0;

  return (
    <section className="mt-10 space-y-6 px-2 sm:px-4">
      {isEmpty ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-gray-500 shadow-sm">
          조건에 맞는 포트폴리오가 없습니다.
        </div>
      ) : (
        <>
          <PortfolioCardList items={items} />
          <div ref={observerRef} className="h-12" />
          {isFetchingNextPage && (
            <p className="text-center text-sm text-gray-400">더 불러오는 중...</p>
          )}
        </>
      )}
    </section>
  );
};

export default PortfolioInfiniteSearchResult;
