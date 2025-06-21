// src/features/user/types/user.types.ts
export interface UserProfile {
  nickname: string;
  userThumbnail: string;
  email: string; 
  github: string;
  introduce: string;
  birth: string; // ISO date string: 'yyyy-MM-dd'
}