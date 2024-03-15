import { Rating } from './../interfaces/Rating';
import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from './../utils/consts'
import { 
    saveService,
    findService,
    findByIdService,
    listByUserService,
    listByGameService,
    deleteService,
    deleteByUserAndGameService
 } from '../services/RatingService';

 export async function saveHandler(req: Request, res: Response) {
    try {
      const rating: Rating = req.body
      rating.user_id = req.decodedToken!.id
      const result = await saveService(rating);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function findHandler(req: Request, res: Response) {
    try {   
      const userId = parseInt(req.params.userId, 10);
      const gameId = parseInt(req.params.gameId, 10);
      const result = await findService(userId, gameId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function findByIdHandler(req: Request, res: Response) {
    try {   
      const ratingId = parseInt(req.params.id, 10);
      const result = await findByIdService(ratingId)
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listByUserHandler(req: Request, res: Response) {
    try {   
      const userId = parseInt(req.params.userId, 10);
      const result = await listByUserService(userId)
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listByGameHandler(req: Request, res: Response) {
    try {   
      const gameId = parseInt(req.params.gameId, 10);
      const result = await listByGameService(gameId)
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function deleteHandler(req: Request, res: Response) {
    try {   
      const id = parseInt(req.params.id, 10);
      const userId = req.decodedToken!.id
      const result = await deleteService(id, userId)
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function deleteByUserAndGameHandler(req: Request, res: Response) {
    try {   
      const gameId = parseInt(req.params.id, 10);
      const userId = req.decodedToken!.id
      const result = await deleteByUserAndGameService(userId, gameId)
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }