// src/features/portfolio/hooks/usePortfolioDetail.ts
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolioDetail } from '../api/portfolioApi';

export const usePortfolioDetail = (id: number) => {
  return useQuery({
    queryKey: ['portfolioDetail', id],
    queryFn: () => fetchPortfolioDetail(id),
  });
};