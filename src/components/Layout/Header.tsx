// src/components/Layout/Header.tsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';

const Header = () => {
  const { isLoggedIn, logout } = useAuthStore();

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
        <button onClick={logout}>로그아웃</button>
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
