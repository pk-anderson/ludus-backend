export interface Community {
    id: number;
    id_creator: number;
    name: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    is_active: boolean;
    creator_username: string;
  }