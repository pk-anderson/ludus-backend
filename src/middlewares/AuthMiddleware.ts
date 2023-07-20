import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  email: string;
  username: string;
  revoked: boolean;
}

export function validateToken(token: string): TokenPayload | null {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('Chave secreta JWT não configurada.');
  }

  try {
    const decodedToken = jwt.verify(token, secretKey) as TokenPayload;
    return decodedToken;
  } catch (error) {
    return null;
  }
}
