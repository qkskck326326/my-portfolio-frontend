// src/features/portfolio/components/PortfolioDetail.tsx
import MarkdownViewer from '@/features/portfolio/components/MarkdownViewer';
import { PortfolioDetail as DetailType } from '../types/portfolio.types';

const PortfolioDetail = ({ portfolio }: { portfolio: DetailType }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{portfolio.title}</h1>
        <p className="text-sm text-gray-500 mt-1">by {portfolio.authorNickname}</p>
        <div className="text-right text-sm text-gray-600">❤️ {portfolio.likeCount} 좋아요</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {portfolio.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>

      {/* ✅ Markdown 렌더링 */}
      <MarkdownViewer content={portfolio.content} />

      
    </div>
  );
};


export default PortfolioDetail;