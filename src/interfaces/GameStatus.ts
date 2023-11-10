export enum StatusType {
    FINISHED = 'Finalizado',
    IN_PROGRESS = 'Em Andamento',
    ABANDONED = 'Abandonado',
    WANT_TO_PLAY = 'Quero Jogar',
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