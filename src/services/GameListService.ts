import { GameList, GameListItem } from './../interfaces/GameList';
import { 
    saveGameList,
    updateGameList,
    getUserGameLists,
    getGameListById,
    deleteGameList,
    saveGameListItem,
    getGameListItem,
    updateGameListItem,
    removeGameListItem,
    getExistingGameListItem
 } from '../repositories/GameListRepository';
import { listGamesByGameIds } from '../igdb/Games';
import { getTwitchAccessTokenOrFetch } from './TwitchService';
import { 
    INVALID_TITLE_ERROR,
    CREATE_ENTITY_ERROR,
    FIND_ENTITY_ERROR,
    INVALID_ITEM_ERROR,
    UPDATE_ENTITY_ERROR,
    LIST_ENTITY_ERROR,
    UNAUTHORIZED_ACCESS
} from '../utils/consts';
import { convertByteaToBase64 } from '../utils/encryptor';

// Game List

export async function createListService(gameList: GameList) {
    try {

        if ((!gameList.title || gameList.title.trim() === '')) {
            return { success: false, 
                statusCode: 400,
                error: INVALID_TITLE_ERROR
            };
        }

        const data = await saveGameList(gameList)
        return { success: true, 
            statusCode: 200,
            data
        };

    } catch (error) {
        return { success: false, 
        statusCode: 500, 
        error: `${CREATE_ENTITY_ERROR}:${error}`
      };
    }
}

export async function getAllListsService(userId: number) {
    try {
        const data = await getUserGameLists(userId)

        // Transformar as imagens em urls base64
        for (const item of data) {
            item.cover_image = convertByteaToBase64(item.cover_image)
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

export async function getGameListService(listId: number) {
    try {
        const data = await getGameListById(listId)
        if (!data) {
            return { success: false, 
                statusCode: 404,
                error: FIND_ENTITY_ERROR
            };
        }

        // Transformar as imagem em url base64
        data.cover_image = convertByteaToBase64(data.cover_image)

        // buscar jogos
        const twitchToken = await getTwitchAccessTokenOrFetch()   
        if (data.game_ids.join(', ') !== '') {
            data.games = await listGamesByGameIds(twitchToken.access_token, data.game_ids.join(', '))
        }

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

export async function updateListService(gameList: GameList) {
    try {
        // verificar se lista existe
        const list = await getGameListById(gameList.id)
        if (!list) {
            return { success: false, 
                statusCode: 404,
                error: FIND_ENTITY_ERROR
            };
        }

        const data = await updateGameList(gameList)
        return { success: true, 
            statusCode: 200,
            data
        };

    } catch (error) {
        return { success: false, 
        statusCode: 500, 
        error: `${UPDATE_ENTITY_ERROR}:${error}`
      };
    }
}

export async function deleteListService(listId: number, userId: number) {
    try {
        // verificar se lista existe
        const list = await getGameListById(listId)
        if (!list) {
            return { success: false, 
                statusCode: 404,
                error: FIND_ENTITY_ERROR
            };
        }

        if (list.user_id !== userId) {
            return { success: false, 
                statusCode: 403,
                error: UNAUTHORIZED_ACCESS
            };
        }

        const data = await deleteGameList(listId)
        return { success: true, 
            statusCode: 200,
            data
        };

    } catch (error) {
        return { success: false, 
        statusCode: 500, 
        error: `${UPDATE_ENTITY_ERROR}:${error}`
      };
    }
}

// Game List Item

export async function addGameItemService(item: GameListItem) {
    try {
        // verificar se lista existe
        const list = await getGameListById(item.list_id)
        if (!list) {
            return { success: false, 
                statusCode: 404,
                error: FIND_ENTITY_ERROR
            };
        }

        // verificar se jogo já foi adicionado
        const gameItem: GameListItem = await getGameListItem(item.user_id, item.game_id, item.list_id)

        if (gameItem) {
            if (gameItem.deleted_at) {
                const data = await updateGameListItem(gameItem.id)
                return { success: true, 
                    statusCode: 200,
                    data
                };
            } else {
                return { success: false, 
                    statusCode: 400,
                    error: INVALID_ITEM_ERROR
                };
            }
        }

        const data = await saveGameListItem(item)
        return { success: true, 
            statusCode: 200,
            data
        };

    } catch (error) {
        return { success: false, 
        statusCode: 500, 
        error: `${CREATE_ENTITY_ERROR}:${error}`
      };
    }
}


export async function removeGameItemService(item: GameListItem) {
    try {
        // verificar se lista existe
        const list = await getGameListById(item.list_id)
        if (!list) {
            return { success: false, 
                statusCode: 404,
                error: FIND_ENTITY_ERROR
            };
        }

        // verificar se jogo já foi adicionado
        const gameItem: GameListItem = await getExistingGameListItem(item.user_id, item.game_id, item.list_id)

        if (!gameItem) {
            return { success: false, 
                statusCode: 404,
                error: FIND_ENTITY_ERROR
            };
        }

        const data = await removeGameListItem(gameItem.id)
        return { success: true, 
            statusCode: 200,
            data
        };

    } catch (error) {
        return { success: false, 
        statusCode: 500, 
        error: `${CREATE_ENTITY_ERROR}:${error}`
      };
    }
}