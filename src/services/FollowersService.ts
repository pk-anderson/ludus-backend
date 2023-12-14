import { Follower } from './../interfaces/Followers';
import { getUserById } from '../repositories/UserRepository';
import { 
    checkIfFollowingExists,
    updateFollowStatus,
    followUser,
    unfollowUser,
    listFollowers,
    listFollowing
} from '../repositories/FollowersRepository';
import { 
    LIST_ENTITY_ERROR,
    FIND_ENTITY_ERROR,
    ALREADY_FOLLOWING,
    FOLLOW_SUCCESS,
    NOT_FOLLOWING,
    UNFOLLOW_SUCCESS,
    UNFOLLOWING_ERROR,
    OWN_USER_FOLLOW 
} from './../utils/consts'
import { convertByteaToBase64 } from '../utils/encryptor';
import { checkFollowAchievement } from '../achievements/Follower';

export async function followService(userId: number, followingId: number) {
    try {
        if (userId === followingId) {
            return { success: false, 
                statusCode: 400, 
                error: OWN_USER_FOLLOW 
            };
        }

        const userResult =  await getUserById(followingId)
        if (!userResult || !userResult.is_active) {
            // Nenhum usuário encontrado com o ID fornecido
            return { success: false, 
                statusCode: 404, 
                error: FIND_ENTITY_ERROR 
            };
        }

        // Verificar se usuário já está seguindo este usuário
        const isFollowing = await checkIfFollowingExists(userId, followingId)
        if (isFollowing.length > 0) {
            // O usuário já está seguindo o usuário alvo
            const existingFollowing = isFollowing[0];
            if (existingFollowing.deleted_at) {
                // Se o campo deleted_at estiver preenchido, atualizar para o momento do novo follow
                const { total } = await updateFollowStatus(userId, followingId)
                await checkFollowAchievement(userId, total)
            } else {
                // Usuário já está sendo seguido
                return { success: false, 
                    statusCode: 400, 
                    error: ALREADY_FOLLOWING 
                };
            }
        } else {          
                // O usuário ainda não está seguindo o usuário alvo, então fazemos um novo follow
                const { total } = await followUser(userId, followingId)
                await checkFollowAchievement(userId, total)
        }

        return { success: true, 
            statusCode: 200, 
            data: {
                message: FOLLOW_SUCCESS 
            }
        };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${LIST_ENTITY_ERROR}:${error}`
      };
    }
  }

  export async function unfollowService(userId: number, followingId: number) {
    try {
      const userResult =  await getUserById(followingId)
      if (!userResult || !userResult.is_active) {
          // Nenhum usuário encontrado com o ID fornecido
          return { success: false, 
            statusCode: 404, 
            error: FIND_ENTITY_ERROR 
          };
      }

      // Verificar se usuário já está seguindo este usuário
      const isFollowing = await checkIfFollowingExists(userId, followingId)
      if (isFollowing.length === 0) {
        return { success: false, 
            statusCode: 400, 
            error: NOT_FOLLOWING 
          };
      }
      if (isFollowing[0].deleted_at) {
        return { success: false, 
            statusCode: 400, 
            error: NOT_FOLLOWING 
          };
      } else {
        // O usuário está seguindo o usuário alvo, realizar unfollow
        await unfollowUser(userId, followingId)
      }
     
      return { success: true, 
        statusCode: 200, 
        data: {
            message: UNFOLLOW_SUCCESS 
        }
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${UNFOLLOWING_ERROR}:${error}`
      };
    }
  }

  export async function listFollowersService(userId: number) {
    try {
        const userResult =  await getUserById(userId)
      if (!userResult || !userResult.is_active) {
          // Nenhum usuário encontrado com o ID fornecido
          return { success: false, 
            statusCode: 404, 
            error: FIND_ENTITY_ERROR 
          };
      }

      const result = await listFollowers(userId)

      // Transforme o campo profile_pic de todos os usuários em URLs base64
      for (const item of result) {
        item.profile_pic = convertByteaToBase64(item.profile_pic);
      }

      const data: Follower[] = result

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

  export async function listFollowingService(userId: number) {
    try {
        const userResult =  await getUserById(userId)
      if (!userResult || !userResult.is_active) {
          // Nenhum usuário encontrado com o ID fornecido
          return { success: false, 
            statusCode: 404, 
            error: FIND_ENTITY_ERROR 
          };
      }

      const result = await listFollowing(userId)

      // Transforme o campo profile_pic de todos os usuários em URLs base64
      for (const item of result) {
        item.profile_pic = convertByteaToBase64(item.profile_pic);
      }

      const data: Follower[] = result

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
