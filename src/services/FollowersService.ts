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
            return { success: false, 
                statusCode: 404, 
                error: FIND_ENTITY_ERROR 
            };
        }

        const isFollowing = await checkIfFollowingExists(userId, followingId)
        if (isFollowing.length > 0) {
            const existingFollowing = isFollowing[0];
            if (existingFollowing.deleted_at) {
                const { total } = await updateFollowStatus(userId, followingId)
                await checkFollowAchievement(userId, total)
            } else {
                return { success: false, 
                    statusCode: 400, 
                    error: ALREADY_FOLLOWING 
                };
            }
        } else {          
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
          return { success: false, 
            statusCode: 404, 
            error: FIND_ENTITY_ERROR 
          };
      }
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
          return { success: false, 
            statusCode: 404, 
            error: FIND_ENTITY_ERROR 
          };
      }

      const result = await listFollowers(userId)
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
          return { success: false, 
            statusCode: 404, 
            error: FIND_ENTITY_ERROR 
          };
      }

      const result = await listFollowing(userId)

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
