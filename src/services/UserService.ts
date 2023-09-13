import { FIND_ENTITY_ERROR } from './../utils/consts';
import { User } from './../interfaces/User';
import { generateSessionId } from '../utils/uuid';
import jwt from 'jsonwebtoken';
import { 
    checkIfEmailExists, 
    signup,
    getUserByEmail,
    createAccessToken,
    checkSessionIdExists,
    logout,
    listUsers,
    getUserById,
    deleteUserById
} from './../repositories/UserRepository'
import { isValidEmail, isValidPassword } from '../utils/validations';
import { encryptPassword, comparePasswords } from '../utils/encryptor';
import {
    EMAIL_ALREADY_IN_USE,
    MISSING_REQUIRED_FIELDS,
    INVALID_PASSWORD,
    INVALID_EMAIL,
    CREDENTIALS_INVALID,
    USER_DELETED_OR_INACTIVE,
    ENV_VARIABLE_NOT_CONFIGURED,
    AUTHENTICATION_SUCCESSFUL,
    AUTHENTICATION_ERROR,
    CREATE_ENTITY_ERROR,
    CREATE_USER_SUCCESS,
    LOGOUT_SUCCESSFUL,
    LOGOUT_ERROR,
    LIST_ENTITY_ERROR,
    DELETE_USER_SUCCESS,
    DELETE_ENTITY_ERROR
  } from '../utils/consts';

  export async function signupService(user: User) {
    try {
      // Verifica se todos os campos obrigatórios foram enviados
      if (!user.username || !user.email || !user.password) {
        return {
          success: false,
          error: MISSING_REQUIRED_FIELDS,
          statusCode: 400,
        };
      }
  
      // Verificar se a senha é válida
      if (!isValidPassword(user.password)) {
        return {
          success: false,
          error: INVALID_PASSWORD,
          statusCode: 400,
        };
      }
  
      // Verificar se o email é válido
      if (!isValidEmail(user.email)) {
        return {
          success: false,
          error: INVALID_EMAIL,
          statusCode: 400,
        };
      }
  
      const emailExists = await checkIfEmailExists(user.email);
      if (emailExists) {
        return {
          success: false,
          error: EMAIL_ALREADY_IN_USE,
          statusCode: 409,
        };
      }
  
      // Criptografa a senha antes de salvar no banco de dados
      const hashedPassword = await encryptPassword(user.password);
      user.password = hashedPassword;
  
      const response = await signup(user);
  
      return {
        success: true,
        data: {
            id: response.rows[0].id,
            email: response.rows[0].email,
            message: CREATE_USER_SUCCESS,
        },
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        error: `${CREATE_ENTITY_ERROR}: ${error}`,
        statusCode: 500,
      };
    }
  }

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
            error: USER_DELETED_OR_INACTIVE };
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

  export async function listService() {
    try {
      const data: User[] = await listUsers(); // Chama a função do repositório para listar usuários
  
      return { success: true, 
        statusCode: 200, 
        data
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${LIST_ENTITY_ERROR}:${error}`
      };
    }
  }

  export async function findService(userId: number) {
    try {
      const userResult = await getUserById(userId); // Chama a função do repositório para buscar usuário
  
      if (userResult.rows.length === 0) {
        // Nenhum usuário encontrado com o ID fornecido
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
  
      // Mapear o resultado para a interface de resposta
      const user: User = userResult.rows[0];
  
      // Verificar se usuário está ativo
      if (!user.is_active) {
        // O usuário não está ativo
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }

      return { success: true, 
        statusCode: 200, 
        data: user
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${FIND_ENTITY_ERROR}:${error}`
      };
    }
  }

  export async function deleteService(userId: number) {
    try {
      const userResult = await getUserById(userId)
      if (userResult.rows.length === 0) {
        // Nenhum usuário encontrado com o ID fornecido
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
  
      // Mapear o resultado para a interface de resposta
      const user: User = userResult.rows[0];
  
      // Verificar se usuário está ativo
      if (!user.is_active) {
        // O usuário não está ativo
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
      await deleteUserById(userId); // Chama a função do repositório para buscar usuário
  
      return { success: true, 
        statusCode: 200, 
        data: {
          message: DELETE_USER_SUCCESS
        }
      };

    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${DELETE_ENTITY_ERROR}:${error}`
      }
    }
  }