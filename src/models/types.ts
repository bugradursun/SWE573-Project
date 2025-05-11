// models/types.ts
// These interfaces can be used across your application

// User related interfaces
export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface GetMeResponse {
  email:string;
  username:string;
  age:string;
  profession:string;
  boards:any[]; // TODO: change this
  contributions:any[]; // TODO: change this
}


export interface Board {
  id:number;
  label:string;
  title:string;
  content:string;
  createdBy:string;
  description:string;
  createdAt?:any;
  updatedAt?:any;
}

// Post related interfaces
export interface Post {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  comments: number;
  shares: number;
  user?: UserBasic;
}

// Simplified user object for embedding in posts, comments, etc.
export interface UserBasic {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

// Comment interface
export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: UserBasic;
}

// API response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
