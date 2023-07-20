import { validateToken } from '../middlewares/AuthMiddleware'
import express from 'express';
import { 
    listCommunities, 
    createCommunity, 
    getCommunityById,
    deleteCommunity,
    reactivateCommunity,
    listOwnCommunities,
    listCommunitiesByUserId,
    updateCommunity
} from '../controllers/CommunityController';

const router = express.Router();

// Rota para listar todas as comunidades
router.get('/all', validateToken, listCommunities);

// Rota para listar todas as comunidades ativas de um usuário
router.get('/active', validateToken, (req, res) => listOwnCommunities(req, res, true));

// Rota para listar todas as comunidades inativas de um usuário
router.get('/inactive', validateToken, (req, res) => listOwnCommunities(req, res, false));

// Rota para listar todas as comunidades ativas de um usuário por ID
router.get('/user/:userId', validateToken, listCommunitiesByUserId);

// Rota para criar uma nova comunidade
router.post('/create', validateToken, createCommunity);

// Rota para buscar uma comunidade por ID
router.get('/:id', validateToken, getCommunityById);

// Rota para buscar uma comunidade por ID
router.put('/:id', validateToken, updateCommunity);

// Rota para deletar uma comunidade
router.delete('/:id', validateToken, deleteCommunity);

// Rota para reativar uma comunidade
router.put('/reactivate/:id', validateToken, reactivateCommunity);

export default router;
