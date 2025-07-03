// src/features/user/components/SignupForm.tsx
import { useState } from 'react';
import { checkEmail, checkNickname, signup } from '../api/userApi';
import type { SignupRequest } from '../types/user.types';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [form, setForm] = useState<SignupRequest & { confirm: string }>({
    email: '',
    password: '',
    confirm: '',
    nickname: '',
    userThumbnail: '',
    github: '',
    introduce: '',
    birth: '',
  });

  const [emailTaken, setEmailTaken] = useState<boolean | null>(null);
  const [nicknameTaken, setNicknameTaken] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailCheck = async () => {
    if (form.email.length > 50) {
      alert('이메일은 50자 이하여야 합니다.');
      return;
    }
    setEmailTaken(await checkEmail(form.email));
  };

  const handleNicknameCheck = async () => {
    if (form.nickname.length > 30) {
      alert('닉네임은 30자 이하여야 합니다.');
      return;
    }
    setNicknameTaken(await checkNickname(form.nickname));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert('비밀번호가 일치하지 않습니다');
      return;
    }

    if (emailTaken || nicknameTaken) {
      alert('이메일 또는 닉네임이 중복됩니다');
      return;
    }

    try {
      await signup(form);
      alert('회원가입이 완료되었습니다');
      navigate('/login');
    } catch (e) {
      console.error('회원가입 실패:', e);
      alert('회원가입 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-center">회원가입</h2>

      <div className="space-y-1">
        <label>이메일</label>
        <div className="flex gap-2">
          <input name="email" value={form.email} onChange={handleChange} className="border px-2 py-1 flex-1" />
          <button type="button" onClick={handleEmailCheck} className="px-2 bg-blue-500 text-white rounded">중복 확인</button>
        </div>
        {emailTaken === true && <p className="text-red-500 text-sm">이미 사용 중인 이메일입니다</p>}
        {emailTaken === false && <p className="text-green-500 text-sm">사용 가능한 이메일입니다</p>}
      </div>

      <div className="space-y-1">
        <label>닉네임</label>
        <div className="flex gap-2">
          <input name="nickname" value={form.nickname} onChange={handleChange} className="border px-2 py-1 flex-1" />
          <button type="button" onClick={handleNicknameCheck} className="px-2 bg-blue-500 text-white rounded">중복 확인</button>
        </div>
        {nicknameTaken === true && <p className="text-red-500 text-sm">이미 사용 중인 닉네임입니다</p>}
        {nicknameTaken === false && <p className="text-green-500 text-sm">사용 가능한 닉네임입니다</p>}
      </div>

      <div className="space-y-1">
        <label>비밀번호</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} className="border px-2 py-1 w-full" />
      </div>

      <div className="space-y-1">
        <label>비밀번호 확인</label>
        <input name="confirm" type="password" value={form.confirm} onChange={handleChange} className="border px-2 py-1 w-full" />
      </div>

      <div className="space-y-1">
        <label>GitHub 주소 (100자 이하)</label>
        <input name="github" value={form.github} onChange={handleChange} className="border px-2 py-1 w-full" maxLength={100} />
      </div>

      <div className="space-y-1">
        <label>한 줄 소개 (최대 2000자)</label>
        <textarea name="introduce" value={form.introduce} onChange={handleChange} className="border px-2 py-1 w-full" maxLength={2000} />
      </div>

      <div className="space-y-1">
        <label>생년월일</label>
        <input name="birth" type="date" value={form.birth} onChange={handleChange} className="border px-2 py-1 w-full" />
      </div>

      <button type="submit" className="w-full py-2 bg-green-600 text-white rounded">회원가입</button>
    </form>
  );
};

export default SignupForm;
