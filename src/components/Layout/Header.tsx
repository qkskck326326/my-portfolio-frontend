// src/components/Layout/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { logoutApi } from '@/features/auth/api/authApi';
import PortfolioSearchInput from '@/features/portfolio/components/PortfolioSearchInput';
import { searchPortfolioCards, createUserPortfolioSearchFn } from '@/features/portfolio/api/portfolioApi';

const Header = () => {
  const { isLoggedIn, logout, user } = useAuthStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 경로 기준 분기
  const isUserPage = location.pathname.startsWith('/user/');

  let queryFn = searchPortfolioCards

  if (isUserPage) {
    const slug = location.pathname.split('/')[2]; // /user/{slug}에서 slug 추출
    queryFn = createUserPortfolioSearchFn(slug);
  }
  console.log('queryFn:', queryFn);
  

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
      window.location.href = '/login';
    } catch (e) {
      console.error('로그아웃 요청 실패', e);
    }
  };

   // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

return (
    <header className="bg-white shadow-sm border-b px-6 py-4 space-y-4">
      {/* 상단: 로고 + 메뉴 */}
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MyPortfolio
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {isLoggedIn ? (
          <div className="relative" ref={menuRef}>
            {/* 프로필 버튼 */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                src={user?.userThumbnail ?? '/default-profile.png'} // TODO: 기본 프로필 이미지 경로 설정
                alt="프로필"
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
              <span className="text-gray-700 font-medium">{user?.nickname}</span>
              {menuOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {/* 드롭다운 메뉴 */}
            {menuOpen && (
              <div
                className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border z-50 transform transition-transform duration-200 origin-top-right"
              >
                <Link
                  to="/portfolio/write"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  포트폴리오 작성
                </Link>
                <Link
                  to={`/user/${user?.slug}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-500">
                로그인
              </Link>
              <Link to="/signup" className="text-gray-700 hover:text-blue-500">
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="w-full flex justify-end">
        <PortfolioSearchInput queryFn={queryFn} />
      </div>
    </header>
  );
};

export default Header;
