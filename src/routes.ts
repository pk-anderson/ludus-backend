// routes.ts

import express from 'express';
import { loginUser, createUser, listUsers, getUserById } from './controllers/UserController';

const router = express.Router();

// Rotas de acesso
router.post('/login', loginUser); // Rota de login

// Rotas de user_table
router.post('/user', createUser); // Rota para criar novo usuário
router.get('/user', listUsers); // Rota para listar todos os usuários
router.get('/user/:id', getUserById); // Rota para buscar usuário pelo ID

export default router;
