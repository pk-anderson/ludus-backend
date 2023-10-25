import { Game } from './../interfaces/Game';
import { getTwitchAccessTokenOrFetch } from "./TwitchService";
import { 
    listGamesByFilter,
    listAllGames,
    getGameById
 } from "../igdb/Games";
import { 
    LIST_ENTITY_ERROR,
    FIND_ENTITY_ERROR
 } from "../utils/consts";

export async function listGamesService(text: string, limit: number, page: number) {
    try {
        const twitchToken = await getTwitchAccessTokenOrFetch()
        let data: Game[] 
        if (text === undefined) {
            data = await listAllGames(twitchToken.access_token, limit, page)
        } else {
            text = `"${text}"`
            data = await listGamesByFilter(twitchToken.access_token, text, limit, page)
        }

        return { success: true, 
            statusCode: 200, 
            data
        };
    } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${LIST_ENTITY_ERROR}:${error}`
          };
    }
}

export async function findGameByIdService(id: number) {
    try {
        const twitchToken = await getTwitchAccessTokenOrFetch()

        const data = await getGameById(twitchToken.access_token, id)

        return { success: true, 
            statusCode: 200, 
            data
        };
    } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${FIND_ENTITY_ERROR}:${error}`
          };
    }
}