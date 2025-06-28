// src/pages/PortfolioDetailPage.tsx
import { useParams } from 'react-router-dom';
import { usePortfolioDetail } from '@/features/portfolio/hooks/usePortfolioDetail';
import PortfolioDetail from '@/features/portfolio/components/PortfolioDetail';

const PortfolioDetailPage = () => {
  const { portfolioId } = useParams();
  const id = Number(portfolioId);

  const { data, isLoading, error } = usePortfolioDetail(id);

  if (isLoading) return <p className="text-center py-10 text-gray-400">불러오는 중...</p>;
  if (error || !data) return <p className="text-center py-10 text-red-500">포트폴리오를 불러올 수 없습니다.</p>;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <PortfolioDetail portfolio={data} />
    </main>
  );
};

export default PortfolioDetailPage;
