import { 
    checkLikeDislikeExists, 
    addLike,
    addDislike,
    removeLike,
    removeDislike,
    listUsersWhoLikedComment,
    listUsersWhoDislikedComment
} from "../repositories/CommentLikeRepository";
import { getCommentById } from "../repositories/CommentRepository";
import { 
    COMMENT_LIKE_SUCCESS,
    COMMENT_REMOVELIKE_SUCCESS,
    COMMENT_DISLIKE_SUCCESS,
    COMMENT_REMOVEDISLIKE_SUCCESS,
    CREATE_ENTITY_ERROR,
    FIND_ENTITY_ERROR,
    LIST_ENTITY_ERROR
 } from "../utils/consts";

export async function likeService(userId: number, commentId: number) {
    try {
        // Verificar se já existe like ou dislike
        const { hasLiked, hasDisliked } = await checkLikeDislikeExists(userId, commentId)
        // Se já existir like, remover like e finalizar
        if (hasLiked) {
            await removeLike(userId, commentId)
            return { success: true, 
                statusCode: 200, 
                message: COMMENT_REMOVELIKE_SUCCESS
              };
        }
        // Se já existir dislike, remover dislike e criar like
        if (hasDisliked) {
            await removeDislike(userId, commentId)
        }
        await addLike(userId, commentId)
            return { success: true, 
                statusCode: 200, 
                message: COMMENT_LIKE_SUCCESS
              };
    } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${CREATE_ENTITY_ERROR}:${error}`
          };
    }
}

export async function dislikeService(userId: number, commentId: number) {
    try {
        // Verificar se já existe like ou dislike
        const { hasLiked, hasDisliked } = await checkLikeDislikeExists(userId, commentId)
        // Se já existir dislike, remover dislike e finalizar
        if (hasDisliked) {
            await removeDislike(userId, commentId)
            return { success: true, 
                statusCode: 200, 
                message: COMMENT_REMOVEDISLIKE_SUCCESS
              };
        }
        // Se já existir like, remover like e criar dislike
        if (hasLiked) {
            await removeLike(userId, commentId)
        }
        await addDislike(userId, commentId)
            return { success: true, 
                statusCode: 200, 
                message: COMMENT_DISLIKE_SUCCESS
              };
    } catch (error) {
        return { success: false, 
            statusCode: 500, 
            error: `${CREATE_ENTITY_ERROR}:${error}`
          };
    }
}

export async function listWhoLikedService(commentId: number) {
    try {
        const comment = await getCommentById(commentId)
        if (!comment) {
            return { success: false, 
                statusCode: 404, 
                error: `${FIND_ENTITY_ERROR}`
              };
        }

        const data = await listUsersWhoLikedComment(commentId)
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

export async function listWhoDislikedService(commentId: number) {
    try {
        const comment = await getCommentById(commentId)
        if (!comment) {
            return { success: false, 
                statusCode: 404, 
                error: `${FIND_ENTITY_ERROR}`
              };
        }

        const data = await listUsersWhoDislikedComment(commentId)
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