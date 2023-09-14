import { User } from './../interfaces/User';
import { generateSessionId } from '../utils/uuid';
import jwt from 'jsonwebtoken';
import { 
    checkIfEmailExists, 
    signup,
    getUserByEmail,
    listUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    reactivateUser,
    updatePassword
} from './../repositories/UserRepository'
import {  createAccessToken } from './../repositories/AccessRepository'
import { isValidEmail, isValidPassword } from '../utils/validations';
import { encryptPassword, comparePasswords } from '../utils/encryptor';
import {
    EMAIL_ALREADY_IN_USE,
    MISSING_REQUIRED_FIELDS,
    INVALID_PASSWORD,
    INVALID_EMAIL,
    CREDENTIALS_INVALID,
    ENV_VARIABLE_NOT_CONFIGURED,
    CREATE_ENTITY_ERROR,
    CREATE_USER_SUCCESS,
    LIST_ENTITY_ERROR,
    DELETE_USER_SUCCESS,
    DELETE_ENTITY_ERROR,
    UPDATE_USER_SUCCESS,
    UPDATE_ENTITY_ERROR,
    REACTIVATE_ERROR,
    FIND_ENTITY_ERROR
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
  
      if (!userResult) {
        // Nenhum usuário encontrado com o ID fornecido
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
      // Mapear o resultado para a interface de resposta
      const user: User = userResult;
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

  export async function profilePicService(userId: number) {
    try {
      const userResult = await getUserById(userId); // Chama a função do repositório para buscar usuário
  
      if (!userResult) {
        // Nenhum usuário encontrado com o ID fornecido
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
      // Mapear o resultado para a interface de resposta
      const user: User = userResult;
      // Verificar se usuário está ativo
      if (!user.is_active) {
        // O usuário não está ativo
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }

      if (!user.profile_pic) {
        // imagem de perfil não existe
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
      // Converter Uint8Array para base64
      const base64ImageData = Buffer.from(user.profile_pic).toString('base64');
      // Criar a URL de dados
      const imgURL = `data:image/jpeg;base64,${base64ImageData}`;

      return { success: true, 
        statusCode: 200, 
        imgURL
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
      if (!userResult) {
        // Nenhum usuário encontrado com o ID fornecido
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
  
      // Mapear o resultado para a interface de resposta
      const user: User = userResult;
  
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

  export async function updateService(user: User) {
    try {
      const userResult = await getUserById(user.id)
      if (!userResult) {
        // Nenhum usuário encontrado com o ID fornecido
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
      // Mapear o resultado para a interface de resposta
      const updatedUser: User = userResult;
      // Verificar se usuário está ativo
      if (!updatedUser.is_active) {
        // O usuário não está ativo
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
    // Verificar e modificar apenas os campos fornecidos no corpo da requisição
    if (user.username !== undefined) {
      updatedUser.username = user.username;
    }

    if (user.email !== undefined) {
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

      updatedUser.email = user.email;
    }

    if (user.profile_pic !== undefined) {
      updatedUser.profile_pic = user.profile_pic;
    }

    if (user.bio !== undefined) {
      updatedUser.bio = user.bio;
    }

    // Incluir o campo 'updated_at' no objeto do usuário e adicionar a data atual como valor
    updatedUser.updated_at = new Date();

    await updateUserById(updatedUser)
  
    return { success: true, 
      statusCode: 200, 
      data: {
        message: UPDATE_USER_SUCCESS
      }
    };

    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${UPDATE_ENTITY_ERROR}:${error}`
      }
    }
  }

  export async function reactivateService(email: string, password: string ) {
    try {
      const userResult = await getUserByEmail(email)
      if (!userResult) {
        // Nenhum usuário encontrado com o email fornecido
        return { success: false, 
          statusCode: 400, 
          error: CREDENTIALS_INVALID 
        };
      }
  
      // Mapear o resultado para a interface de resposta
      const user: User = userResult;
  
      // Verificar se usuário está ativo
      if (user.is_active) {
        // O usuário já está ativo
        return { success: false, 
          statusCode: 400, 
          error: REACTIVATE_ERROR 
        };
      }
      // Compara a senha digitada com a senha criptografada armazenada no banco de dados
      const isPasswordMatch = await comparePasswords(password, user.password);
      if (!isPasswordMatch) {
        return { success: false, 
          statusCode: 400, 
          error: CREDENTIALS_INVALID 
        };
      }

      await reactivateUser(user.id); // Chama a função do repositório para reativar usuário
      // Autenticação bem-sucedida, gerar o token JWT
      const sessionId = generateSessionId();
      const tokenPayload = {
        id: user.id,
        email: user.email,
        sessionId: sessionId,
        username: user.username,
        revoked: false
      };

      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        return { success: false, 
            statusCode: 500, 
            error: ENV_VARIABLE_NOT_CONFIGURED };
      }

      const token = jwt.sign(tokenPayload, secretKey, {
        expiresIn: '24h', // Define o tempo de expiração do token
      });

      // Salvar o token na tabela tb_access
      await createAccessToken(user.id, token, sessionId);

      return { success: true, 
        statusCode: 200, 
        data: {
          message: UPDATE_USER_SUCCESS,
          token 
        }
      };

    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${UPDATE_ENTITY_ERROR}:${error}`
      }
    }
  }

  export async function updatePasswordService(userId: number, password: string ) {
    try {
      // Verificar se a senha é válida
      if (!isValidPassword(password)) {
        return {
          success: false,
          error: INVALID_PASSWORD,
          statusCode: 400,
        };
      }

      // Criptografar a nova senha
      const hashedPassword = await encryptPassword(password);

      // Atualizar a senha do usuário
      await updatePassword(userId, hashedPassword);

      return { success: true, 
        statusCode: 200, 
        data: {
          message: UPDATE_USER_SUCCESS,
        }
      };

    } catch (error) {
        return { success: false, 
          statusCode: 500, 
          error: `${UPDATE_ENTITY_ERROR}:${error}`
        }
    }
  }