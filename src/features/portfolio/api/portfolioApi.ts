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

// 특정 유저의 포트폴리오 카드 목록을 검색하는 API 생성 함수 - slug 로 api 생성
export const createUserPortfolioSearchFn = (slug: string) => {
  return async (
    request: PortfolioSearchRequest
  ): Promise<Page<PortfolioCard>> => {
    const res = await apiClient.post(`/api/portfolio/search/${slug}/public`, request, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data.data;
  };
};

// 내가 좋아요 표시한 포트폴리오 카드 목록을 검색하는 API
export const searchMyLikedPortfolioCards = async (
  request: PortfolioSearchRequest
): Promise<Page<PortfolioCard>> => {
  const res = await apiClient.post<PortfolioCardListResponse>(
    `/api/portfolio/search/my/liked`,
    request,
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return res.data.data;
};///////////////////

// 포트폴리오 상세 정보를 가져오는 API
export const fetchPortfolioDetail = async (
    portfolioId: number
): Promise<PortfolioDetail> => {
  const res = await apiClient.get<CommonResponse<PortfolioDetail>>(
    `/api/portfolio/${portfolioId}/public`
  );
  return res.data.data;
};

// 포트폴리오 등록 API
export const createPortfolioApi = async (request: CreatePortfolioRequest): Promise<number> => {
  const response = await apiClient.post('/api/portfolio', request);
  return response.data.data.portfolioId;
};