// src/features/portfolio/types/portfolio.types.ts
import { CommonResponse, Page } from '@/types/common.types';

// 포트폴리오 카드
export interface PortfolioCard {
  id: number;
  thumbnail: string;
  title: string;
  likeCount: number;
  slug: string;
  createdAt: string; // ISO date string: 'yyyy-MM-dd'
  nickname: string;
  authorId: number;
}

// 포트폴리오 카드 목록 응답
export type PortfolioCardListResponse = CommonResponse<Page<PortfolioCard>>;

// 포트폴리오 상세 정보
export interface PortfolioDetail {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  authorNickname: string;
  likeCount: number;
  tags: string[];
}

// 포트폴리오 상세 정보 응답
export type PortfolioDetailResponse = CommonResponse<PortfolioDetail>;

// 정렬기준 필드 및 sort (아래 요청 내에 들어감)
export interface SortRequest {
  field: string; // 정렬 필드명
  direction: 'ASC' | 'DESC';
}

// 포트폴리오 색인 요청
export interface PortfolioSearchRequest {
  keyword?: string;
  tags?: string[];
  page?: number;
  size?: number;
  sort?: SortRequest[];
}

// 포트폴리오 등록 요청
export type CreatePortfolioRequest = {
  title: string;
  thumbnail?: string;
  content: string;
  tags?: string[];
};

// 포트폴리오 등록 요청 응답 DTO
export interface PortfolioIdDto {
  portfolioId: number;
}

// 포트폴리오 등록 요청 응답
export type CreatePortfolioResponse = CommonResponse<PortfolioIdDto>;

// 포트폴리오 수정 요청 DTO
export interface PortfolioUpdateRequest {
  portfolioId: number; // @NotNull
  title: string; // @NotBlank, @Size(max = 100)
  thumbnail?: string; // 선택적 (백엔드에서 null 허용)
  content: string; // @NotBlank, @Size(max = 10000)
  tags?: string[]; // 선택적 (빈 배열 가능)
}

// 포트폴리오 삭제 요청 DTO
export interface PortfolioDeleteRequest {
  portfolioId: number;
}
