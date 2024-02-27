import * as dotenv from 'dotenv';
import { Game } from '../interfaces/Game';
import { ENV_VARIABLE_NOT_CONFIGURED } from '../utils/consts';
dotenv.config();

export async function listGamesByFilter(token: string, text: string, limit: number, page: number): Promise<Game[]> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  if (!clientId) {
    throw new Error(ENV_VARIABLE_NOT_CONFIGURED);
  }
  const offset = (page - 1) * limit;
  try {
      const response = await fetch('https://api.igdb.com/v4/games', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Client-ID': clientId,
            'Authorization': `Bearer ${token}`,
          },
          body: `fields name, cover.url, category, first_release_date, genres.name, player_perspectives.name, summary; search ${text}; limit ${limit}; offset ${offset};` 
        });

    if (response.ok) {
      const data: Game[] = await response.json();
        
          data.forEach(game => {
              if (game.cover && game.cover.url) {
                  game.cover.url = game.cover.url.replace('t_thumb', 't_cover_big');
              }
          });
          return data;
    } else {
      throw new Error(`${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}


export async function listAllGames(token: string, limit: number, page: number): Promise<Game[]> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  if (!clientId) {
    throw new Error(ENV_VARIABLE_NOT_CONFIGURED);
  }
  const offset = (page - 1) * limit;
  try {
      const response = await fetch('https://api.igdb.com/v4/games', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Client-ID': clientId,
            'Authorization': `Bearer ${token}`,
          },
          body: `fields name, cover.url, category, first_release_date, genres.name, player_perspectives.name, summary; limit ${limit}; offset ${offset};` 
        });

    if (response.ok) {
      const data: Game[] = await response.json();
          
          data.forEach(game => {
              if (game.cover && game.cover.url) {
                  game.cover.url = game.cover.url.replace('t_thumb', 't_cover_big');
              }
          });
          return data;
      return data;
    } else {
      throw new Error(`${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}

  export async function listGamesByGameIds(token: string, gameIds: string): Promise<Game[]> {
    const clientId = process.env.TWITCH_CLIENT_ID;
    if (!clientId) {
      throw new Error(ENV_VARIABLE_NOT_CONFIGURED);
    }
    try {
        const response = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Client-ID': clientId,
              'Authorization': `Bearer ${token}`,
            },
            body: `fields name, cover.url, category, first_release_date, genres.name, player_perspectives.name, summary; where id = (${gameIds});` 
          });
  
      if (response.ok) {
        const data: Game[] = await response.json();
            // Modificando os URLs das capas
            data.forEach(game => {
                if (game.cover && game.cover.url) {
                    game.cover.url = game.cover.url.replace('t_thumb', 't_cover_big');
                }
            });
            return data;
      } else {
        throw new Error(`${response.statusText}`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  export async function getGameById(token: string, id: number): Promise<Game> {
    const clientId = process.env.TWITCH_CLIENT_ID;
    if (!clientId) {
      throw new Error(ENV_VARIABLE_NOT_CONFIGURED);
    }
  
    try {
        const response = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Client-ID': clientId,
              'Authorization': `Bearer ${token}`,
            },
            body: `fields name, cover.url, category, first_release_date, genres.name, player_perspectives.name, summary; where id = ${id};` 
          });
      if (response.ok) {
        const data: Game[] = await response.json();
            if (data.length === 1) {
                if (data[0].cover && data[0].cover.url) {
                    data[0].cover.url = data[0].cover.url.replace('t_thumb', 't_cover_big');
                }
              }
            return data[0];
      } else {
        throw new Error(`${response.statusText}`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }