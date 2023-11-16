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
import { 
    createListHandler,
    updateListHandler,
    deleteListHandler,
    getAllListsHandler,
    getListHandler,
    addToListHandler,
    removeFromListHandler
 } from '../handlers/GameListHandlers';
import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

 const router = express.Router();

 //ROTAS BÁSICAS PARA JOGOS

 // Rota para listar jogos
 router.get('/list', validateToken, listHandler);

 // Rota para buscar jogo por id
 router.get('/:id', validateToken, findHandler);

 // ROTAS PARA BIBLIOTECA DE JOGOS PESSOAL DO USUÁRIO

 // Rota para adicionar um jogo a biblioteca do usuário
 router.post('/:id/library', validateToken, addGameHandler);

 // Rota para remover um jogo da biblioteca do usuário
 router.delete('/:id/library', validateToken, removeGameHandler);

 // Rota para listar jogos da biblioteca do usuário
 router.get('/:userId/library', validateToken, listUserLibraryHandler);

 // ROTAS PARA STATUS DE JOGOS

 // Rota para adicionar status a um jogo
 router.post('/:id/status', validateToken, createHandler);

 // Rota para atualizar status de um jogo
 router.put('/:statusId/status', validateToken, updateHandler);

 // Rota para remover status de um jogo
 router.delete('/:statusId/status', validateToken, deleteHandler);

 // Rota para listar jogos por status
 router.get('/list/:status', validateToken, listByStatusHandler);

 // ROTAS PARA LISTAS PESSOAIS DE JOGOS

// Rota para criar uma lista de jogos 
router.post('/gamelist', validateToken, upload.single('file'), createListHandler);

// Rota para atualizar uma lista de jogos 
router.put('/gamelist/:listId', validateToken, upload.single('file'), updateListHandler);

// Rota para deletar uma lista de jogos 
router.delete('/gamelist/:listId', validateToken, deleteListHandler);

// Rota para buscar todas as listas de jogos de um usuário
router.get('/gamelist/:userId/all', validateToken, getAllListsHandler);
 
// Rota para buscar uma lista de jogos
router.get('/gamelist/:listId', validateToken, getListHandler);

// Rota para adicionar jogo a uma lista
router.post('/:id/gamelist/:listId/add', validateToken, addToListHandler);

// Rota para remover jogo de uma lista
router.delete('/:id/gamelist/:listId/remove', validateToken, removeFromListHandler);

 export default router;