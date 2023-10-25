import * as dotenv from 'dotenv';
import { Game } from '../interfaces/Game';
import { ENV_VARIABLE_NOT_CONFIGURED } from '../utils/consts';
dotenv.config();


export async function listGames(token: string, text: string): Promise<Game[]> {
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
            body: `fields name, cover.url, category, first_release_date, genres.name, player_perspectives.name, summary; search ${text};` 
          });
  
      if (response.ok) {
        const data: Game[] = await response.json();
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
        const data: Game = await response.json();
        return data;
      } else {
        throw new Error(`${response.statusText}`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }