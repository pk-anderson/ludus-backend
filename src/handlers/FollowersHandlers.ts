import { Request, Response } from 'express';
import {
    followService,
    unfollowService,
    listFollowersService,
    listFollowingService
    } from '../services/FollowersService';
import { 
    INTERNAL_SERVER_ERROR 
} from './../utils/consts'

export async function followHandler(req: Request, res: Response) {
    try {
      const userId = req.decodedToken!.id;
      
      const followingId = parseInt(req.params.userId, 10);
      const result = await followService(userId, followingId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function unfollowHandler(req: Request, res: Response) {
    try {
      const userId = req.decodedToken!.id;
      
      const followingId = parseInt(req.params.userId, 10);
      const result = await unfollowService(userId, followingId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listFollowersHandler(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);

      const result = await listFollowersService(userId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listFollowingHandler(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);

      const result = await listFollowingService(userId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }