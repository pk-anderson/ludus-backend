import { Request, Response } from 'express';
import { 
    followService,
    listService,
    unfollowService
 } from '../services/MemberService';
 import { INTERNAL_SERVER_ERROR } from './../utils/consts'

export async function followHandler(req: Request, res: Response) {
    try {
      const userId = req.decodedToken!.id;
      const communityId = parseInt(req.params.communityId, 10);
      const result = await followService(userId, communityId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listHandler(req: Request, res: Response) {
    try {
      const communityId = parseInt(req.params.communityId, 10);
      const result = await listService(communityId);
  
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
      const communityId = parseInt(req.params.communityId, 10);
      const result = await unfollowService(userId, communityId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }