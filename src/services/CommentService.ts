import { EntityType } from './../interfaces/LikesDislikes';
import { Comment } from "../interfaces/Comment";
import { ListOrderBy } from './../utils/listOrder';
import { CommentType } from '../interfaces/Comment';
import { 
    postComment,
    updateComment,
    getCommentById,
    listCommentsByUserId,
    listCommentsByEntityId,
    deleteComment
} from "../repositories/CommentRepository";
import { findGameByIdService } from "./GameService";
import { getCommunityPostById } from "../repositories/CommunityPostRepository";
import { 
    postReply,
    listRepliesByCommentId
 } from "../repositories/CommentReplyRepository";
import { 
    CREATE_ENTITY_ERROR, 
    FIND_ENTITY_ERROR,
    UPDATE_ENTITY_ERROR,
    LIST_ENTITY_ERROR,
    UNAUTHORIZED_ACCESS,
    DELETE_COMMENT_SUCCESS,
    DELETE_ENTITY_ERROR,
    NO_CONTENT_ERROR,
    INVALID_TYPE_ERROR
} from "../utils/consts";

export async function createService(comment: Comment, entityType: CommentType) {
    try {
        if (!comment.content || comment.content === '') {
            return { success: false, statusCode: 400, error: NO_CONTENT_ERROR };
        }

        if (entityType === CommentType.GAME) {
          const response = await findGameByIdService(comment.entity_id)
          if (response.success === false) {
            return { success: false, statusCode: 404, error: FIND_ENTITY_ERROR };
          }
        } else if (entityType === CommentType.POST) {
          const response = await getCommunityPostById(comment.entity_id)
          if (!response) {
            return { success: false, statusCode: 404, error: FIND_ENTITY_ERROR };
          }
        } else {
          return { success: false, statusCode: 400, error: INVALID_TYPE_ERROR };
        }

        const data: Comment = await postComment(comment, entityType);

        return { success: true, statusCode: 200, data };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${CREATE_ENTITY_ERROR}:${error}` };
    }
}

export async function updateService(commentId: number, userId: number, content: string) {
    try {
        const comment = await getCommentById(commentId);

        if (!comment) {
            return { success: false, statusCode: 404, error: FIND_ENTITY_ERROR };
        }

        if (comment.user_id !== userId) {
            return { success: false, statusCode: 403, error: UNAUTHORIZED_ACCESS };
        }

        if (!content || content === '') {
            return { success: false, statusCode: 400, error: NO_CONTENT_ERROR };
        }

        const updatedComment: Comment = await updateComment(commentId, content);

        return { success: true, statusCode: 200, data: updatedComment };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${UPDATE_ENTITY_ERROR}:${error}` };
    }
}

export async function listByUserService(userId: number, entityType: CommentType, orderBy: ListOrderBy) {
    try {
      if (entityType !== CommentType.GAME && entityType !== CommentType.POST ) {
        return { success: false, statusCode: 400, error: INVALID_TYPE_ERROR };
      }
        const data: Comment[] = await listCommentsByUserId(userId, entityType, orderBy);

        return { success: true, statusCode: 200, data };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${LIST_ENTITY_ERROR}:${error}` };
    }
}

export async function listByEntityService(entityId: number, entityType: CommentType, orderBy: ListOrderBy) {
    try {
        if (entityType !== CommentType.GAME && entityType !== CommentType.POST ) {
          return { success: false, statusCode: 400, error: INVALID_TYPE_ERROR };
        }
        const data: Comment[] = await listCommentsByEntityId(entityId, entityType, orderBy);

        return { success: true, statusCode: 200, data };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${LIST_ENTITY_ERROR}:${error}` };
    }
}

export async function deleteService(commentId: number, userId: number) {
    try {
        const comment: Comment = await getCommentById(commentId);

        if (!comment) {
            return { success: false, statusCode: 404, error: FIND_ENTITY_ERROR };
        }

        if (comment.user_id !== userId) {
            return { success: false, statusCode: 403, error: UNAUTHORIZED_ACCESS };
        }

        await deleteComment(commentId);

        return { success: true, statusCode: 200, message: DELETE_COMMENT_SUCCESS };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${DELETE_ENTITY_ERROR}:${error}` };
    }
}

export async function postReplyService(comment: Comment, originalCommentId: number) {
    try {
        if (!comment.content || comment.content === '') {
            return { success: false, statusCode: 400, error: NO_CONTENT_ERROR };
        }

        const originalComment: Comment = await getCommentById(originalCommentId) 

        if (!originalComment) {
            return { success: false, statusCode: 404, error: FIND_ENTITY_ERROR };
        }
        comment.entity_id = originalComment.entity_id

        const newComment: Comment = await postComment(comment, originalComment.entity_type);

        const data = await postReply(originalCommentId, newComment.id)

        return { success: true, statusCode: 200, data };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${CREATE_ENTITY_ERROR}:${error}` };
    }
}

export async function listRepliesService(originalComment: number, orderBy: ListOrderBy) {
    try {
        const comment = await getCommentById(originalComment) 

        if (!comment) {
            return { success: false, statusCode: 404, error: FIND_ENTITY_ERROR };
        }

        const data: Comment[] = await listRepliesByCommentId(originalComment, orderBy)

        return { success: true, statusCode: 200, data };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${CREATE_ENTITY_ERROR}:${error}` };
    }
}