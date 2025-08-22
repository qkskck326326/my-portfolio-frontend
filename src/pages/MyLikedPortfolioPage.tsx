// src/pages/MyLikedPortfolioPage.tsx
import React from 'react';
import PortfolioInfiniteSearchResult from '@/features/portfolio/components/PortfolioSearchResult';

const MyLikedPortfolioPage = () => {
  return (
    <div className="min-h-screen w-full bg-white px-4">
      <div className="mx-auto max-w-7xl">
        <PortfolioInfiniteSearchResult />
      </div>
    </div>
  );
};

export default MyLikedPortfolioPage;
