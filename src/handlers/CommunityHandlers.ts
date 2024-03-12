import { Request, Response } from 'express';
import {
    createService,
    listService,
    listByUserService,
    findService,
    updateService,
    deleteService,
    reactivateService
} from '../services/CommunityService';
import { Community } from './../interfaces/Community';
import { INTERNAL_SERVER_ERROR } from './../utils/consts'


export async function createHandler(req: Request, res: Response) {
    try {
      const community: Community = req.body
      community.id_creator = req.decodedToken!.id;
     
      const result = await createService(community)

      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listHandler(req: Request, res: Response) {
    try {   
      const result = await listService()

      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listByUserHandler(req: Request, res: Response, isActive: boolean) {
    try {   
      const userId = parseInt(req.params.userId, 10);
      const result = await listByUserService(userId, isActive)

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
      const id = parseInt(req.params.id, 10);
      const result = await findService(id)

      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function updateHandler(req: Request, res: Response) {
    try {
      const community: Community = req.body
      community.id = parseInt(req.params.id, 10);
      community.id_creator = req.decodedToken!.id;

      const result = await updateService(community)

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
      const communityId = parseInt(req.params.id, 10);
      const userId = req.decodedToken!.id;

      const result = await deleteService(communityId, userId)

      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function reactivateHandler(req: Request, res: Response) {
    try {
      const communityId = parseInt(req.params.id, 10);
      const userId = req.decodedToken!.id;

      const result = await reactivateService(communityId, userId)

      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }