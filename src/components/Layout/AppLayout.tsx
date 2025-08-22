// src/components/Layout/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 고정 헤더 */}
      <Header className="fixed top-0 left-0 right-0 z-50 bg-white shadow" />

      {/* 헤더 높이만큼 패딩 줘야 컨텐츠가 안가려짐 */}
      <main className="flex-1 bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;
