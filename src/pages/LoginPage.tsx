import React from 'react';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <form className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="이메일"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginPage;