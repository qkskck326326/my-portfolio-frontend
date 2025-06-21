// src/components/Layout/Header.tsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { logoutApi } from '@/features/auth/api/authApi';

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
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MyPortfolio
      </Link>
      <nav className="space-x-4">
        <Link to="/portfolio" className="text-gray-700 hover:text-blue-500">
          포트폴리오
        </Link>
        {isLoggedIn ? (
          <>
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
    </header>
  );
};

export default Header;
