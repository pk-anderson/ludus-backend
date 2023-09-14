import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    loginHandler,
    logoutHandler,
} from '../handlers/AuthHandlers'

const router = express.Router();

// Rota para autenticação (login) de usuário
router.post('/login', loginHandler);

// Rota para logout de usuário
router.delete('/logout', validateToken, logoutHandler);

export default router;