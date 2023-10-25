import { Request, Response } from 'express';
import { 
    listGamesService,
    findGameByIdService
 } from "../services/GameService";
import { 
    INTERNAL_SERVER_ERROR 
} from './../utils/consts'

export async function listHandler(req: Request, res: Response) {
    try {
      const text = req.query.text as string;
      const result = await listGamesService(text);
  
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

  export async function findHandler(req: Request, res: Response) {
    try {
      const gameId = parseInt(req.params.id, 10);
      const result = await findGameByIdService(gameId);
  
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