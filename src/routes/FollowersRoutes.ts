import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    followHandler,
    unfollowHandler,
    listFollowersHandler,
    listFollowingHandler
} from '../handlers/FollowersHandlers'


const router = express.Router();

// Rota para seguir um usuário
router.post('/follow/:userId', validateToken, followHandler);

// Rota para deixar de seguir um usuário
router.delete('/unfollow/:userId', validateToken, unfollowHandler);

// Rota para listar todos os usuários que um usuário está seguindo
router.get('/following/:userId', validateToken, listFollowingHandler);

// Rota para listar todos os seguidores de um usuário
router.get('/:userId', validateToken, listFollowersHandler);

export default router;