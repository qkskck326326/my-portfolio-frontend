// src/features/user/components/UserProfileViewer.tsx
import { useAuthStore } from '@/features/auth/stores/authStore';

interface Props {
  slug: string;
  onEdit: () => void;
  data?: {
    userThumbnail: string;
    nickname: string;
    slug: string;
    email: string;
    github?: string;
    introduce?: string;
  } | null;
  isLoading?: boolean;
  error?: Error | null
}

const UserProfileViewer = ({ slug, onEdit, data, isLoading, error }: Props) => {
  
  const loginUser = useAuthStore((state) => state.user);

  const isMyPage = loginUser?.slug === slug;

  if (isLoading) return <div className="text-center py-20 text-gray-500">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">에러 발생: {String(error)}</div>;
  if (!data) return null;

  const {
    userThumbnail,
    nickname,
    email,
    github,
    introduce,
  } = data;

  return (
    <div className="max-w-4xl mx-auto mt-16 px-6 py-12 bg-white rounded-3xl shadow-xl space-y-10">

      <div className="flex flex-col md:flex-row items-start gap-10">
        <img
          src={userThumbnail}
          alt="프로필 썸네일"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-200"
        />
        <div className="flex-1 space-y-2">
          <p className="text-3xl font-bold">{nickname}</p>
          <p className="text-lg font-semibold">이메일</p>
          <a href={`mailto:${email}`} className="text-sm text-indigo-600 hover:underline">{email}</a>

          <div>
            <p className="text-lg font-semibold">GitHub</p>
            {github ? (
              <a href={github} className="text-indigo-600 hover:underline break-all" target="_blank" rel="noreferrer">
                {github}
              </a>
            ) : (
              <p className="text-gray-500">연결된 깃허브가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold">소개</p>
        <p className="text-gray-700">{introduce || '소개가 없습니다.'}</p>
      </div>

      {isMyPage && (
        <div className="flex justify-end">
          <button onClick={onEdit} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            프로필 수정
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileViewer;