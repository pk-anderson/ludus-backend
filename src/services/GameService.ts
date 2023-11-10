import { GameStatus, StatusType } from './../interfaces/GameStatus';
import { Game } from './../interfaces/Game';
import { getTwitchAccessTokenOrFetch } from "./TwitchService";
import { 
    getCache,
    saveCache 
} from '../repositories/RedisRepository';
import { 
    listStatusByUserAndType,
    getExistingStatusByUserAndGame
 } from "../repositories/GameStatusRepository";
import { 
    listGamesByFilter,
    listAllGames,
    getGameById,
    listGamesByGameIds
 } from "../igdb/Games";
import { 
    LIST_ENTITY_ERROR,
    FIND_ENTITY_ERROR
 } from "../utils/consts";


async function getGameStatus(userId: number, gameId: number) {
    const status: GameStatus = await getExistingStatusByUserAndGame(userId, gameId)
    return status
}

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

export async function listGamesByStatusService(userId: number, status: StatusType) {
    try { 
        const gameIds = await listStatusByUserAndType(userId, status)
        
        // Se houver filtro, verificar se busca está salva como cache
        const cache = await getCache(`${userId}-${gameIds}`)
        if (cache) {
            return { success: true, 
                statusCode: 200,
                data: JSON.parse(cache)
            };
        }
        // Se não estiver, realizar nova busca
        const twitchToken = await getTwitchAccessTokenOrFetch()   
        
        const data = await listGamesByGameIds(twitchToken.access_token, gameIds)

        // Salvar nova busca como cache
        await saveCache(`${userId}-${gameIds}`, JSON.stringify(data))

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

export async function findGameByIdService(userId: number, gameId: number) {
    try {
        // Verificar se busca está salva como cache
        const cache = await getCache(gameId.toString())
        if (cache) {
            return { success: true, 
                statusCode: 200, 
                data: JSON.parse(cache)
            };
        }

        // Se não estiver, realizar nova busca
        const twitchToken = await getTwitchAccessTokenOrFetch()
        const data: Game = await getGameById(twitchToken.access_token, gameId)

        const status = await getGameStatus(userId, gameId)
        if (status) {
            data.status = status.status
        }

        // Salvar nova busca em cache
        await saveCache(`${gameId}-${status.status}`, JSON.stringify(data))

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