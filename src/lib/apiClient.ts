// src/lib/apiClient.ts
import axios from 'axios';
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
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터를 사용하여 401 에러(토큰 만료) 처리 및 Access 토큰 재발급
apiClient.interceptors.response.use(
  res => res,
  async error => {
    // 실패했던 원래 요청 객체 저장
    const originalRequest = error.config;

    // 401 에러가 발생하고, originalRequest에 _retry 속성이 없을 때만 재시도
    // _retry 속성은 재귀 호출 방지를 위해 사용
    if (error.response?.status === 401 && !originalRequest._retry) {
      // _retry 속성 추가 ( 재귀 호출 방지 )
      originalRequest._retry = true;

      // Access 토큰 재발급 요청
      try {
        // 서버에서 Access 토큰 재발급 API 호출
        const newAccessToken = await reissueApi();

        // 재발급된 Access 토큰을 로컬 스토리지에 저장
        localStorage.setItem('accessToken', newAccessToken);

        // 원래 요청의 Authorization 헤더에 새 Access 토큰 설정
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // 재요청
      } catch (reissueError) { // Access 토큰 재발급 실패 처리시
        // localStorage에서 Access 토큰 제거 & 로그아웃 처리 + 로그인 페이지로 리다이렉트
        localStorage.removeItem('accessToken');
        
        useAuthStore.getState().logout(); // 로그아웃 처리 (상태 초기화 + 토큰 삭제)
        window.location.href = '/login';
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  }
);