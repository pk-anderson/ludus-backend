import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {    signup, 
            login, 
            logout,
            listUsers, 
            getUserById, 
            deleteUserById, 
            updateUserById, 
            reactivateUser 
        } from '../controllers/UserController';

const router = express.Router();

// Rota para cadastro de usuário
router.post('/signup', signup);

// Rota para autenticação (login) de usuário
router.post('/login', login);

// Rota para logout de usuário
router.delete('/logout', validateToken, logout);

// Rota para listagem de usuários
router.get('/all', validateToken, listUsers);

// Rota para buscar um usuário por id
router.get('/:id', validateToken, getUserById);

// Rota para atualizar um usuário por id
router.put('/:id', validateToken, updateUserById);

// Rota para deletar um usuário por id
router.delete('/:id', validateToken, deleteUserById);

// Rota para reativar um usuário por id
router.post('/reactivate', reactivateUser);

export default router;
