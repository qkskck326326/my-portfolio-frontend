// src/pages/MyLikedPortfolioPage.tsx
import React from 'react';
import PortfolioInfiniteSearchResult from '@/features/portfolio/components/PortfolioSearchResult';

const MyLikedPortfolioPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-start bg-white">
      <PortfolioInfiniteSearchResult />
    </div>
  );
};

export default MyLikedPortfolioPage;