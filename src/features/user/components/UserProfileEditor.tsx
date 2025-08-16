// src/features/user/components/UserProfileEditor.tsx
import { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { checkNickname } from '../api/userApi';

interface Props {
  slug: string;
  onCancel: () => void;
  onComplete: () => void;
}

const MAX_NICKNAME = 30;

const UserProfileEditor = ({ slug, onCancel, onComplete }: Props) => {
  const { data, updateProfile, isUpdating } = useUserProfile({ slug });
  const [nicknameTaken, setNicknameTaken] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    nickname: '',
    userThumbnail: '',
    introduce: '',
    github: '',
    email: '',
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      nickname: data.nickname ?? '',
      userThumbnail: data.userThumbnail ?? '',
      introduce: data.introduce ?? '',
      github: data.github ?? '',
      email: data.email ?? '',
    });
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'nickname') setNicknameTaken(null);
  };

  const handleNicknameCheck = async () => {
    if (!form.nickname.trim()) return;
    if (form.nickname.length > MAX_NICKNAME) return;
    const taken = await checkNickname(form.nickname.trim());
    setNicknameTaken(taken);
  };

  const handleSubmit = async () => {
    await updateProfile({ ...form });
    onComplete();
  };

  // === return (UI 통일) ===
  if (!data) return null;

  return (
    <div className="w-full mx-auto mt-16 px-6 py-12 bg-white rounded-3xl shadow-xl space-y-10">
      <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-800">프로필 수정</h2>

      <div className="flex flex-col items-start gap-8 md:flex-row">
        <div className="shrink-0">
          <img
            src={form.userThumbnail || 'https://placehold.co/160x160?text=Profile'}
            alt="프로필 이미지 미리보기"
            className="h-40 w-40 rounded-full border-4 border-indigo-200 object-cover"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              프로필 이미지(URL)
            </label>
            <input
              name="userThumbnail"
              value={form.userThumbnail}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/me.png"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">닉네임</label>
            <div className="flex items-center gap-2">
              <input
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                className="flex-1 rounded-lg border px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="닉네임"
                maxLength={MAX_NICKNAME}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                className="whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-busy={isUpdating}
              >
                중복 확인
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {form.nickname.length} / {MAX_NICKNAME}
            </p>
            {nicknameTaken === true && (
              <span className="mt-1 block text-sm text-red-600">이미 사용 중인 닉네임입니다.</span>
            )}
            {nicknameTaken === false && (
              <span className="mt-1 block text-sm text-green-600">사용 가능한 닉네임입니다.</span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">GitHub 링크</label>
            <input
              name="github"
              value={form.github}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://github.com/username"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-1 block text-sm font-medium text-gray-700">소개</label>
        <textarea
          name="introduce"
          value={form.introduce}
          onChange={handleChange}
          className="h-28 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="자기소개를 입력하세요"
        />
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          disabled={isUpdating}
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isUpdating}
          aria-busy={isUpdating}
        >
          {isUpdating ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default UserProfileEditor;
