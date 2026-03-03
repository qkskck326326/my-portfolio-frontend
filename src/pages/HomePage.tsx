// src/pages/HomePage.tsx
import PortfolioInfiniteSearchResult from '@/features/portfolio/components/PortfolioSearchResult';
import { useEffect } from 'react';
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';
import { searchPortfolioCards } from '@/features/portfolio/api/portfolioApi';

function HomePage() {
  const { setQueryFn, triggerSearch } = usePortfolioStore();

  useEffect(() => {
    // 메인(전체 검색)용 queryFn 세팅
    setQueryFn(searchPortfolioCards);

    // 현재의 keyword/tags/sort 기준으로 검색 실행
    triggerSearch();
  }, [setQueryFn, triggerSearch]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 w-full">
      <PortfolioInfiniteSearchResult />
    </main>
  );
}
export default HomePage;
