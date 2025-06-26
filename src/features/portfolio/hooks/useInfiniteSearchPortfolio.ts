// src/features/portfolio/hooks/useInfiniteSearchPortfolio.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { PortfolioCard, PortfolioSearchRequest } from '../types/portfolio.types';
import { Page } from '@/types/common.types';

type Params = Omit<PortfolioSearchRequest, 'page'>;

interface Options {
  queryKeyBase: string;
  queryFn: (params: PortfolioSearchRequest) => Promise<Page<PortfolioCard>>;
  queryParams: Params;
}

export const useInfinitePortfolioQuery = (
  { queryKeyBase, queryFn, queryParams }: Options,
  deps: unknown[] = []
) => {
  return useInfiniteQuery<Page<PortfolioCard>, Error>({
    queryKey: [
    queryKeyBase,
    queryFn,
    queryParams.keyword,
    (queryParams.tags ?? []).join(','),
    JSON.stringify(queryParams.sort),
    ...deps,
    ],
    queryFn: ({ pageParam = 0 }) =>
      queryFn({ ...queryParams, page: pageParam as number }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    initialPageParam: 0,
    refetchOnMount: true,
  });
};
