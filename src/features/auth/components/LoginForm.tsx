// src/features/auth/components/LoginForm.tsx
import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

const LoginForm = () => {
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-sm mx-auto space-y-4"
        autoComplete="on"
    >
      <div>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
};

export default LoginForm;