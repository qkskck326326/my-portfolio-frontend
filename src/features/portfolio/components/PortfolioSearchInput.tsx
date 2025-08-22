// src/features/portfolio/components/PortfolioSearchInput.tsx
import { useState, useEffect, useCallback } from 'react';
import { PortfolioSearchRequest, PortfolioCard } from '../types/portfolio.types';
import { Page } from '@/types/common.types';
import { usePortfolioStore } from '../store/portfolioStore';

interface Props {
  queryFn: (params: PortfolioSearchRequest) => Promise<Page<PortfolioCard>>;
  className?: string;
}

const PortfolioSearchInput = ({ queryFn, className }: Props) => {
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

  const [tagInput, setTagInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback(() => {
    setQueryFn(queryFn);
    triggerSearch();
  }, [queryFn, setQueryFn, triggerSearch]);

  // 태그 추가 함수
  const addTag = (raw: string) => {
    const value = raw.trim();
    if (!value || tags.includes(value)) return;

    const updated = [...tags, value];
    setTags(updated);
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [handleSearch, sortField, sortDirection, keyword, tags]);

  return (
    <div className={`flex gap-4 items-center px-4 py-2 bg-white ${className ?? ''}`}>
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
      <div className="relative w-64">
        <input
          className="border rounded px-2 py-1 w-full"
          placeholder="태그 입력 후 Enter 또는 ,"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* 태그 표시 영역 */}
        {(isFocused || tags.length > 0) && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
            {tags.length > 0 ? (
              <div className="p-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 p-2">태그를 입력해 주세요</p>
            )}
          </div>
        )}
      </div>

      <button onClick={handleSearch} className="px-4 py-1 bg-blue-600 text-white rounded">
        검색
      </button>
    </div>
  );
};

export default PortfolioSearchInput;
