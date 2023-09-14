import { generateSessionId } from '../utils/uuid';
import jwt from 'jsonwebtoken';
import { 
    createAccessToken,
    checkSessionIdExists,
    logout,
} from './../repositories/AccessRepository'
import { getUserByEmail } from './../repositories/UserRepository'
import { comparePasswords } from '../utils/encryptor';
import {
    CREDENTIALS_INVALID,
    ENV_VARIABLE_NOT_CONFIGURED,
    AUTHENTICATION_SUCCESSFUL,
    AUTHENTICATION_ERROR,
    LOGOUT_SUCCESSFUL,
    LOGOUT_ERROR,
  } from '../utils/consts';

export async function loginService(email: string, password: string) {
    try {
      const user = await getUserByEmail(email);
  
      if (!user) {
        return { success: false, 
            statusCode: 401, 
            error: CREDENTIALS_INVALID };
      }
  
      if (!user.is_active) {
        return { success: false, 
            statusCode: 401, 
            error: CREDENTIALS_INVALID };
      }
  
      const isPasswordMatch = await comparePasswords(password, user.password);
  
      if (!isPasswordMatch) {
        return { success: false, 
            statusCode: 401, 
            error: CREDENTIALS_INVALID };
      }
  
      let sessionId = '';
      while (true) {
        sessionId = generateSessionId();
        const isSessionIdUnique = await checkSessionIdExists(sessionId);
        if (isSessionIdUnique) {
          break;
        }
      }
  
      const tokenPayload = {
        id: user.id,
        email: user.email,
        sessionId: sessionId,
        username: user.username,
      };
  
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        return { success: false, 
            statusCode: 500, 
            error: ENV_VARIABLE_NOT_CONFIGURED };
      }
  
      const token = jwt.sign(tokenPayload, secretKey, {
        expiresIn: '24h',
      });
  
      await createAccessToken(user.id, token, sessionId);
  
      return { success: true, 
        statusCode: 200, 
        data: { message: AUTHENTICATION_SUCCESSFUL, 
        token 
    } 
};
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${AUTHENTICATION_ERROR}: ${error}` };
    }
  }

  export async function logoutService(sessionId: string) {
    try {
      await logout(sessionId); // Chama a função do repositório para revogar o token
  
      return { success: true, 
        statusCode: 200, 
        data: { 
          message: LOGOUT_SUCCESSFUL 
        } 
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${LOGOUT_ERROR}:${error}`
      };
    }
  }