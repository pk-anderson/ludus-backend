import { Request, Response, NextFunction } from 'express';
import { pool } from '../index';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  email: string;
  username: string;
  sessionId: string;
  exp: number;
}

// Estendendo a interface Request para incluir a propriedade decodedToken
declare global {
  namespace Express {
    interface Request {
      decodedToken?: TokenPayload;
    }
  }
}

export async function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1] ?? '';
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    return res.status(500).json({ message: 'Chave secreta JWT não configurada.' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey) as TokenPayload;
    // Verificar se o token está revogado
    const checkRevokedQuery = 'SELECT * FROM tb_access WHERE access_token = $1 AND revoked = true';
    const checkRevokedValues = [token];
    const checkRevokedResult = await pool.query(checkRevokedQuery, checkRevokedValues);
  
    if (checkRevokedResult.rows.length > 0) {
      // Token foi revogado, não é válido
      return res.status(401).json({ message: 'Token revogado. Acesso não autorizado.' });
    }
  
    // Verificar se o token expirou
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTimeInSeconds) {
      // Token expirado, retorno 401 Unauthorized
      return res.status(401).json({ message: 'Token expirado. Acesso não autorizado.' });
    }
  
    req.decodedToken = decodedToken; // Adiciona o payload decodificado ao objeto req
  
    next(); // Continua o fluxo da requisição para a próxima função
  } catch (error) {
    return res.status(401).json({ message: `Acesso não autorizado: ${error}` });
  }
}
