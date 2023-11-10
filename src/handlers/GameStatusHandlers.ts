import { Request, Response } from 'express';
import { GameStatus, StatusType } from '../interfaces/GameStatus';
import { 
    createStatusService,
    updateStatusService,
    deleteStatusService
 } from '../services/GameStatusService';
import { 
    INTERNAL_SERVER_ERROR 
} from './../utils/consts'


export async function createHandler(req: Request, res: Response) {
    try {
      const status: GameStatus = req.body
      status.game_id = parseInt(req.params.gameId, 10);
      status.user_id = req.decodedToken!.id
      const result = await createStatusService(status);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function updateHandler(req: Request, res: Response) {
    try {
      const status: StatusType = req.body
      const id = parseInt(req.params.id, 10);
      const result = await updateStatusService(id, status);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function deleteHandler(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await deleteStatusService(id);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }