import { Request, Response } from 'express';
import { 
    listByUserService
 } from '../services/AchievementService';
import { INTERNAL_SERVER_ERROR } from './../utils/consts'

export async function listAllHandler(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.userId, 10);
        const result = await listByUserService(userId);
  
        if (result.success) {
            res.status(result.statusCode || 200).json(result.data);
        } else {
            res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
        }
    } catch (error) {
        res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }