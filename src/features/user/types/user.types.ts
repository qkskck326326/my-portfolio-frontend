// src/features/user/types/user.types.ts
export interface UserProfileEditRequest {
  nickname: string;
  userThumbnail: string;
  github: string;
  introduce: string;
  birth: string; // ISO date string: 'yyyy-MM-dd'
}

export interface UserProfile {
  userThumbnail: string;
  nickname: string;
  slug: string;
  email: string;
  github?: string;
  introduce?: string;
  tags: Tag[];
}

export interface Tag{
  name: string;
  amount: number;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  userThumbnail?: string;
  github?: string;
  introduce?: string;
  birth?: string;
}