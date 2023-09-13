import { Request, Response } from 'express';
import { 
    loginService, 
    signupService,
    logoutService,
    listService,
    findService,
    deleteService
 } from '../services/UserService';
import { User } from './../interfaces/User';
import { INTERNAL_SERVER_ERROR } from './../utils/consts'

export async function signupHandler(req: Request, res: Response) {
    try {
      const user: User = req.body
      const result = await signupService(user);
  
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

  export async function loginHandler(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const result = await loginService(email, password);
  
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

  export async function logoutHandler(req: Request, res: Response) {
    try {
      const decodedToken = req.decodedToken;
      const result = await logoutService(decodedToken!.sessionId);
  
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

      const result = await listService();
  
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
      // Obter o ID do usuário a ser buscado a partir dos parâmetros da URL
      const userId = parseInt(req.params.id, 10);

      const result = await findService(userId);
  
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
      // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

      const result = await deleteService(decodedToken!.id);
  
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