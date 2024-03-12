import { Game } from "./Game";

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

export interface Achievement {
  id: number;
  name: string;
  description: string;
  points_rewarded: number;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  achieved_at: Date;
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
  games: Game[];
  achievements: {
    achievements: Achievement[];
    total_points: number;
  };
}