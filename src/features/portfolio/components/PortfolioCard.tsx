// src/features/portfolio/components/PortfolioCard.tsx
import { PortfolioCard as CardType } from '../types/portfolio.types';

interface Props {
  card: CardType;
}

const PortfolioCard = ({ card }: Props) => {
  return (
    <div className="w-full h-full flex flex-col border p-4 rounded-lg shadow-sm bg-white">
      <img
        src={card.thumbnail}
        alt={card.title}
        className="w-full h-40 object-cover rounded"
      />

      <div className="flex-1 flex flex-col justify-between mt-2">
        <div>
          <h3 className="font-bold text-base line-clamp-2 min-h-[3rem]">{card.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{card.nickname || '작성자 없음'}</p>
        </div>
        <p className="text-right text-sm mt-2">{card.likeCount} ❤️</p>
      </div>
    </div>
  );
};


export default PortfolioCard;