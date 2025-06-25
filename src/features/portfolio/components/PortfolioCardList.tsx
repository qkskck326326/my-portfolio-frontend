// src/features/portfolio/components/PortfolioCardList.tsx
import PortfolioCard from './PortfolioCard';
import { PortfolioCard as CardType } from '../types/portfolio.types';

const PortfolioCardList = ({ items }: { items: CardType[] }) => {
  if (!items.length) return <p className="text-center text-gray-500">결과가 없습니다.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((card) => (
        <PortfolioCard key={card.id} card={card} />
      ))}
    </div>
  );
};

export default PortfolioCardList;