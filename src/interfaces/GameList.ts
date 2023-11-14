export interface GameList {
    id: number;
    user_id: number;
    title: string;
    game_count: number;
    game_ids: number[];
    description?: string;
    cover_image?: Uint8Array;
    created_at: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}

export interface GameListItem {
    id: number;
    user_id: number;
    list_id: number;
    game_id: number;
    created_at: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}
