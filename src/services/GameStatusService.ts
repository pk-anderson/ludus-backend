import { GameStatus, StatusType } from "../interfaces/GameStatus";
import { 
    saveStatus,
    getStatusByUserAndGame,
    updateStatus,
    getStatusById,
    deleteStatus
 } from "../repositories/GameStatusRepository";
 import { 
     CREATE_ENTITY_ERROR,
     FIND_ENTITY_ERROR,
     UPDATE_ENTITY_ERROR,
     DELETE_ENTITY_ERROR
     } from "../utils/consts";

export async function createStatusService(status: GameStatus) {
    try {
        const exists: GameStatus = await getStatusByUserAndGame(status.user_id, status.game_id)

        if (exists) {
            const data = updateStatus(exists.id, status.status)
            return { success: true, 
                statusCode: 200, 
                data
            };
        }

        const data = await saveStatus(status)
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

export async function updateStatusService(statusId: number, statusType: StatusType) {
    try {
        const exists: GameStatus = await getStatusById(statusId)

        if (!exists) {
            return { success: false, 
                statusCode: 404, 
                message: FIND_ENTITY_ERROR
            }
        }

        const data = await updateStatus(exists.id, statusType)
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

export async function deleteStatusService(statusId: number) {
    try {
        const exists: GameStatus = await getStatusById(statusId)

        if (!exists) {
            return { success: false, 
                statusCode: 404, 
                message: FIND_ENTITY_ERROR
            }
        }

        const data = await deleteStatus(statusId)
        return { success: true, 
            statusCode: 200, 
            data
        };

    } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${DELETE_ENTITY_ERROR}:${error}`
        };
    }
}
