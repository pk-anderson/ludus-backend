import { Comment } from "../interfaces/Comment";
import { ListOrderBy } from './../utils/listOrder';
import { 
    postComment,
    updateComment,
    getCommentById,
    listCommentsByUserId,
    listCommentsByGameId,
    deleteComment
 } from "../repositories/CommentRepository";
import { 
    CREATE_ENTITY_ERROR, 
    FIND_ENTITY_ERROR,
    UPDATE_ENTITY_ERROR,
    LIST_ENTITY_ERROR,
    UNAUTHORIZED_ACCESS,
    DELETE_COMMENT_SUCCESS,
    DELETE_ENTITY_ERROR,
    NO_CONTENT_ERROR
} from "../utils/consts";

export async function createService(comment: Comment) {
    try {
      if (!comment.content || comment.content === '') {
        return { success: false, 
          statusCode: 400, 
          error: NO_CONTENT_ERROR,
        };
      }
      const data: Comment = await postComment(comment)
  
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

  export async function updateService(commentId: number, userId: number, content: string) {
    try {

    const comment = await getCommentById(commentId)

    if (!comment) {
      return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR
        };
    }

    if (comment.user_id !== userId) {
      return { success: false, 
          statusCode: 403, 
          error: UNAUTHORIZED_ACCESS
        };
    }
    
    if (!content || content === '') {
      return { success: false, 
        statusCode: 400, 
        error: NO_CONTENT_ERROR,
      };
    }

    const data: Comment = await updateComment(commentId, content)
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

  export async function listByUserService(userId: number, orderBy: ListOrderBy) {
    try {
      const data: Comment[] = await listCommentsByUserId(userId, orderBy)
  
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

  export async function listByGameService(gameId: number, orderBy: ListOrderBy) {
    try {
      const data: Comment[] = await listCommentsByGameId(gameId, orderBy)
  
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

  export async function deleteService(commentId: number, userId: number) {
    try {
      const comment: Comment = await getCommentById(commentId)

    if (!comment) {
        return { success: false, 
            statusCode: 404, 
            error: FIND_ENTITY_ERROR
          };
    }

    if (comment.user_id !== userId) {
        return { success: false, 
            statusCode: 403, 
            error: UNAUTHORIZED_ACCESS
          };
    }
    
    await deleteComment(commentId)
      return { success: true, 
        statusCode: 200, 
        message: DELETE_COMMENT_SUCCESS,
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${DELETE_ENTITY_ERROR}:${error}`
      };
    }
  }