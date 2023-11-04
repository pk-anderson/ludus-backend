import { CommentOrderBy } from './../interfaces/Comment';
import { pool } from '../index'; 
import { CommunityPost } from '../interfaces/CommunityPost';
import getOrderClause from '../utils/listOrder';

export async function saveCommunityPost(post: CommunityPost) {
    try {
        const insertPostQuery = `
            INSERT INTO tb_community_posts (user_id, community_id, content, image, created_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING *`;

        const insertPostValues = [post.user_id, post.community_id, post.content, post.image];
        const result = await pool.query(insertPostQuery, insertPostValues);

        // Retorna o post inserido
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function updateCommunityPost(post: CommunityPost) {
    try {
        const updatePostQuery = `
            UPDATE tb_community_posts 
            SET content = $2, image = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *`;

        const updatePostValues = [post.id, post.content, post.image];
        const result = await pool.query(updatePostQuery, updatePostValues);

        // Retorna a postagem atualizada
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function deleteCommunityPost(postId: number) {
    try {
        const deletePostQuery = `
            UPDATE tb_community_posts 
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *`;

        const result = await pool.query(deletePostQuery, [postId]);

        // Retorna a postagem deletada
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function getCommunityPostById(postId: number) {
    try {
        const getPostQuery = `
            SELECT * FROM tb_community_posts 
            WHERE id = $1 AND deleted_at IS NULL`;

        const result = await pool.query(getPostQuery, [postId]);

        // Retorna a postagem encontrada por ID
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listCommunityPostsByUserId(userId: number, orderBy: CommentOrderBy) {
    try {
        const orderClause = getOrderClause(orderBy);
        const getPostsQuery = `
            SELECT * FROM tb_community_posts 
            WHERE user_id = $1 AND deleted_at IS NULL
            ${orderClause}`;

        const result = await pool.query(getPostsQuery, [userId]);

        // Retorna a lista de postagens do usuário
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listCommunityPostsByCommunityId(communityId: number, orderBy: CommentOrderBy) {
    try {
        const orderClause = getOrderClause(orderBy);
        const getPostsQuery = `
            SELECT * FROM tb_community_posts 
            WHERE community_id = $1 AND deleted_at IS NULL
            ${orderClause}`;

        const result = await pool.query(getPostsQuery, [communityId]);

        // Retorna a lista de postagens da comunidade
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}