import { Request, Response } from 'express';
import { GameList, GameListItem } from '../interfaces/GameList';
import { 
    INTERNAL_SERVER_ERROR 
} from './../utils/consts'
import { 
    createListService,
    getAllListsService,
    getGameListService,
    updateListService,
    deleteListService,
    addGameItemService,
    removeGameItemService
 } from '../services/GameListService';

 export async function createListHandler(req: Request, res: Response) {
    try {
      const gameList: GameList = req.body
      gameList.user_id = req.decodedToken!.id
      const cover = req.file;
      if (cover) {
        gameList.cover_image = cover.buffer
      }
      const result = await createListService(gameList);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function updateListHandler(req: Request, res: Response) {
    try {
      const gameList: GameList = req.body
      gameList.id = parseInt(req.params.listId, 10);
      const cover = req.file;
      if (cover) {
        gameList.cover_image = cover.buffer
      }
      const result = await updateListService(gameList);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function deleteListHandler(req: Request, res: Response) {
    try {
      const listId = parseInt(req.params.listId, 10);
      
      const result = await deleteListService(listId, req.decodedToken!.id);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function getAllListsHandler(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);

      const result = await getAllListsService(userId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function getListHandler(req: Request, res: Response) {
    try {
      const listId = parseInt(req.params.listId, 10);

      const result = await getGameListService(listId);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }


 export async function addToListHandler(req: Request, res: Response) {
    try {
      const item: GameListItem = {
        id: 0,
        user_id: req.decodedToken!.id,
        list_id: parseInt(req.params.listId, 10),
        game_id: parseInt(req.params.id, 10)
      }

      const result = await addGameItemService(item);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function removeFromListHandler(req: Request, res: Response) {
    try {
      const item: GameListItem = {
        id: 0,
        user_id: req.decodedToken!.id,
        list_id: parseInt(req.params.listId, 10),
        game_id: parseInt(req.params.id, 10)
      }
      const result = await removeGameItemService(item);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }