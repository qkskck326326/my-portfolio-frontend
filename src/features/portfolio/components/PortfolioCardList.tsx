// src/features/portfolio/components/PortfolioCardList.tsx
import PortfolioCard from './PortfolioCard';
import { PortfolioCard as CardType } from '../types/portfolio.types';

const PortfolioCardList = ({ items }: { items: CardType[] }) => {
  if (!items.length) return <p className="text-center text-gray-500">결과가 없습니다.</p>;

  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] max-w-7xl mx-auto">
      {items.map((card) => (
        <div key={card.id} className="max-w-[320px] w-full mx-auto">
          <PortfolioCard card={card} />
        </div>
      ))}
    </div>
  );
};

export default PortfolioCardList;
