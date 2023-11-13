import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import { 
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

  // Rota para adicionar status a um jogo
  router.post('/:gameId/status', validateToken, createHandler);

  // Rota para atualizar status de um jogo
  router.put('/:statusId/status', validateToken, updateHandler);

   // Rota para remover status de um jogo
   router.delete('/:statusId/status', validateToken, deleteHandler);

  // Rota para listar jogos por status
  router.get('/list/:status', validateToken, listByStatusHandler);
 
 export default router;