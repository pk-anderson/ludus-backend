import { validateToken } from '../middlewares/AuthMiddleware'
import express from 'express';
import {
    createHandler,
    listHandler,
    listByUserHandler,
    findHandler,
    updateHandler,
    deleteHandler,
    reactivateHandler
} from '../handlers/CommunityHandlers'

const router = express.Router();

// Rota para listar todas as comunidades
router.get('/all', validateToken, listHandler);

// Rota para listar todas as comunidades ativas de um usuário
router.get('/active/:userId', validateToken, (req, res) => listByUserHandler(req, res, true));

// Rota para listar todas as comunidades inativas de um usuário
router.get('/inactive/:userId', validateToken, (req, res) => listByUserHandler(req, res, false));

// Rota para criar uma nova comunidade
router.post('/create', validateToken, createHandler);

// Rota para buscar uma comunidade por ID
router.get('/:id', validateToken, findHandler);

// Rota para atualizar uma comunidade por ID
router.put('/:id', validateToken, updateHandler);

// Rota para deletar uma comunidade
router.delete('/:id', validateToken, deleteHandler);

// Rota para reativar uma comunidade
router.put('/reactivate/:id', validateToken, reactivateHandler);

export default router;
