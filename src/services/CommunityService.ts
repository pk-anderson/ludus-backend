import { Community } from './../interfaces/Community';
import {
    createCommunity,
    listCommunities,
    listUserCommunities,
    getCommunityById,
    updateCommunity,
    deleteCommunity, 
    getInactiveCommunity,
    reactivateCommunity
} from '../repositories/CommunityRepository'
import {
  getUserById,
} from '../repositories/UserRepository'
import {
    CREATE_ENTITY_ERROR,
    LIST_ENTITY_ERROR,
    FIND_ENTITY_ERROR,
    UNAUTHORIZED_ACCESS,
    UPDATE_COMMUNITY_SUCCESS,
    UPDATE_ENTITY_ERROR,
    DELETE_COMMUNITY_SUCCESS,
    DELETE_ENTITY_ERROR,
    REACTIVATE_COMMUNITY_SUCCESS,
    REACTIVATE_ERROR
} from '../utils/consts';

export async function createService(community: Community) {
    try {
      const data = await createCommunity(community)
  
      return { success: true, 
        statusCode: 200, 
        data: data
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${CREATE_ENTITY_ERROR}:${error}`
      };
    }
  }

  export async function listService() {
    try {
      const data: Community[] = await listCommunities()
  
      return { success: true, 
        statusCode: 200, 
        data: data
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${LIST_ENTITY_ERROR}:${error}`
      };
    }
  }

  export async function listByUserService(userId: number, isActive: boolean) {
    try {
      // Chama a função do repositório para verificar se usuário existe
      const userResult = await getUserById(userId); 
  
      if (!userResult || !userResult.is_active) {
        // Nenhum usuário encontrado com o ID fornecido
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR 
        };
      }

      const data: Community[] = await listUserCommunities(userId, isActive)
  
      return { success: true, 
        statusCode: 200, 
        data: data
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${LIST_ENTITY_ERROR}:${error}`
      };
    }
  }

  export async function findService(communityId: number) {
    try {
      const data: Community = await getCommunityById(communityId)

      if (!data) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR
        };
      }
  
      return { success: true, 
        statusCode: 200, 
        data: data
      };
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${FIND_ENTITY_ERROR}:${error}`
      };
    }
  }

  export async function updateService(community: Community) {
    try {
      let communityUpdate: Community = await getCommunityById(community.id)

      if (!communityUpdate) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR
        };
      }
      if (communityUpdate.id_creator !== community.id_creator ) {
        return { success: false, 
          statusCode: 403, 
          error: UNAUTHORIZED_ACCESS
        };
      }

      // Atualizar apenas os campos informados e manter os demais inalterados
     communityUpdate = {
      ...communityUpdate,
      name: community.name || communityUpdate.name,
      description: community.description || communityUpdate.description,
      updated_at: new Date(),
    };

    const data = await updateCommunity(communityUpdate)
  
      return { success: true, 
        statusCode: 200, 
        data: {
          message: UPDATE_COMMUNITY_SUCCESS,
          data
      } 
    }
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${UPDATE_ENTITY_ERROR}:${error}`
      };
    }
  }

  export async function deleteService(communityId: number, userId: number) {
    try {
      const community: Community = await getCommunityById(communityId)

      if (!community) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR
        };
      }
      if (community.id_creator !== userId ) {
        return { success: false, 
          statusCode: 403, 
          error: UNAUTHORIZED_ACCESS
        };
      }

    await deleteCommunity(communityId)
  
      return { success: true, 
        statusCode: 200, 
        message: DELETE_COMMUNITY_SUCCESS,
    }
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${DELETE_ENTITY_ERROR}:${error}`
      };
    }
  }

  export async function reactivateService(communityId: number, userId: number) {
    try {
      const community: Community = await getInactiveCommunity(communityId)

      if (!community) {
        return { success: false, 
          statusCode: 404, 
          error: FIND_ENTITY_ERROR
        };
      }
      if (community.id_creator !== userId ) {
        return { success: false, 
          statusCode: 403, 
          error: UNAUTHORIZED_ACCESS
        };
      }

      await reactivateCommunity(communityId)
  
      return { success: true, 
        statusCode: 200, 
        message: REACTIVATE_COMMUNITY_SUCCESS,
    }
    } catch (error) {
      return { success: false, 
        statusCode: 500, 
        error: `${REACTIVATE_ERROR}:${error}`
      };
    }
  }