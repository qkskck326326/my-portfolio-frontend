// src/components/Layout/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { logoutApi } from '@/features/auth/api/authApi';
import PortfolioSearchInput from '@/features/portfolio/components/PortfolioSearchInput';
import {
  searchPortfolioCards,
  createUserPortfolioSearchFn,
  searchMyLikedPortfolioCards,
} from '@/features/portfolio/api/portfolioApi';
import defaultProfile from '@/assets/default-profile.png';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const { isLoggedIn, logout, user } = useAuthStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const safeThumb =
    user?.userThumbnail && user.userThumbnail.trim().length > 0
      ? user.userThumbnail.trim()
      : defaultProfile;

  // 경로 기준 분기
  // 특정 유저의 페이지 일 경우 판별
  const isUserPage = location.pathname.startsWith('/user/');
  // 자신의 좋아요 표시한 페이지 일 경우 판별
  const isMyLikesPage = location.pathname === '/my/likes';

  let queryFn = searchPortfolioCards;

  // 유저 페이지인 경우 해당 유저의 포트폴리오 검색 함수로 변경
  if (isUserPage) {
    const slug = location.pathname.split('/')[2]; // /user/{slug}에서 slug 추출
    queryFn = createUserPortfolioSearchFn(slug);
  }
  console.log('queryFn:', queryFn);

  // 자신이 좋아요 표시한 포트폴리오 페이지인 경우
  if (isMyLikesPage) {
    queryFn = searchMyLikedPortfolioCards;
  }

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
    <header className={`h-16 flex items-center px-4 w-full ${className ?? ''}`}>
      {/* 좌(로고) - 우(검색+로그인/프로필). 우측 묶음은 줄바꿈 허용 */}
      <div className="flex items-center gap-4 w-full">
        {/* 좌: 로고 */}
        <Link to="/" className="text-2xl font-bold text-blue-600 whitespace-nowrap shrink-0">
          MyPortfolio
        </Link>

        {/* 스페이서: 우측으로 밀기 */}
        <div className="flex-1" />

        {/* 우: 검색 + 로그인/프로필 (겹침 방지 위해 wrap) */}
        <div className="flex flex-wrap justify-end items-center gap-x-3 gap-y-2">
          {/* 검색: 최소 너비 보장 + 내부 크기 유지 */}
          <div className="shrink-0 min-w-[360px] sm:min-w-[380px] md:min-w-[480px]">
            <div className="w-full">
              <PortfolioSearchInput queryFn={queryFn} />
            </div>
          </div>

          {/* 로그인/프로필: 고정 크기 */}
          <nav className="flex items-center gap-6 text-sm shrink-0">
            {isLoggedIn ? (
              <div className="relative" ref={menuRef}>
                {/* 프로필 버튼 */}
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={safeThumb}
                    alt="프로필"
                    className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                  />
                  <span className="text-gray-700 font-medium max-w-32 truncate">
                    {user?.nickname}
                  </span>
                  {menuOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {/* 드롭다운 */}
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg border z-50">
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
                    <Link
                      to="/my/likes"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      좋아요한 포트폴리오
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
      </div>
    </header>
  );
};

export default Header;
