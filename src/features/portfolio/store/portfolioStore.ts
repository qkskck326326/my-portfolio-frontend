// src/features/portfolio/store/portfolioStore.ts
import { create } from 'zustand';
import { PortfolioSearchRequest, PortfolioCard } from '../types/portfolio.types';
import { Page } from '@/types/common.types';

interface PortfolioSearchState {
  keyword: string;
  tags: string[];
  trigger: number;
  queryFn: ((params: PortfolioSearchRequest) => Promise<Page<PortfolioCard>>) | null;
  sortField: 'createdAt' | 'likeCount'; // 정렬 기준 필드
  sortDirection: 'ASC' | 'DESC';
  setKeyword: (kw: string) => void;
  setTags: (tags: string[]) => void;
  setQueryFn: (fn: (params: PortfolioSearchRequest) => Promise<Page<PortfolioCard>>) => void;
  setSortField: (field: 'createdAt' | 'likeCount') => void;
  setSortDirection: (direction: 'ASC' | 'DESC') => void;
  triggerSearch: () => void;
  reset: () => void;
}

export const usePortfolioStore = create<PortfolioSearchState>((set) => ({
  keyword: '',
  tags: [],
  trigger: 0,
  queryFn: null,
  sortField: 'createdAt', // 기본 정렬 필드
  sortDirection: 'DESC', // 기본 정렬 방향
  setKeyword: (kw) => set({ keyword: kw }),
  setTags: (tags) => set({ tags }),
  setQueryFn: (fn) => set({ queryFn: fn }),
  setSortField: (field) => set({ sortField: field }),
  setSortDirection: (direction) => set({ sortDirection: direction }),
  triggerSearch: () => set((state) => ({ trigger: state.trigger + 1 })),
  reset: () => set({ keyword: '', tags: [], trigger: 0, queryFn: null }),
}));