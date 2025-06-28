import React from 'react';
import LoginForm from '@/features/auth/components/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-start min-h-screen py-36">
      <LoginForm />
    </div>
  );
};

export default LoginPage;