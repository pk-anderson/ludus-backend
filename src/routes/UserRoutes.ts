import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    signupHandler,
    loginHandler,
    logoutHandler,
    listHandler,
    findHandler,
    deleteHandler
} from '../handlers/UserHandlers'
import {     
            updateUserById, 
            reactivateUser,
            updatePassword 
        } from '../repositories/UserRepository';

const router = express.Router();

// Rota para cadastro de usuário
router.post('/signup', signupHandler);

// Rota para autenticação (login) de usuário
router.post('/login', loginHandler);

// Rota para logout de usuário
router.delete('/logout', validateToken, logoutHandler);

// Rota para listagem de usuários
router.get('/all', validateToken, listHandler);

// Rota para buscar um usuário por id
router.get('/:id', validateToken, findHandler);

// Rota para atualizar um usuário por id
router.put('/update/:id', validateToken, updateUserById);

// Rota para deletar um usuário por id
router.delete('/delete', validateToken, deleteHandler);

// Rota para reativar um usuário por id
router.post('/reactivate', reactivateUser);

// Rota para atualizar a senha do usuário
router.put('/update-password', validateToken, updatePassword);

export default router;
