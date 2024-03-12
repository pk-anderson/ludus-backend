import { Rating } from "../interfaces/Rating";
import { 
    getRatingByUserAndGame,
    updateRating,
    saveRating,
    getRatingById,
    getRatingsByUser,
    getRatingsByGame,
    deleteRating
 } from "../repositories/RatingRepository";
 import { 
     CREATE_ENTITY_ERROR,
     LIST_ENTITY_ERROR,
     FIND_ENTITY_ERROR,
     DELETE_ENTITY_ERROR,
     UNAUTHORIZED_ACCESS,
     DELETE_RATING_SUCCESS
 } from "../utils/consts";

export async function saveService(rating: Rating) {
    try {
        const existingRating = await getRatingByUserAndGame(rating.user_id, rating.game_id);

        if (existingRating) {
           const updatedRating = await updateRating(existingRating.id, rating);
           return { success: true, 
               statusCode: 200,
               data: updatedRating
             };
        } 
        const newRating = await saveRating(rating);
        return { success: true, 
            statusCode: 200,
            data: newRating
          };
        
    } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${CREATE_ENTITY_ERROR}:${error}`
          };
    }
}

export async function findService(userId: number, gameId: number) {
    try {
        const data: Rating = await getRatingByUserAndGame(userId, gameId);

        if (!data || data.deleted_at !== null) {
            return { success: true, 
                statusCode: 200,
                data: {} as Rating
              };
        } else {
            return { success: true, 
                statusCode: 200,
                data
              };
        }
    } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${FIND_ENTITY_ERROR}:${error}`
          };
    }
}

export async function findByIdService(id: number) {
    try {
        const data: Rating = await getRatingById(id);

        if (!data || data.deleted_at !== null) {
            return { success: true, 
                statusCode: 200,
                data: {} as Rating
              };
        } else {
            return { success: true, 
                statusCode: 200,
                data
              };
        }
    } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${FIND_ENTITY_ERROR}:${error}`
          };
    }
}

export async function listByUserService(userId: number) {
    try {
        const data: Rating[] = await getRatingsByUser(userId);

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

export async function listByGameService(gameId: number) {
    try {
        const data: Rating[] = await getRatingsByGame(gameId);

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

export async function deleteService(id: number, userId: number) {
    try {
        const rating: Rating = await getRatingById(id)

      if (!rating || rating.deleted_at !== null) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR
        };
      }
      if (rating.user_id !== userId ) {
        return { success: false, 
          statusCode: 403, 
          error: UNAUTHORIZED_ACCESS
        };
      }

      await deleteRating(id);

      return { success: true, 
          statusCode: 200,
          message: DELETE_RATING_SUCCESS,
        };

    } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${DELETE_ENTITY_ERROR}:${error}`
          };
    }
}
