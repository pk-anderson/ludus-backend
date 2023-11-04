export interface CommunityPost {
    id: number;
    user_id: number;
    community_id: number;
    content: string;
    image?: Uint8Array; 
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface CommunityPostResponse {
    id: number;
    user_id: number;
    community_id: number;
    content: string;
    image?: string; 
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}