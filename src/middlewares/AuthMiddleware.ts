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
    const checkRevokedQuery = 'SELECT * FROM tb_access WHERE access_token = $1 AND revoked = true';
    const checkRevokedValues = [token];
    const checkRevokedResult = await pool.query(checkRevokedQuery, checkRevokedValues);
  
    if (checkRevokedResult.rows.length > 0) {
      return res.status(401).json({ message: 'Token revogado. Acesso não autorizado.' });
    }
  
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTimeInSeconds) {
      return res.status(401).json({ message: 'Token expirado. Acesso não autorizado.' });
    }
  
    req.decodedToken = decodedToken; 
  
    next(); 
  } catch (error) {
    return res.status(401).json({ message: `Acesso não autorizado: ${error}` });
  }
}
