import { User, UserResponse } from './../interfaces/User';
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
    FIND_ENTITY_ERROR
  } from '../utils/consts';
  import { listGamesByLibrary } from './GameService';
  import { convertByteaToBase64 } from '../utils/encryptor';

  export async function signupService(user: User) {
    try {
      if (!user.username || !user.email || !user.password) {
        return {
          success: false,
          error: MISSING_REQUIRED_FIELDS,
          statusCode: 400,
        };
      }
  
      if (!isValidPassword(user.password)) {
        return {
          success: false,
          error: INVALID_PASSWORD,
          statusCode: 400,
        };
      }
  
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
      const userResult = await listUsers(); 

      for (const item of userResult) {
          item.profile_pic = convertByteaToBase64(item.profile_pic);
      }

      const data: UserResponse[] = userResult
  
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
      const userResult = await getUserById(userId); 
  
      if (!userResult || !userResult.is_active) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
      userResult.profile_pic = convertByteaToBase64(userResult.profile_pic);

      const user: UserResponse = userResult;

      const response = await listGamesByLibrary(userId)

      if (response.success === false) {
        return { success: false, 
          statusCode: 500, 
          error: `${FIND_ENTITY_ERROR}:${response.error}`
        };
      }

      user.games = response.data

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
      const userResult = await getUserById(userId); 
  
      if (!userResult || !userResult.is_active) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
      const user: User = userResult;

      if (!user.profile_pic) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
      const base64ImageData = Buffer.from(user.profile_pic).toString('base64');
      const imgURL = `data:image/jpeg;base64,${base64ImageData}`;

      return { success: true, 
        statusCode: 200, 
        data: {
          imgURL
        }
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
      if (!userResult || !userResult.is_active) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }  

      await deleteUserById(userId); 
  
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
      if (!userResult || !userResult.is_active) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
      const updatedUser: User = userResult;
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
      if (!userResult || userResult.is_active) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }
      const user: User = userResult;
      const isPasswordMatch = await comparePasswords(password, user.password);
      if (!isPasswordMatch) {
        return { success: false, 
          statusCode: 400, 
          error: CREDENTIALS_INVALID 
        };
      }

      await reactivateUser(user.id); 
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
        expiresIn: '24h',
      });
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
      if (!isValidPassword(password)) {
        return {
          success: false,
          error: INVALID_PASSWORD,
          statusCode: 400,
        };
      }

      const hashedPassword = await encryptPassword(password);

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