// src/types/common.types.ts

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CommonResponse<T> {
  success: boolean;
  message: string;
  data: T;
}