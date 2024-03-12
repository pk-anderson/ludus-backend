import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    listAllHandler
} from '../handlers/AchievementHandlers'

const router = express.Router();

router.get('/list/:userId', validateToken, listAllHandler);

export default router;