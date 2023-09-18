import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    followHandler,
    listHandler,
    unfollowHandler
} from '../handlers/MemberHandlers'

const router = express.Router();

// Rota para seguir uma comunidade
router.post('/follow/:communityId', validateToken, followHandler);

// Rota para listar todos os membros de uma comunidade
router.get('/list/:communityId', validateToken, listHandler);

// Rota para deixar de seguir uma comunidade
router.delete('/unfollow/:communityId', validateToken, unfollowHandler);

export default router;