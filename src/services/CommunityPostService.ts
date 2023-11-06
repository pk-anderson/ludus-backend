import { ListOrderBy } from './../utils/listOrder';
import { 
    CommunityPost,
    CommunityPostResponse,
 } from "../interfaces/CommunityPost";
import {
    saveCommunityPost,
    updateCommunityPost,
    listCommunityPostsByUserId,
    getCommunityPostById,
    listCommunityPostsByCommunityId,
    deleteCommunityPost
} from "../repositories/CommunityPostRepository";
import { checkIfMemberExists } from '../repositories/MembersRepository';
import {
    CREATE_ENTITY_ERROR,
    FIND_ENTITY_ERROR,
    UPDATE_ENTITY_ERROR,
    LIST_ENTITY_ERROR,
    UNAUTHORIZED_ACCESS,
    DELETE_ENTITY_ERROR,
    NO_CONTENT_ERROR,
    DELETE_POST_SUCCESS,
    NOT_MEMBER_ERROR
} from "../utils/consts";

export async function createCommunityPostService(post: CommunityPost) {
    try {
        // verificar se usuário é membro da comunidade
        const isMember = await checkIfMemberExists(post.user_id, post.community_id)
        if (!isMember) {
            return {
                success: false,
                statusCode: 403,
                error: NOT_MEMBER_ERROR,
            };
        }

        if (!post.content || post.content === '') {
            return {
                success: false,
                statusCode: 400,
                error: NO_CONTENT_ERROR
            };
        }
        const data: CommunityPost = await saveCommunityPost(post);

        return {
            success: true,
            statusCode: 200,
            data
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: `${CREATE_ENTITY_ERROR}:${error}`
        };
    }
}

export async function updateCommunityPostService(post: CommunityPost) {
    try {
        const checkPost = await getCommunityPostById(post.id);

        if (!checkPost) {
            return {
                success: false,
                statusCode: 404,
                error: FIND_ENTITY_ERROR
            };
        }

        if (post.user_id !== checkPost.user_id) {
            return {
                success: false,
                statusCode: 403,
                error: UNAUTHORIZED_ACCESS
            };
        }

        if (!post.content || post.content === '') {
            return {
                success: false,
                statusCode: 400,
                error: NO_CONTENT_ERROR
            };
        }

        const data: CommunityPost = await updateCommunityPost(post);

        return {
            success: true,
            statusCode: 200,
            data
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: `${UPDATE_ENTITY_ERROR}:${error}`
        };
    }
}

export async function listCommunityPostsByUser(userId: number, orderBy: ListOrderBy) {
    try {
        const result = await listCommunityPostsByUserId(userId, orderBy);

        // Transforme o campo image de todos os usuários em URLs base64
        for (const item of result) {
            if (item.image) {
            const dataURL = `data:image/jpeg;base64,${item.image.toString('base64')}`;
            item.image = dataURL;
            }
        }
        const data: CommunityPostResponse[] = result

        return {
            success: true,
            statusCode: 200,
            data
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: `${LIST_ENTITY_ERROR}:${error}`
        };
    }
}

export async function getCommunityPostByIdService(postId: number): Promise<any> {
    try {
        const post = await getCommunityPostById(postId);

        if (!post) {
            return {
                success: false,
                statusCode: 404,
                error: FIND_ENTITY_ERROR
            };
        }

        // Transforme o campo image em uma URL base64
      if (post.image) {
        const dataURL = `data:image/jpeg;base64,${post.image.toString('base64')}`;
        post.image = dataURL;
      }

      const data: CommunityPostResponse = post
        return {
            success: true,
            statusCode: 200,
            data
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: `${FIND_ENTITY_ERROR}:${error}`
        };
    }
}

export async function listCommunityPostsByCommunity(communityId: number, orderBy: ListOrderBy) {
    try {
        const result = await listCommunityPostsByCommunityId(communityId, orderBy);

        // Transforme o campo image de todos os usuários em URLs base64
        for (const item of result) {
            if (item.image) {
            const dataURL = `data:image/jpeg;base64,${item.image.toString('base64')}`;
            item.image = dataURL;
            }
        }
        const data: CommunityPostResponse[] = result

        return {
            success: true,
            statusCode: 200,
            data
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: `${LIST_ENTITY_ERROR}:${error}`
        };
    }
}

export async function deleteCommunityPostService(postId: number, userId: number) {
    try {
        const post: CommunityPost = await getCommunityPostById(postId);

        if (!post) {
            return {
                success: false,
                statusCode: 404,
                error: FIND_ENTITY_ERROR
            };
        }

        if (post.user_id !== userId) {
            return {
                success: false,
                statusCode: 403,
                error: UNAUTHORIZED_ACCESS
            };
        }

        await deleteCommunityPost(postId);

        return {
            success: true,
            statusCode: 200,
            message: DELETE_POST_SUCCESS
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: `${DELETE_ENTITY_ERROR}:${error}`
        };
    }
}