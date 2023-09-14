export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    profile_pic?: Uint8Array;
    bio?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    is_active?: boolean;
  }

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  password: string;
  bio?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  is_active?: boolean;
  profile_pic?: string;
}