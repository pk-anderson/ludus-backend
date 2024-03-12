import { Request, Response } from 'express';
import { CommunityPost } from "../interfaces/CommunityPost";
import { ListOrderBy } from './../utils/listOrder';
import {
    createCommunityPostService,
    updateCommunityPostService,
    listCommunityPostsByUser,
    listCommunityPostsByCommunity,
    getCommunityPostByIdService,
    deleteCommunityPostService
 } from '../services/CommunityPostService';
import { 
   likeService,
   dislikeService,
   listWhoLikedService,
   listWhoDislikedService
  } from '../services/LikeDislikeService';
import { INTERNAL_SERVER_ERROR } from '../utils/consts';
import { EntityType } from '../interfaces/LikesDislikes';

export async function createHandler(req: Request, res: Response) {
    try {
      const post: CommunityPost = req.body
      post.community_id = parseInt(req.params.communityId, 10);
      post.user_id = req.decodedToken!.id
      const image = req.file;
      if (image) {
        const imageBytes = image.buffer;
        post.image = imageBytes
      }
      
      const result = await createCommunityPostService(post);
  
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
        const postId = parseInt(req.params.id, 10);
        const { content } = req.body;
        const post: CommunityPost = {
            id: postId,
            content: content,
            user_id: req.decodedToken!.id,
            community_id: parseInt(req.params.communityId, 10),
        };
        const image = req.file;
      if (image) {
        const imageBytes = image.buffer;
        post.image = imageBytes
      }
        const result = await updateCommunityPostService(post);

        if (result.success) {
            res.status(result.statusCode || 200).json(result.data);
        } else {
            res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
        }
    } catch (error) {
        res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
}

export async function getByIdHandler(req: Request, res: Response) {
    try {
        const postId = parseInt(req.params.id, 10);
        const result = await getCommunityPostByIdService(postId);

        if (result.success) {
            res.status(result.statusCode || 200).json(result.data);
        } else {
            res.status(result.statusCode || 500).json({ message: 'Error: ' + result.error });
        }
    } catch (error) {
        
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function listByUserHandler(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.userId, 10);
        const orderBy: ListOrderBy = parseInt(req.query.order as string, 10) || 1;
        const result = await listCommunityPostsByUser(userId, orderBy);

        if (result.success) {
            res.status(result.statusCode || 200).json(result.data);
        } else {
            res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
        }
    } catch (error) {
        res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
}

export async function listByCommunityHandler(req: Request, res: Response) {
    try {
        const communityId = parseInt(req.params.communityId, 10);
        const orderBy: ListOrderBy = parseInt(req.query.order as string, 10) || 1;
        const result = await listCommunityPostsByCommunity(communityId, orderBy);

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
        const postId = parseInt(req.params.id, 10);
        const result = await deleteCommunityPostService(postId, req.decodedToken!.id);

        if (result.success) {
            res.status(result.statusCode || 200).json(result.message);
        } else {
            res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
        }
    } catch (error) {
        res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
}

export async function likePostHandler(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await likeService(req.decodedToken!.id, postId, EntityType.COMMUNITY_POST);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function dislikePostHandler(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await dislikeService(req.decodedToken!.id, postId, EntityType.COMMUNITY_POST);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.message);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listWhoLikedHandler(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await listWhoLikedService(postId, EntityType.COMMUNITY_POST);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }

  export async function listWhoDislikedHandler(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId, 10);
      const result = await listWhoDislikedService(postId, EntityType.COMMUNITY_POST);
  
      if (result.success) {
        res.status(result.statusCode || 200).json(result.data);
      } else {
        res.status(result.statusCode || 500).json({ message: 'Erro: ' + result.error });
      }
    } catch (error) {
      
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }
