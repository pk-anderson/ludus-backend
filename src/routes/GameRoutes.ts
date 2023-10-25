import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import { 
    listHandler,
    findHandler
 } from '../handlers/GamesHandler';

 const router = express.Router();

 // Rota para listar jogos
 router.get('/list', validateToken, listHandler);

 // Rota para buscar jogo por id
 router.get('/:id', validateToken, findHandler);
 
 export default router;