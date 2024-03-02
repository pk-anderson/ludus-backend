import { Request, Response } from 'express';
import { StatusType } from '../interfaces/GameStatus';
import { 
    listGamesService,
    findGameByIdService,
    listGamesByStatusService,
    listGamesByLibrary
 } from "../services/GameService";
import { 
  addUserLibraryItem,
  removeUserLibraryItem
 } from '../services/UserLibraryService';
import { 
    INTERNAL_SERVER_ERROR 
} from './../utils/consts'

export async function addGameHandler(req: Request, res: Response) {
  try {
    const gameId = parseInt(req.params.id, 10);
    const result = await addUserLibraryItem(req.decodedToken!.id, gameId);

    if (result.success) {
      res.status(result.statusCode || 200).json(result.message);
    } else {
      res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
    }
  } catch (error) {
    // Em caso de exceção não tratada, envie uma resposta de erro de servidor
    res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
}

export async function removeGameHandler(req: Request, res: Response) {
  try {
    const gameId = parseInt(req.params.id, 10);
    const result = await removeUserLibraryItem(req.decodedToken!.id, gameId);

    if (result.success) {
      res.status(result.statusCode || 200).json(result.message);
    } else {
      res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
    }
  } catch (error) {
    // Em caso de exceção não tratada, envie uma resposta de erro de servidor
    res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
}

export async function listUserLibraryHandler(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const result = await listGamesByLibrary(userId);

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

export async function listHandler(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const text = req.query.text as string;
      const result = await listGamesService(text, limit, page);
  
      if (result.success) {
        res.status(result.statusCode || 200).json({
            games: result.games,
            totalPages: result.totalPages
        });
    } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      // Em caso de exceção não tratada, envie uma resposta de erro de servidor
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listByStatusHandler(req: Request, res: Response) {
    try {
      const status = req.params.status as StatusType;
      const result = await listGamesByStatusService(req.decodedToken!.id, status);
  
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
      const result = await findGameByIdService(req.decodedToken!.id, gameId);
  
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