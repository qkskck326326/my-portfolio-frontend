// src/pages/PortfolioEditPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolioDetail } from '@/features/portfolio/hooks/usePortfolioDetail';
import { useAuthStore } from '@/features/auth/stores/authStore';
import PortfolioForm from '@/features/portfolio/components/PortfolioForm';
import { useEffect } from 'react';

export default function PortfolioEditPage() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePortfolioDetail(Number(portfolioId));
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (data && user && data.authorNickname !== user.nickname) {
      alert('본인만 접근할 수 있습니다.');
      navigate('/');
    }
  }, [data, user, navigate]);

  if (isLoading) return <p className="text-center">불러오는 중...</p>;
  if (error || !data)
    return <p className="text-center text-red-500">포트폴리오 정보를 불러올 수 없습니다.</p>;

  return (
    <main className="max-w-4xl mx-auto px-4 mt-10">
      <PortfolioForm portfolio={data} />
    </main>
  );
}
