export interface Comment {
    id: number;
    user_id: number;
    entity_id: number;
    content: string;
    like_count?: number;
    dislike_count?: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export enum CommentType {
    GAME = 'game',
    POST = 'post'
}