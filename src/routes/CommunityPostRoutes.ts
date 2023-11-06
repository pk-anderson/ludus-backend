import { validateToken } from '../middlewares/AuthMiddleware'
import express from 'express';
import {
    createHandler,
    getByIdHandler,
    listByUserHandler,
    listByCommunityHandler,
    updateHandler,
    deleteHandler,
    likePostHandler,
    dislikePostHandler,
    listWhoLikedHandler,
    listWhoDislikedHandler
} from '../handlers/CommunityPostHandlers'

const router = express.Router();

// Rota para criar postagem
router.post('/:communityId/create', validateToken, createHandler);

// Rota para atualizar postagem
router.put('/:communityId/update/:id', validateToken, updateHandler);

// Rota para buscar postagem por id
router.get('/:id', validateToken, getByIdHandler);

// Rota para listar postagens por usuário
router.get('/user/:userId', validateToken, listByUserHandler);

// Rota para listar postagens por comunidade
router.get('/community/:communityId', validateToken, listByCommunityHandler);

// Rota para deletar postagem
router.delete('/:id', validateToken, deleteHandler);

// Rota para dar ou remover like 
router.post('/:postId/like', validateToken, likePostHandler);

// Rota para dar ou remover dislike 
router.post('/:postId/dislike', validateToken, dislikePostHandler);

// Rota para listar usuários que deram like a um comentário
router.get('/:postId/liked-by', validateToken, listWhoLikedHandler);

// Rota para listar usuários que deram dislike a um comentário
router.get('/:postId/disliked-by', validateToken, listWhoDislikedHandler);

export default router;

