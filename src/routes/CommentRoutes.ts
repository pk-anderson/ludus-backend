import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    createHandler,
    updateHandler,
    deleteHandler,
    listByUserHandler,
    listByGameHandler
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

export default router;