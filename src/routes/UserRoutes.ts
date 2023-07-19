// routes/users.ts
import express from 'express';
import { signup, login } from '../controllers/UserController';

const router = express.Router();

// Rota para cadastro de usuário
router.post('/signup', signup);

// Rota para autenticação (login) de usuário
router.post('/login', login);

// Outras rotas relacionadas aos usuários podem ser adicionadas aqui

export default router;
