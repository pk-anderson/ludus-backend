import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    followCommunity,
    listMembers,
    unfollowCommunity
} from '../repositories/MembersRepository';

const router = express.Router();

// Rota para seguir uma comunidade
router.post('/:communityId/follow', validateToken, followCommunity);

// Rota para listar todos os membros de uma comunidade
router.get('/:communityId/list', validateToken, listMembers);

// Rota para deixar de seguir uma comunidade
router.delete('/:communityId/unfollow', validateToken, unfollowCommunity);

export default router;