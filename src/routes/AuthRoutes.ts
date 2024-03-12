import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    loginHandler,
    logoutHandler,
} from '../handlers/AuthHandlers'

const router = express.Router();

router.post('/login', loginHandler);

router.delete('/logout', validateToken, logoutHandler);

export default router;