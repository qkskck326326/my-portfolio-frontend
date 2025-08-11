// src/features/images/api/uploadImage.ts
import { apiClient } from '@/lib/apiClient';
import type { AxiosError } from 'axios';

export async function uploadImageToCdn(file: File): Promise<{ url: string; deleteUrl: string | null }> {
  const fd = new FormData();
  fd.append('image', file);

  try {
    const res = await apiClient.post('/api/images/upload', fd);

    return res.data.data; // { url, deleteUrl }
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    console.error('이미지 업로드 실패:', error);
    const msg =
      error.response?.data?.message ||
      error.message ||
      '이미지 업로드 실패';
    throw new Error(msg);
  }
}
