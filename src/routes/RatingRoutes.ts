import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import { 
    saveHandler,
    findHandler,
    findByIdHandler,
    listByGameHandler,
    listByUserHandler,
    deleteHandler,
    deleteByUserAndGameHandler
 } from '../handlers/RatingHandlers';

 const router = express.Router();

 // Rota para salvar avaliação
 router.post('/save', validateToken, saveHandler);

 // Rota para buscar avaliação
 router.get('/user/:userId/game/:gameId', validateToken, findHandler);

 // Rota para buscar avaliação por id
 router.get('/:id', validateToken, findByIdHandler);

 // Rota para listar todas as avaliações de um usuário
 router.get('/user/:userId', validateToken, listByUserHandler);

 // Rota para listar todas as avaliações de um jogo
 router.get('/game/:gameId', validateToken, listByGameHandler);

 // Rota para remover avaliação
 router.delete('/:id', validateToken, deleteHandler);

  // Rota para remover avaliação por id do jogo
  router.delete('/game/:id', validateToken, deleteByUserAndGameHandler);

 export default router;
 