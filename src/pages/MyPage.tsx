import React from 'react';
import UserProfileContainer from '@/features/user/components/UserProfileContainer';

const MyPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-start pt-10 bg-white">
      <UserProfileContainer />
    </div>
  );
};

export default MyPage;