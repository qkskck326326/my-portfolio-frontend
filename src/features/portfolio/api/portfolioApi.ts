// src/features/portfolio/api/portfolioApi.ts
import { apiClient } from '@/lib/apiClient';
import { PortfolioCard, 
  PortfolioSearchRequest, 
  PortfolioDetail, 
  PortfolioCardListResponse, 
  CreatePortfolioRequest } from '../types/portfolio.types';
import { CommonResponse, Page } from '@/types/common.types';

// 포트폴리오 카드 목록을 검색하는 API
export const searchPortfolioCards = async (
  request: PortfolioSearchRequest
): Promise<Page<PortfolioCard>> => {
  const res = await apiClient.post<PortfolioCardListResponse>(
    `/api/portfolio/search/public`,
    request, 
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return res.data.data;
};

// 포트폴리오 상세 정보를 가져오는 API
export const fetchPortfolioDetail = async (
    portfolioId: number
): Promise<PortfolioDetail> => {
  const res = await apiClient.get<CommonResponse<PortfolioDetail>>(
    `/api/portfolio/${portfolioId}`
  );
  return res.data.data;
};

// 포트폴리오 등록 API
export const createPortfolioApi = async (request: CreatePortfolioRequest): Promise<number> => {
  const response = await apiClient.post('/api/portfolio', request);
  return response.data.data; // ex: { data: 1 }
};