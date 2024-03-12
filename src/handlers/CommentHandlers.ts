import { Request, Response } from 'express';
import { Comment } from '../interfaces/Comment';
import { ListOrderBy } from '../utils/listOrder';
import { INTERNAL_SERVER_ERROR } from '../utils/consts'
import {
    createService,
    updateService,
    listByUserService,
    listByEntityService,
    deleteService,
    postReplyService,
    listRepliesService
} from '../services/CommentService'
import { 
  likeService,
  dislikeService,
  listWhoLikedService,
  listWhoDislikedService
 } from '../services/LikeDislikeService';
import { CommentType } from '../interfaces/Comment';
import { EntityType } from '../interfaces/LikesDislikes';

export async function createHandler(req: Request, res: Response) {
  try {
      const comment: Comment = req.body;
      comment.user_id = req.decodedToken!.id;
      const commentType: CommentType = req.body.comment_type;
      const result = await createService(comment, commentType);

      if (result.success) {
          res.status(result.statusCode || 200).json(result.data);
      } else {
          res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
  } catch (error) {
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
}

export async function updateHandler(req: Request, res: Response) {
  try {
      const commentId = parseInt(req.params.id, 10);
      const { content } = req.body;
      const result = await updateService(commentId, req.decodedToken!.id, content);

      if (result.success) {
          res.status(result.statusCode || 200).json(result.data);
      } else {
          res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
  } catch (error) {
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
}

  export async function deleteHandler(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.id, 10);
      const result = await deleteService(commentId, req.decodedToken!.id);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listByUserHandler(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const orderBy: ListOrderBy = parseInt(req.query.order as string, 10) || 1;
      const commentType: CommentType = req.body.comment_type
      const result = await listByUserService(userId, commentType, orderBy);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listByEntityHandler(req: Request, res: Response) {
    try {
        const entityId = parseInt(req.params.entityId, 10);
        const orderBy: ListOrderBy = parseInt(req.query.order as string, 10) || 1;
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const commentType = req.query.type as CommentType
        const result = await listByEntityService(entityId, commentType, orderBy, page, limit);
    
        if (result.success) {
            res.status(result.statusCode || 200).json({
                comments: result.comments,
                totalPages: result.totalPages
            });
        } else {
            res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
        }
    } catch (error) {
        
        res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
}


  export async function likeCommentHandler(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId, 10);
      const result = await likeService(req.decodedToken!.id, commentId, EntityType.COMMENT);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function dislikeCommentHandler(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId, 10);
      const result = await dislikeService(req.decodedToken!.id, commentId, EntityType.COMMENT);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listWhoLikedHandler(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId, 10);
      const result = await listWhoLikedService(commentId, EntityType.COMMENT);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listWhoDislikedHandler(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId, 10);
      const result = await listWhoDislikedService(commentId, EntityType.COMMENT);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function createReplyHandler(req: Request, res: Response) {
    try {
        const comment: Comment = req.body;
        comment.user_id = req.decodedToken!.id;
        const commentType: CommentType = req.body.comment_type;
        const originalComment = parseInt(req.params.commentId, 10);
        const result = await postReplyService(comment, originalComment);
  
        if (result.success) {
            res.status(result.statusCode || 200).json(result.data);
        } else {
            res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
        }
    } catch (error) {
        res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listRepliesHandler(req: Request, res: Response) {
    try {
        const originalComment = parseInt(req.params.commentId, 10);
        const orderBy: ListOrderBy = parseInt(req.query.order as string, 10) || 1;
        const result = await listRepliesService(originalComment, orderBy);
  
        if (result.success) {
            res.status(result.statusCode || 200).json(result.data);
        } else {
            res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
        }
    } catch (error) {
        res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

