export interface Comment {
    id: number;
    user_id: number;
    username: string;
    email:string;
    entity_id: number;
    entity_type: CommentType;
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