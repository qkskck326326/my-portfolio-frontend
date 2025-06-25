// src/features/portfolio/store/portfolioStore.ts
import { create } from 'zustand';
import { PortfolioSearchRequest, PortfolioCard } from '../types/portfolio.types';
import { Page } from '@/types/common.types';

interface PortfolioSearchState {
  keyword: string;
  tags: string[];
  trigger: number;
  queryFn: ((params: PortfolioSearchRequest) => Promise<Page<PortfolioCard>>) | null;
  setKeyword: (kw: string) => void;
  setTags: (tags: string[]) => void;
  setQueryFn: (fn: (params: PortfolioSearchRequest) => Promise<Page<PortfolioCard>>) => void;
  triggerSearch: () => void;
  reset: () => void;
}

export const usePortfolioStore = create<PortfolioSearchState>((set) => ({
  keyword: '',
  tags: [],
  trigger: 0,
  queryFn: null,
  setKeyword: (kw) => set({ keyword: kw }),
  setTags: (tags) => set({ tags }),
  setQueryFn: (fn) => set({ queryFn: fn }),
  triggerSearch: () => set((state) => ({ trigger: state.trigger + 1 })),
  reset: () => set({ keyword: '', tags: [], trigger: 0, queryFn: null }),
}));