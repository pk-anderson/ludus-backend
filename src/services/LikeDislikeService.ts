import { 
    checkLikeDislikeExists, 
    addLike,
    addDislike,
    removeLikeDislike,
    listUsersWhoLikedEntity,
    listUsersWhoDislikedEntity,
    updateLikeDislike
} from "../repositories/LikesDislikesRepository";
import { getCommentById } from "../repositories/CommentRepository";
import { getCommunityPostById } from "../repositories/CommunityPostRepository";
import { EntityType } from '../interfaces/LikesDislikes';
import {
    CREATE_ENTITY_ERROR,
    FIND_ENTITY_ERROR,
    LIST_ENTITY_ERROR,
    LIKE_SUCCESS,
    REMOVELIKE_SUCCESS,
    DISLIKE_SUCCESS,
    REMOVEDISLIKE_SUCCESS,
    INVALID_ENTITY
} from "../utils/consts";

export async function likeService(
    userId: number,
    entityId: number,
    entityType: EntityType
) {
    try {
        let entity;

        if (entityType === EntityType.COMMENT) {
            entity = await getCommentById(entityId);
        } else if (entityType === EntityType.COMMUNITY_POST) {
            entity = await getCommunityPostById(entityId);
        } else {
            return { success: false, statusCode: 400, error: INVALID_ENTITY};
        }

        if (!entity) {
            return { success: false, statusCode: 404, error: FIND_ENTITY_ERROR};
        }

        const check = await checkLikeDislikeExists(userId, entityId, entityType);
        
        if (check) {
            if (check.is_like === true) {
                await removeLikeDislike(userId, entityId, entityType);
                return { success: true, statusCode: 200, message: REMOVELIKE_SUCCESS };
            } else {
                await updateLikeDislike(check.id, true);
                return { success: true, statusCode: 200, message: LIKE_SUCCESS };
            }
        }
        await addLike(userId, entityId, entityType);
        return { success: true, statusCode: 200, message: LIKE_SUCCESS };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${CREATE_ENTITY_ERROR}:${error}` };
    }
}

export async function dislikeService(
    userId: number,
    entityId: number,
    entityType: EntityType
) {
    try {
        let entity;

        if (entityType === EntityType.COMMENT) {
            entity = await getCommentById(entityId);
        } else if (entityType === EntityType.COMMUNITY_POST) {
            entity = await getCommunityPostById(entityId);
        } else {
            return { success: false, statusCode: 400, error: INVALID_ENTITY};
        }

        if (!entity) {
            return { success: false, statusCode: 404, error: FIND_ENTITY_ERROR};
        }

        const check = await checkLikeDislikeExists(userId, entityId, entityType);
        if (check) {
            if (check.is_like === false) {
                await removeLikeDislike(userId, entityId, entityType);
                return { success: true, statusCode: 200, message: REMOVEDISLIKE_SUCCESS };
            } else {
                await updateLikeDislike(check.id, false);
                return { success: true, statusCode: 200, message: DISLIKE_SUCCESS };
            }
        }

        await addDislike(userId, entityId, entityType);
        return { success: true, statusCode: 200, message: DISLIKE_SUCCESS };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${CREATE_ENTITY_ERROR}:${error}` };
    }
}

export async function listWhoLikedService(
    entityId: number,
    entityType: EntityType
) {
    try {
        const data = await listUsersWhoLikedEntity(entityId, entityType);

        return { success: true, statusCode: 200, data };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${LIST_ENTITY_ERROR}:${error}` };
    }
}

export async function listWhoDislikedService(
    entityId: number,
    entityType: EntityType
) {
    try {
        const data = await listUsersWhoDislikedEntity(entityId, entityType);
        return { success: true, statusCode: 200, data };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${LIST_ENTITY_ERROR}:${error}` };
    }
}
