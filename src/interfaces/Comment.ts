export interface Comment {
    id: number;
    user_id: number;
    game_id: number;
    content: string;
    like_count?: number;
    dislike_count?: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export enum CommentOrderBy {
    RECENT = 1,
    OLDEST = 2,
    MOST_LIKED = 3,
    MOST_DISLIKED = 4,
  }