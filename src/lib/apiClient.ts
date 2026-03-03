// src/lib/apiClient.ts
import axios, { AxiosHeaders } from 'axios';
import { reissueApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/stores/authStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터를 사용하여 Authorization 헤더에 Access 토큰 추가
apiClient.interceptors.request.use((config) => {
  // AxiosHeaders 객체로 변환
  const h = AxiosHeaders.from(config.headers);

  // 토큰 주입
  const token = localStorage.getItem('accessToken');
  if (token) h.set('Authorization', `Bearer ${token}`);

  // FormData면 Content-Type 제거 (브라우저가 boundary 자동 설정)
  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
  if (isFormData) {
    h.delete('Content-Type');
    h.delete('content-type');
  }

  config.headers = h; // AxiosHeaders로 되돌리기
  return config;
});

// 응답 인터셉터를 사용하여 401 에러(토큰 만료) 처리 및 Access 토큰 재발급
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.error('API 요청 실패');
    // 실패했던 원래 요청 객체 저장
    const originalRequest = error.config;

    // 재발급 요청 자체에서 에러났다면 인터셉터 건너뜀
    if (originalRequest.url?.includes('/api/auth/reissue')) {
      console.error('Access 토큰 재발급 요청에서 에러 발생');
      return Promise.reject(error);
    }

    // 401 에러가 발생했을때 (Access 토큰 만료 등) 재발급 시도
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정
      console.warn('Access 토큰 만료됨, 재발급 시도');
      // Access 토큰 재발급 요청
      try {
        // 서버에서 Access 토큰 재발급 API 호출
        console.log('Access 토큰 재발급 요청');
        const newAccessToken = await reissueApi();
        console.log('재발급된 Access 토큰:', newAccessToken);

        // 재발급된 Access 토큰을 로컬 스토리지에 저장
        localStorage.setItem('accessToken', newAccessToken);

        // 원래 요청의 Authorization 헤더에 새 Access 토큰 설정
        if (originalRequest.headers && typeof originalRequest.headers === 'object') {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        } else {
          originalRequest.headers = { Authorization: `Bearer ${newAccessToken}` };
        }

        return apiClient(originalRequest); // 재요청
      } catch (reissueError) {
        // Access 토큰 재발급 실패 처리시
        // 로그아웃 처리
        useAuthStore.getState().logout(); // 로그아웃 처리 (상태 초기화 + 토큰 삭제)
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  },
);
