import { Game } from './../interfaces/Game';
import { getTwitchAccessTokenOrFetch } from "./TwitchService";
import { 
    getCache,
    saveCache 
} from '../repositories/RedisRepository';
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
        // Se houver filtro, verificar se busca está salva como cache
        const cache = await getCache(`${text}-${limit}-${page}`)
        if (cache) {
            return { success: true, 
                statusCode: 200,
                data: JSON.parse(cache)
            };
        }
        // Se não estiver, realizar nova busca
        const twitchToken = await getTwitchAccessTokenOrFetch()   
        let data: Game[]
        if (text === undefined) {
            data = await listAllGames(twitchToken.access_token, limit, page)
        } else {
            const filter = `"${text}"`
            data = await listGamesByFilter(twitchToken.access_token, filter, limit, page)
        }
        
        // Salvar nova busca como cache
        await saveCache(`${text}-${limit}-${page}`, JSON.stringify(data))

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
        // Verificar se busca está salva como cache
        const cache = await getCache(id.toString())
        if (cache) {
            return { success: true, 
                statusCode: 200, 
                data: JSON.parse(cache)
            };
        }

        // Se não estiver, realizar nova busca
        const twitchToken = await getTwitchAccessTokenOrFetch()
        const data: Game = await getGameById(twitchToken.access_token, id)

        // Salvar nova busca em cache
        await saveCache(id.toString(), JSON.stringify(data))

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