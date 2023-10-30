export interface Rating {
    id?: number;
    user_id: number;
    game_id: number;
    rating: number;
    review?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}