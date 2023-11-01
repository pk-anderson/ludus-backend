import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    createHandler,
    updateHandler,
    deleteHandler,
    listByUserHandler,
    listByGameHandler,
    likeCommentHandler,
    dislikeCommentHandler,
    listWhoLikedHandler,
    listWhoDislikedHandler
} from '../handlers/CommentHandlers'

const router = express.Router();

// Rota para publicar comentário
router.post('/create', validateToken, createHandler);

// Rota para atualizar comentário
router.put('/:id', validateToken, updateHandler);

// Rota para deletar comentário
router.delete('/:id', validateToken, deleteHandler);

// Rota para listar comentários por jogo
router.get('/game/:gameId', validateToken, listByGameHandler);

// Rota para listar comentários por usuário
router.get('/user/:userId', validateToken, listByUserHandler);

// Rota para dar ou remover like 
router.post('/:commentId/like', validateToken, likeCommentHandler);

// Rota para dar ou remover dislike 
router.post('/:commentId/dislike', validateToken, dislikeCommentHandler);

// Rota para listar usuários que deram like a um comentário
router.get('/:commentId/liked-by', validateToken, listWhoLikedHandler);

// Rota para listar usuários que deram dislike a um comentário
router.get('/:commentId/disliked-by', validateToken, listWhoDislikedHandler);

export default router;