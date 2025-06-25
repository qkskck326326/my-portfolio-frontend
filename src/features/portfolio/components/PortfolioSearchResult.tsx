// src/features/portfolio/components/PortfolioInfiniteSearchResult.tsx
import { useEffect, useRef } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { useInfinitePortfolioQuery } from '../hooks/useInfiniteSearchPortfolio';
import PortfolioCardList from './PortfolioCardList';

const PortfolioInfiniteSearchResult = () => {
  const { keyword, tags, trigger, queryFn } = usePortfolioStore();
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfinitePortfolioQuery(
    {
      queryKeyBase: 'portfolioSearch',
      queryFn: queryFn!,
      queryParams: { keyword, tags, sort: [{ field: 'createdAt', direction: 'DESC' }] },
    },
    [trigger]
  );

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (!queryFn) return null;
  if (isLoading) return <p className="text-center py-10 text-gray-400">불러오는 중...</p>;

  const items = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <section className="mt-10 space-y-6 px-4">
      <PortfolioCardList items={items} />
      <div ref={observerRef} className="h-12" />
      {isFetchingNextPage && <p className="text-center text-sm text-gray-400">더 불러오는 중...</p>}
    </section>
  );
};

export default PortfolioInfiniteSearchResult;
