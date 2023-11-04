import { validateToken } from '../middlewares/AuthMiddleware'
import express from 'express';
import {
    createHandler,
    getByIdHandler,
    listByUserHandler,
    listByCommunityHandler,
    updateHandler,
    deleteHandler,
} from '../handlers/CommunityPostHandlers'

const router = express.Router();

// Rota para criar postagem
router.post('/:communityId/create', validateToken, createHandler);

// Rota para atualizar postagem
router.put('/:communityId/update/:id', validateToken, updateHandler);

// Rota para buscar postagem por id
router.get('/:id', validateToken, getByIdHandler);

// Rota para listar postagens por usuário
router.get('/user/:userId', validateToken, listByUserHandler);

// Rota para listar postagens por comunidade
router.get('/user/:userId', validateToken, listByCommunityHandler);

// Rota para deletar postagem
router.delete('/:id', validateToken, deleteHandler);

export default router;

