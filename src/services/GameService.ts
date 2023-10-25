import { getTwitchAccessTokenOrFetch } from "./TwitchService";
import { 
    listGames,
    getGameById
 } from "../igdb/Games";
import { 
    LIST_ENTITY_ERROR,
    FIND_ENTITY_ERROR
 } from "../utils/consts";

export async function listGamesService(text: string) {
    try {
        const twitchToken = await getTwitchAccessTokenOrFetch()
        text = `"${text}"`
        const data = await listGames(twitchToken.access_token, text)

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