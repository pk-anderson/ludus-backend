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
      // Buscar imagem de capa
      const cover = req.file;
      if (cover) {
        gameList.cover_image = cover.buffer
      }
      // Criar lista
      const result = await createListService(gameList);
  
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

  export async function updateListHandler(req: Request, res: Response) {
    try {
      const gameList: GameList = req.body
      gameList.id = parseInt(req.params.listId, 10);
      // Buscar imagem de capa
      const cover = req.file;
      if (cover) {
        gameList.cover_image = cover.buffer
      }
      // Atualizar lista
      const result = await updateListService(gameList);
  
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

  export async function deleteListHandler(req: Request, res: Response) {
    try {
      const listId = parseInt(req.params.listId, 10);
      // remover lista
      const result = await deleteListService(listId, req.decodedToken!.id);
  
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

  export async function getAllListsHandler(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      // buscar listas
      const result = await getAllListsService(userId);
  
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

  export async function getListHandler(req: Request, res: Response) {
    try {
      const listId = parseInt(req.params.listId, 10);
      // buscar listas
      const result = await getGameListService(listId);
  
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


 export async function addToListHandler(req: Request, res: Response) {
    try {
      const item: GameListItem = {
        id: 0,
        user_id: req.decodedToken!.id,
        list_id: parseInt(req.params.listId, 10),
        game_id: parseInt(req.params.id, 10)
      }
      // Criar lista
      const result = await addGameItemService(item);
  
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

  export async function removeFromListHandler(req: Request, res: Response) {
    try {
      const item: GameListItem = {
        id: 0,
        user_id: req.decodedToken!.id,
        list_id: parseInt(req.params.listId, 10),
        game_id: parseInt(req.params.id, 10)
      }
      // Criar lista
      const result = await removeGameItemService(item);
  
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