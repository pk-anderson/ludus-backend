import { 
    saveUserLibraryItem,
    updateUserLibraryItem,
    deleteUserLibraryItem,
    getUserLibraryById,
    getUserLibraryItemByUserAndGame,
 } from "../repositories/GameLibraryRepository";
import { 
    ADD_TO_LIBRARY_SUCCESS,
    UPDATE_TO_LIBRARY_SUCCESS,
    DELETE_FROM_LIBRARY_SUCCESS,
    ADD_TO_LIBRARY_ERROR,
    CREATE_ENTITY_ERROR,
    FIND_ENTITY_ERROR,
    DELETE_ENTITY_ERROR
 } from "../utils/consts";
import { checkGameLibraryAchievement } from "../achievements/Game";

 export async function addUserLibraryItem(userId: number, gameId: number) {
     try {
        const libraryItem = await getUserLibraryItemByUserAndGame(userId, gameId);
        if (libraryItem) {
            // Se o jogo está na biblioteca, verificar se está deletado
            if (libraryItem.deleted_at) {
                // Se estiver deletado, restaurar o item na biblioteca
                const total = await updateUserLibraryItem(libraryItem.id, userId);
                await checkGameLibraryAchievement(userId, total)
                return { success: true, 
                    statusCode: 200,
                    message: UPDATE_TO_LIBRARY_SUCCESS,
                  };
            } else {
                // Se não estiver deletado, informar que o jogo já está na biblioteca
                return { success: false, 
                    statusCode: 400,
                    error: ADD_TO_LIBRARY_ERROR,
                  };
            }
        }
        const data  = await saveUserLibraryItem(userId, gameId);
        await checkGameLibraryAchievement(userId, data.total_games_added)
        return { success: true, 
            statusCode: 200,
            message: ADD_TO_LIBRARY_SUCCESS,
          };
     } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${CREATE_ENTITY_ERROR}:${error}`
          };
     }
 }

 export async function removeUserLibraryItem(userId: number, gameId: number) {
     try {
         const libraryItem = await getUserLibraryItemByUserAndGame(userId, gameId)
         if (!libraryItem) {
            return { success: false, 
                statusCode: 404,
                message: FIND_ENTITY_ERROR,
              };
         }
         await deleteUserLibraryItem(libraryItem.id)
         return { success: true, 
            statusCode: 200,
            message: DELETE_FROM_LIBRARY_SUCCESS,
          };
     } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${DELETE_ENTITY_ERROR}:${error}`
          };
     }
 }