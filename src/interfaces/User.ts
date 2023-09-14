export interface User {
    Id: number;
    Username: string;
    Email: string;
    Password: string;
    AvatarUrl?: string;
    Bio?: string;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    DeletedAt?: Date;
    IsActive?: boolean;
  }