import { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { checkNickname } from '../api/userApi';

interface Props {
  slug: string;
  onCancel: () => void;
  onComplete: () => void;
}

const UserProfileEditor = ({ slug, onCancel, onComplete }: Props) => {
  const { data, updateProfile, isUpdating } = useUserProfile({slug});
  const [nicknameTaken, setNicknameTaken] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    nickname: '',
    userThumbnail: '',
    introduce: '',
    github: '',
    email: '',
  });

  const handleNicknameCheck = async () => {
    if (form.nickname === originalNickname) {
      alert('닉네임이 변경되지 않았습니다.');
      return;
    }

    if (form.nickname.length > 30) {
      alert('닉네임은 30자 이하여야 합니다.');
      return;
    }
    try {
      const taken = await checkNickname(form.nickname);
      setNicknameTaken(taken);
    } catch (e) {
      console.error('닉네임 확인 실패:', e);
      alert('닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const [originalNickname, setOriginalNickname] = useState('');
  useEffect(() => {
    if (data) {
      const {
        nickname,
        userThumbnail,
        introduce,
        github,
        email,
      } = data;

      setForm({
        nickname,
        userThumbnail: userThumbnail ?? '',
        introduce: introduce ?? '',
        github: github ?? '',
        email,
      });

      setOriginalNickname(nickname);
    }
  }, [data]);

  if (!data) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
    const isNicknameChanged = form.nickname !== originalNickname;

    if (
      isNicknameChanged &&
      (nicknameTaken === null || nicknameTaken === true)
    ) {
      alert('닉네임 중복 확인을 완료해주세요.');
      return;
    }

    await updateProfile({ ...form });
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto mt-16 px-6 py-12 bg-white rounded-3xl shadow-xl space-y-10">
  <h2 className="text-4xl font-extrabold text-center text-gray-800">프로필 수정</h2>

  <div className="flex flex-col md:flex-row items-start gap-10">
    <div>
      <img
        src={form.userThumbnail}
        alt="프로필 썸네일"
        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-200"
      />
    </div>

    <div className="flex-1 space-y-4">
      {/* 프로필 이미지 */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">프로필 이미지</label>
        <input
          name="userThumbnail"
          value={form.userThumbnail}
          onChange={handleChange}
          className="w-full text-sm border px-3 py-2 rounded"
          placeholder="프로필 이미지 URL"
        />
      </div>

      {/* 닉네임 */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">닉네임</label>
        <div className="flex gap-2 items-center">
          <input
            name="nickname"
            value={form.nickname}
            onChange={(e) => {
              handleChange(e);
              setNicknameTaken(null);
            }}
            className="flex-1 text-2xl font-bold border px-3 py-2 rounded"
            placeholder="닉네임"
          />
          <button
            type="button"
            onClick={handleNicknameCheck}
            className="px-3 py-2 bg-blue-500 text-white rounded whitespace-nowrap"
          >
            중복 확인
          </button>
        </div>
        {nicknameTaken === true && (
          <span className="block text-sm text-red-500 mt-1">
            이미 사용 중인 닉네임입니다
          </span>
        )}
        {nicknameTaken === false && (
          <span className="block text-sm text-green-500 mt-1">
            사용 가능한 닉네임입니다
          </span>
        )}
      </div>

      {/* GitHub */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">깃허브 링크</label>
        <input
          name="github"
          value={form.github}
          onChange={handleChange}
          className="w-full text-sm border px-3 py-2 rounded"
          placeholder="GitHub 링크"
        />
      </div>
    </div>
  </div>

  {/* 소개 */}
  <div className="space-y-1">
    <label className="block text-lg font-semibold text-gray-800">소개</label>
    <textarea
      name="introduce"
      value={form.introduce}
      onChange={handleChange}
      className="w-full border px-3 py-2 rounded"
      rows={4}
      placeholder="자기소개를 입력하세요"
    />
  </div>

  {/* 버튼 */}
  <div className="flex justify-end gap-4">
    <button
      onClick={onCancel}
      className="bg-gray-300 px-4 py-2 rounded text-sm"
      disabled={isUpdating}
    >
      취소
    </button>
    <button
      onClick={handleSubmit}
      className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
      disabled={isUpdating}
    >
      {isUpdating ? '저장 중...' : '저장'}
    </button>
  </div>
</div>
  );
};

export default UserProfileEditor;