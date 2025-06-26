// src/features/portfolio/components/PortfolioSearchInput.tsx
import { useState, useEffect } from 'react';
import { PortfolioSearchRequest, PortfolioCard } from '../types/portfolio.types';
import { Page } from '@/types/common.types';
import { usePortfolioStore } from '../store/portfolioStore';

interface Props {
  queryFn: (params: PortfolioSearchRequest) => Promise<Page<PortfolioCard>>;
}

const PortfolioSearchInput = ({ queryFn }: Props) => {
  const {
    keyword,
    tags,
    setKeyword,
    setTags,
    setQueryFn,
    triggerSearch,
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
  } = usePortfolioStore();

  const [tagInput, setTagInput] = useState(tags.join(','));

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    const parsed = value.split(',').map((t) => t.trim()).filter(Boolean);
    setTags(parsed);
  };

  const handleSearch = () => {
    setQueryFn(queryFn); // 전달받은 API 함수 설정
    triggerSearch();     // 검색 트리거
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="flex gap-4 items-center px-4 py-2 bg-white shadow-sm">
      <select
        className="border rounded px-2 py-1"
        value={sortField}
        onChange={(e) => setSortField(e.target.value as 'createdAt' | 'likeCount')}
      >
        <option value="createdAt">최신순</option>
        <option value="likeCount">좋아요순</option>
      </select>

      <select
        className="border rounded px-2 py-1"
        value={sortDirection}
        onChange={(e) => setSortDirection(e.target.value as 'ASC' | 'DESC')}
      >
        <option value="DESC">내림차순</option>
        <option value="ASC">오름차순</option>
      </select>

      <input
        className="border rounded px-2 py-1"
        placeholder="제목 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="태그 (쉼표)"
        value={tagInput}
        onChange={(e) => handleTagInputChange(e.target.value)}
      />
      <button onClick={handleSearch} className="px-4 py-1 bg-blue-600 text-white rounded">
        검색
      </button>
    </div>
  );
};

export default PortfolioSearchInput;
