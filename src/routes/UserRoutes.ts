import express from 'express';
import { signup, login, listUsers, getUserById, deleteUserById, updateUserById, reactivateUser } from '../controllers/UserController';

const router = express.Router();

// Rota para cadastro de usuário
router.post('/signup', signup);

// Rota para autenticação (login) de usuário
router.post('/login', login);

// Rota para listagem de usuários
router.get('/all', listUsers);

// Rota para buscar um usuário por id
router.get('/:id', getUserById);

// Rota para atualizar um usuário por id
router.put('/:id', updateUserById);

// Rota para deletar um usuário por id
router.delete('/:id', deleteUserById);

// Rota para reativar um usuário por id
router.post('/reactivate', reactivateUser);

export default router;
