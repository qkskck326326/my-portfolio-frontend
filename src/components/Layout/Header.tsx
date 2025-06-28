// src/components/Layout/Header.tsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { logoutApi } from '@/features/auth/api/authApi';
import PortfolioSearchInput from '@/features/portfolio/components/PortfolioSearchInput';
import { searchPortfolioCards } from '@/features/portfolio/api/portfolioApi';

const Header = () => {
  const { isLoggedIn, logout } = useAuthStore();

  const handleLogout = async () => {
  try {
    await logoutApi();
    logout();
    window.location.href = '/login';
  } catch (e) {
    console.error('로그아웃 요청 실패', e);
  }
};

return (
    <header className="bg-white shadow-sm border-b px-6 py-4 space-y-4">
      {/* 상단: 로고 + 메뉴 */}
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MyPortfolio
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {isLoggedIn ? (
            <>
              <Link to="/portfolio/write" className="text-gray-700 hover:text-blue-500">
                포트폴리오 작성
              </Link>
              <Link to="/mypage" className="text-gray-700 hover:text-blue-500">
                마이페이지
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-500">
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-blue-500">
              로그인
            </Link>
          )}
        </nav>
      </div>

      <div className="w-full flex justify-end">
        <PortfolioSearchInput queryFn={searchPortfolioCards} />
      </div>
    </header>
  );
};

export default Header;
