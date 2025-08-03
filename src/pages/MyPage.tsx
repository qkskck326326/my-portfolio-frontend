// src/pages/MyPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import UserProfileContainer from '@/features/user/components/UserProfileContainer';

const MyPage = () => {
  const { slug } = useParams();

  if (!slug) return <div>존재하지 않는 유저입니다.</div>;

  return (
    <div className="min-h-screen flex justify-center items-start bg-white">
      <UserProfileContainer slug={slug} />
    </div>
  );
};

export default MyPage;
