// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ErrorPage from '@/pages/ErrorPage';
import MyPage from '@/pages/MyPage';
import PortfolioWritePage from '@/pages/PortfolioWritePage';
import PortfolioDetailPage from '@/pages/PortfolioDetailPage';
import MyLikedPortfolioPage from '@/pages/MyLikedPortfolioPage';
import SignupPage from '@/pages/SignupPage';
import AppLayout from '@/components/Layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,            // 레이아웃 적용
    errorElement: <ErrorPage />,       // 공통 에러 페이지
    children: [
      { index: true, element: <HomePage /> },
      { path: '/error', element: <ErrorPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: '/user/:slug', element: <MyPage />, },
      { path: '/my/likes', element: <MyLikedPortfolioPage /> }, // 자신의 좋아요 표시한 포트폴리오 페이지
      { path: "/portfolio/write", element: <PortfolioWritePage />},
      { path: '/portfolio/:portfolioId', element: <PortfolioDetailPage />},
      { path: 'signup', element: <SignupPage /> }
    ],
  },
]);
