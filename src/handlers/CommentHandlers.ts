import { Request, Response } from 'express';
import { 
    Comment,
    CommentOrderBy
 } from '../interfaces/Comment';
import { INTERNAL_SERVER_ERROR } from './../utils/consts'
import {
    createService,
    updateService,
    listByUserService,
    listByGameService,
    deleteService
} from '../services/CommentService'
import { 
  likeService,
  dislikeService,
  listWhoLikedService,
  listWhoDislikedService
 } from '../services/CommentLikeService';

export async function createHandler(req: Request, res: Response) {
    try {
      const comment: Comment = req.body
      comment.user_id = req.decodedToken!.id
      const result = await createService(comment);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function updateHandler(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.id, 10);
      const { content } = req.body
      const result = await updateService(commentId, req.decodedToken!.id, content);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
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
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listByUserHandler(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const orderBy: CommentOrderBy = parseInt(req.query.order as string, 10) || 1;
      const result = await listByUserService(userId, orderBy);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listByGameHandler(req: Request, res: Response) {
    try {
      const gameId = parseInt(req.params.gameId, 10);
      const orderBy: CommentOrderBy = parseInt(req.query.order as string, 10) || 1;
      const result = await listByGameService(gameId, orderBy);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function likeCommentHandler(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId, 10);
      const result = await likeService(req.decodedToken!.id, commentId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function dislikeCommentHandler(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId, 10);
      const result = await dislikeService(req.decodedToken!.id, commentId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listWhoLikedHandler(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId, 10);
      const result = await listWhoLikedService(commentId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listWhoDislikedHandler(req: Request, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId, 10);
      const result = await listWhoDislikedService(commentId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }


