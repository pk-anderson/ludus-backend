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