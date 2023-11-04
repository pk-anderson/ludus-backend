export interface CommunityPost {
    id?: number;
    user_id: number;
    community_id: number;
    content: string;
    image?: Buffer; 
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}