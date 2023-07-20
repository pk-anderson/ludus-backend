import { validateToken } from '../middlewares/AuthMiddleware'
import express from 'express';
import { listCommunities, createCommunity, getCommunityById } from '../controllers/CommunityController';

const router = express.Router();

// Rota para listar todas as comunidades
router.get('/all', validateToken, listCommunities);

// Rota para criar uma nova comunidade
router.post('/create', validateToken, createCommunity);

// Rota para buscar uma comunidade por ID
router.get('/:id', validateToken, getCommunityById);

export default router;
