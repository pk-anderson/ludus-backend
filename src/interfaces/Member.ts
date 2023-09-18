export interface Member {
    community_member_id: number;
    user_id: number;
    username: string;
    email: string;
    profile_pic?: Uint8Array;
    bio?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
  }