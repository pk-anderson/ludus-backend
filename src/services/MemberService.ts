import { Community } from './../interfaces/Community';
import { Member } from './../interfaces/Member';
import {
    getCommunityById,
} from '../repositories/CommunityRepository'
import {
    checkIfMemberExists,
    updateFollow,
    followCommunity,
    listMembers,
    unfollowCommunity
} from '../repositories/MembersRepository'
import { 
    CREATE_ENTITY_ERROR,
    FIND_ENTITY_ERROR,
    FOLLOW_OWN_COMMUNITY_ERROR,
    FOLLOWING_COMMUNITY_ERROR,
    FOLLOWING_COMMUNITY,
    LIST_ENTITY_ERROR,
    NOT_FOLLOWING_COMMUNITY_ERROR,
    UNFOLLOWING_COMMUNITY
 } from './../utils/consts';


export async function followService(userId: number, communityId: number) {
    try {
      const community: Community = await getCommunityById(communityId)
      if (!community) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR
        };
      }

      if (community.id_creator === userId) {
        return { success: false, 
            statusCode: 400, 
            error: FOLLOW_OWN_COMMUNITY_ERROR
          };
      }

      const memberExists = await checkIfMemberExists(userId, communityId)
      if (memberExists) {
        if (memberExists.deleted_at) {
            await updateFollow(memberExists.id)
        } else {
            return { success: false, 
                statusCode: 400, 
                error: `${FOLLOWING_COMMUNITY_ERROR}`
              };
        }
      }
      
      await followCommunity(userId, communityId)

      return { success: true, 
        statusCode: 200,
        message: FOLLOWING_COMMUNITY 
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${CREATE_ENTITY_ERROR}:${error}`
      };
    }
  }

  export async function listService(communityId: number) {
    try {
      const community: Community = await getCommunityById(communityId)
      if (!community) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR
        };
      }
      
      const data: Member[] = await listMembers(communityId)

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

  export async function unfollowService(userId: number, communityId: number) {
    try {
      const community: Community = await getCommunityById(communityId)
      if (!community) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR
        };
      }

      const memberExists = await checkIfMemberExists(userId, communityId)
      if (!memberExists) {
            return { success: false, 
                statusCode: 400, 
                error: `${NOT_FOLLOWING_COMMUNITY_ERROR}`
              };
      }
      
      await unfollowCommunity(userId, communityId)

      return { success: true, 
        statusCode: 200,
        message: UNFOLLOWING_COMMUNITY 
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${CREATE_ENTITY_ERROR}:${error}`
      };
    }
  }