import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    listAllHandler
} from '../handlers/AchievementHandlers'

const router = express.Router();

// Rota para listar as conquistas de um usuário
router.get('/list/:userId', validateToken, listAllHandler);

export default router;