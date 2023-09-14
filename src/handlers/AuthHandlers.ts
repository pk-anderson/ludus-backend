import { Request, Response } from 'express';
import { 
    loginService, 
    logoutService,
 } from '../services/AuthService';
import { INTERNAL_SERVER_ERROR } from './../utils/consts'

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