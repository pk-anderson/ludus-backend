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
import { listUserLibrary } from '../repositories/GameLibraryRepository';
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
        
        // Se houver filtro, verificar se a busca está salva como cache
        const cache = await getCache(`${text}-${limit}-${page}`);
        if (cache) {
            return {
                success: true,
                statusCode: 200,
                data: JSON.parse(cache)
            };
        }
        
        // Se não estiver, realizar uma nova busca
        const twitchToken = await getTwitchAccessTokenOrFetch();
        let data: Game[]
        if (text === undefined) {
            data = await listAllGames(twitchToken.access_token, limit, page);
        } else {
         
            data = await listGamesByFilter(twitchToken.access_token, text, limit, page);
        }
        
        // Salvar nova busca como cache
        await saveCache(`${text}-${limit}-${page}`, JSON.stringify(data));

        return {
            success: true,
            statusCode: 200,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: `${LIST_ENTITY_ERROR}:${error}`
        };
    }
}



export async function listGamesByStatusService(userId: number, status: StatusType) {
    try { 
        const gameIds = await listStatusByUserAndType(userId, status)
        
        // Verificar se busca está salva como cache
        const cache = await getCache(`${userId}-${gameIds}`)
        if (cache) {
            return { success: true, 
                statusCode: 200,
                data: JSON.parse(cache)
            };
        }
        // Se não estiver, realizar nova busca
        const twitchToken = await getTwitchAccessTokenOrFetch()   
        let data: Game[] = []
        if (gameIds !== '') {
            data = await listGamesByGameIds(twitchToken.access_token, gameIds)
        }

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

export async function listGamesByLibrary(userId: number) {
    try {
        const gameIds = await listUserLibrary(userId)
        // Verificar se busca está salva como cache
        const cache = await getCache(`${userId}-${gameIds}`)
        if (cache) {
            return { success: true, 
                statusCode: 200,
                data: JSON.parse(cache)
            };
        }
        // Se não estiver, realizar nova busca
        const twitchToken = await getTwitchAccessTokenOrFetch()   
        
        let data: Game[] = []
        if (gameIds !== '') {
            data = await listGamesByGameIds(twitchToken.access_token, gameIds)
        }

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
        const status = await getGameStatus(userId, gameId);

        // Verificar se busca está salva como cache
        const cacheKey = `${gameId}-${status?.status || StatusType.NO_STATUS}`;
        const cache = await getCache(cacheKey);

        if (cache) {
            return {
                success: true,
                statusCode: 200,
                data: JSON.parse(cache),
            };
        }

        // Se não estiver, realizar nova busca
        const twitchToken = await getTwitchAccessTokenOrFetch();
        let data: Game = await getGameById(twitchToken.access_token, gameId);

        if (status) {
            // Adicionar o status ao jogo na resposta
            data = {
                ...data,
                status: status?.status || StatusType.NO_STATUS,
            };
        }

        // Salvar nova busca em cache
        await saveCache(cacheKey, JSON.stringify(data));

        return {
            success: true,
            statusCode: 200,
            data,
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: `${FIND_ENTITY_ERROR}:${error}`,
        };
    }
}
