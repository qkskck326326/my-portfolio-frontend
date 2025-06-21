import { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

interface Props {
  onCancel: () => void;
  onComplete: () => void;
}

const UserProfileEditor = ({ onCancel, onComplete }: Props) => {
  const { data, updateProfile, isUpdating } = useUserProfile();

  const [form, setForm] = useState({
    nickname: '',
    userThumbnail: '',
    introduce: '',
    github: '',
    birth: '',
    email: '',
  });

  useEffect(() => {
    if (data) {
      const {
        nickname,
        userThumbnail,
        introduce,
        github,
        birth,
        email,
      } = data;

      setForm({
        nickname,
        userThumbnail,
        introduce,
        github,
        birth,
        email,
      });
    }
  }, [data]);

  if (!data) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await updateProfile({ ...form });
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto mt-16 px-6 py-12 bg-white rounded-3xl shadow-xl space-y-10">
      <h2 className="text-4xl font-extrabold text-center text-gray-800">프로필 수정</h2>

      <div className="flex flex-col md:flex-row items-start gap-10">
        <img
          src={form.userThumbnail}
          alt="프로필 썸네일"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-200"
        />
        <div className="flex-1 space-y-3">
          <input
            name="userThumbnail"
            value={form.userThumbnail}
            onChange={handleChange}
            className="w-full text-sm border px-3 py-2 rounded"
            placeholder="프로필 이미지 URL"
          />
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="w-full text-2xl font-bold border px-3 py-2 rounded"
            placeholder="닉네임"
          />
          <input
            type="date"
            name="birth"
            value={form.birth}
            onChange={handleChange}
            className="w-full text-sm border px-3 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full text-sm border px-3 py-2 rounded"
          />
          <input
            name="github"
            value={form.github}
            onChange={handleChange}
            className="w-full text-sm border px-3 py-2 rounded"
            placeholder="GitHub 링크"
          />
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold">소개</p>
        <textarea
          name="introduce"
          value={form.introduce}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={4}
          placeholder="자기소개를 입력하세요"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
          disabled={isUpdating}
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={isUpdating}
        >
          {isUpdating ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default UserProfileEditor;