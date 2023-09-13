import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    followUser,
    listFollowers,
    listFollowersOfUser,
    listFollowingUsers,
    listFollowingOfUser,
    unfollowUser
} from '../repositories/FollowersRepository';

const router = express.Router();

// Rota para seguir um usuário
router.post('/follow', validateToken, followUser);

// Rota para listar todos os seguidores
router.get('/all', validateToken, listFollowers);

// Rota para listar todos os seguidores de outro usuário
router.get('/all/user/:userId', validateToken, listFollowersOfUser);

// Rota para listar todos os usuários que estou seguindo
router.get('/following', validateToken, listFollowingUsers);

// Rota para listar todos os usuários que um outro usuário está seguindo
router.get('/following/user/:userId', validateToken, listFollowingOfUser);

// Rota para deixar de seguir um usuário
router.delete('/unfollow', validateToken, unfollowUser);

export default router;