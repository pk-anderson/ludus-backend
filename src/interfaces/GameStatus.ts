export enum StatusType {
    FINISHED = 'Finished',
    IN_PROGRESS = 'In Progress',
    ABANDONED = 'Abandoned',
    WANT_TO_PLAY = 'Want to Play',
    FAVORITE = 'Favorite',
    NO_STATUS = 'No Status'
}

export interface GameStatus {
    id: number; 
    user_id: number;
    game_id: number;
    status: StatusType;
    created_at?: Date; 
    updated_at?: Date; 
    deleted_at?: Date; 
}