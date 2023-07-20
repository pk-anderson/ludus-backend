export interface Community {
    id: number;
    id_creator: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    is_active: boolean;
    creator_username: string;
  }