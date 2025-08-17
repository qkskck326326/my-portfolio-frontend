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
  error?: Error | null;
}

const UserProfileViewer = ({ slug, onEdit, data, isLoading, error }: Props) => {
  const loginUser = useAuthStore((state) => state.user);
  const isMyPage = loginUser?.slug === slug;

  // === return (UI 통일) ===
  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
          <span>로딩 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-red-700">
        에러가 발생했습니다: {String(error)}
      </div>
    );
  }

  if (!data) return null;

  const { userThumbnail, nickname, email, github, introduce } = data;

  return (
    <section className="w-full mx-auto mt-16 px-6 py-12 bg-white rounded-3xl shadow-xl space-y-10">
      <div className="flex flex-col items-start gap-8 md:flex-row">
        <img
          src={userThumbnail || 'https://placehold.co/160x160?text=No Profile'}
          alt={`${nickname}의 프로필 이미지`}
          className="h-40 w-40 rounded-full border-4 border-indigo-200 object-cover"
        />
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">{nickname}</h1>

          <div>
            <p className="text-sm font-semibold text-gray-600">이메일</p>
            <a
              href={`mailto:${email}`}
              className="break-all text-sm text-indigo-600 hover:underline"
            >
              {email}
            </a>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600">GitHub</p>
            {github ? (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-indigo-600 hover:underline"
              >
                {github}
              </a>
            ) : (
              <p className="text-sm text-gray-500">연결된 깃허브가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-1 text-lg font-semibold text-gray-800">소개</p>
        <p className="text-gray-700">{introduce?.trim() ? introduce : '소개가 없습니다.'}</p>
      </div>

      {isMyPage && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={onEdit}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            프로필 수정
          </button>
        </div>
      )}
    </section>
  );
};

export default UserProfileViewer;
