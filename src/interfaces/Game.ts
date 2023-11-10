export interface Cover {
    id: number;
    url: string;
  }
  
export interface Genre {
  id: number;
  name: string;
}

export interface PlayerPerspective {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  category: number;
  cover: Cover;
  first_release_date: number;
  genres: Genre[];
  name: string;
  status: string;
  player_perspectives: PlayerPerspective[];
  summary: string;
}