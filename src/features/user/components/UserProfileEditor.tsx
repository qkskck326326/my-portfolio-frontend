// src/features/user/components/UserProfileEditor.tsx
import { useState, useEffect, useRef } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { checkNickname } from '../api/userApi';
import { resizeImage } from '@/public/utils/imageResize';
import { uploadImageToCdn } from '@/features/images/api/uploadImageApi';
import { useAuthStore } from '@/features/auth/stores/authStore';

interface Props {
  slug: string;
  onCancel: () => void;
  onComplete: () => void;
}

const MAX_NICKNAME = 30;
const DEFAULT_PLACEHOLDER = 'https://placehold.co/160x160?text=No%20Profile';

const UserProfileEditor = ({ slug, onCancel, onComplete }: Props) => {
  const { data, updateProfile, isUpdating } = useUserProfile({ slug });

  const [nicknameTaken, setNicknameTaken] = useState<boolean | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 드래그 상태(깜빡임 방지용 depth 카운터)
  const [isDragging, setIsDragging] = useState(false);
  const dragDepthRef = useRef(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const setUserThumbnail = useAuthStore((s) => s.setUserThumbnail);

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
    try {
      await updateProfile({ ...form });
      if (form.userThumbnail) {
        setUserThumbnail(form.userThumbnail); // 저장 성공 시 전역도 동기화
      }
      onComplete();
    } catch (e) {
      console.error('프로필 업데이트 실패:', e);
    }
  };

  // =========================================
  // ① 전역 기본 동작 방지: 파일 드롭 시 페이지 네비게이션 차단
  // =========================================
  useEffect(() => {
    const isFileDrag = (e: DragEvent) =>
      !!e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');

    const onWindowDragOver = (e: DragEvent) => {
      if (isFileDrag(e)) {
        e.preventDefault();
      }
    };
    const onWindowDrop = (e: DragEvent) => {
      if (isFileDrag(e)) {
        e.preventDefault();
      }
    };

    window.addEventListener('dragover', onWindowDragOver);
    window.addEventListener('drop', onWindowDrop);
    return () => {
      window.removeEventListener('dragover', onWindowDragOver);
      window.removeEventListener('drop', onWindowDrop);
    };
  }, []);

  // =========================================
  // ② 아바타 영역에만 드롭 허용 + 깜빡임 없는 dragenter/levae 관리
  // =========================================
  const onAvatarDragEnter: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (!e.dataTransfer) return;
    if (!Array.from(e.dataTransfer.types || []).includes('Files')) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const onAvatarDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (!e.dataTransfer) return;
    if (!Array.from(e.dataTransfer.types || []).includes('Files')) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onAvatarDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 자식 요소 경계 통과로 인한 잦은 leave를 depth 카운터로 흡수
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDragging(false);
  };

  const onAvatarDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) await handleFile(f);
  };

  // 파일 처리(리사이즈 → 업로드 → 폼 반영)
  const handleFile = async (file: File) => {
    try {
      setUploadError(null);
      setIsUploading(true);

      if (!file.type.startsWith('image/')) {
        throw new Error('이미지 파일만 업로드할 수 있습니다.');
      }

      const resized = await resizeImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        mimeType: 'image/webp',
        quality: 0.9,
      });

      const { url } = await uploadImageToCdn(resized);
      setForm((prev) => ({ ...prev, userThumbnail: url }));
      // 필요하면 여기서도 즉시 전역 반영 가능:
      // setUserThumbnail(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '업로드 중 오류가 발생했습니다.';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0];
    if (f) await handleFile(f);
    if (fileInputRef.current) fileInputRef.current.value = ''; // 같은 파일 재업로드 허용
  };

  // === return ===
  if (!data) return null;

  return (
    <div className="w-full mx-auto mt-16 px-6 py-12 bg-white rounded-3xl shadow-xl space-y-10">
      <h2 className="text-center text-3xl font-extrabold text-gray-800">프로필 수정</h2>

      <div className="flex flex-col items-start gap-8 md:flex-row">
        {/* 아바타 + 드래그&드랍/파일선택 */}
        <div className="relative shrink-0 mx-auto md:mx-0 flex flex-col items-center">
          {/* 드롭 가능 영역을 아바타 크기로 한정 */}
          <div
            className="relative h-40 w-40"
            onDragEnter={onAvatarDragEnter}
            onDragOver={onAvatarDragOver}
            onDragLeave={onAvatarDragLeave}
            onDrop={onAvatarDrop}
          >
            <img
              src={form.userThumbnail || DEFAULT_PLACEHOLDER}
              alt="프로필 이미지 미리보기"
              className="h-40 w-40 rounded-full border-4 border-indigo-200 object-cover"
              aria-busy={isUploading}
            />
            {/* 오버레이: 드래그 중일 때만, 포인터 이벤트 비활성화로 깜빡임 방지 */}
            {isDragging && (
              <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white text-xs pointer-events-none">
                여기로 드롭해서 업로드
              </div>
            )}
          </div>

          {/* 업로드 버튼 + 안내 문구 (버튼 아래, 작게) */}
          <div className="mt-3 w-full flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={openFileDialog}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                disabled={isUploading || isUpdating}
              >
                {isUploading ? '업로드 중...' : '프로필 업로드'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>

            <p className="text-xs text-gray-500">이미지를 드래그해서 업로드할 수 있습니다.</p>

            {uploadError && (
              <span className="text-xs text-red-600 mt-1">업로드 실패: {uploadError}</span>
            )}
          </div>
        </div>

        {/* 우측 폼 */}
        <div className="flex-1 space-y-4">
          {/* 프로필 이미지 URL 입력필드 숨김 */}
          <input type="hidden" name="userThumbnail" value={form.userThumbnail} />

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
                disabled={isUpdating}
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

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">소개</label>
        <textarea
          name="introduce"
          value={form.introduce}
          onChange={handleChange}
          className="h-28 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="자기소개를 입력하세요"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          disabled={isUpdating || isUploading}
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isUpdating || isUploading}
          aria-busy={isUpdating || isUploading}
        >
          {isUpdating ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default UserProfileEditor;
