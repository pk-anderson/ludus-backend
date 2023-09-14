import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    signupHandler,
    listHandler,
    findHandler,
    deleteHandler,
    updateHandler,
    reactivateHandler,
    updatePasswordHandler
} from '../handlers/UserHandlers'

const router = express.Router();

// Rota para cadastro de usuário
router.post('/signup', signupHandler);

// Rota para listagem de usuários
router.get('/all', validateToken, listHandler);

// Rota para buscar um usuário por id
router.get('/:id', validateToken, findHandler);

// Rota para atualizar um usuário por id
router.put('/update', validateToken, updateHandler);

// Rota para deletar um usuário por id
router.delete('/delete', validateToken, deleteHandler);

// Rota para reativar um usuário por id
router.post('/reactivate', reactivateHandler);

// Rota para atualizar a senha do usuário
router.put('/update-password', validateToken, updatePasswordHandler);

export default router;
