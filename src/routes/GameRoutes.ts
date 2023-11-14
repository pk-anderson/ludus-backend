import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import { 
    addGameHandler,
    removeGameHandler,
    listUserLibraryHandler,
    listHandler,
    findHandler,
    listByStatusHandler
 } from '../handlers/GamesHandler';
import { 
    createHandler,
    updateHandler,
    deleteHandler
 } from '../handlers/GameStatusHandlers';

 const router = express.Router();

 // Rota para listar jogos
 router.get('/list', validateToken, listHandler);

 // Rota para buscar jogo por id
 router.get('/:id', validateToken, findHandler);

 // Rota para adicionar um jogo a biblioteca do usuário
 router.post('/:id/library', validateToken, addGameHandler);

 // Rota para remover um jogo da biblioteca do usuário
 router.delete('/:itemId/library', validateToken, removeGameHandler);

 // Rota para listar jogos da biblioteca do usuário
 router.get('/:userId/library', validateToken, listUserLibraryHandler);

 // Rota para adicionar status a um jogo
 router.post('/:id/status', validateToken, createHandler);

 // Rota para atualizar status de um jogo
 router.put('/:statusId/status', validateToken, updateHandler);

 // Rota para remover status de um jogo
 router.delete('/:statusId/status', validateToken, deleteHandler);

 // Rota para listar jogos por status
 router.get('/list/:status', validateToken, listByStatusHandler);
 
 export default router;