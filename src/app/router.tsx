// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ErrorPage from '@/pages/ErrorPage';
import AppLayout from '@/components/Layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,            // 레이아웃 적용
    errorElement: <ErrorPage />,       // 공통 에러 페이지
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);
