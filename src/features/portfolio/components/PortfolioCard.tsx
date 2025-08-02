// src/features/portfolio/components/PortfolioCard.tsx
import { PortfolioCard as CardType } from '../types/portfolio.types';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

interface Props {
  card: CardType;
}

const PortfolioCard = ({ card }: Props) => {
useEffect(() => {
    console.log(`카드 slug: ${card.slug}`);
  }, [card.slug]);


  return (
    <Link
      to={`/portfolio/${card.id}`}
      className="block w-full h-full hover:shadow-md transition-shadow duration-200"
    >
      <div className="w-full h-full flex flex-col border p-4 rounded-lg shadow-sm bg-white">
        <img
          src={card.thumbnail}
          alt={card.title}
          className="w-full h-40 object-cover rounded"
        />

        <div className="flex-1 flex flex-col justify-between mt-2">
          <div>
            <h3 className="font-bold text-base line-clamp-2 min-h-[3rem]">{card.title}</h3>
            by. <Link
              to={`/user/${card.slug}`}
              className="text-sm text-indigo-600 hover:underline mt-1 inline-block"
              onClick={(e) => e.stopPropagation()} // 카드 전체 클릭과 충돌 방지
            >
              {card.nickname || '작성자 없음'}
            </Link>
          </div>
          <p className="text-right text-sm mt-2">{card.likeCount} ❤️</p>
        </div>
      </div>
    </Link>
  );
};


export default PortfolioCard;