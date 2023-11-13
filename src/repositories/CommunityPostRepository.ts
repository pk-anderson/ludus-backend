import { ListOrderBy, getPostOrderClause } from './../utils/listOrder';
import { pool } from '../index'; 
import { CommunityPost } from '../interfaces/CommunityPost';

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
            SELECT p.*, 
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_community_posts p
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS like_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'community_post' AND is_like = true 
                GROUP BY entity_id
            ) l ON p.id = l.entity_id
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS dislike_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'community_post' AND is_like = false 
                GROUP BY entity_id
            ) d ON p.id = d.entity_id
            WHERE p.id = $1 AND p.deleted_at IS NULL`;

        const result = await pool.query(getPostQuery, [postId]);

        // Retorna o post de comunidade encontrado por ID
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listCommunityPostsByUserId(userId: number, orderBy: ListOrderBy) {
    try {
        const orderClause = getPostOrderClause(orderBy);
        const getPostsQuery = `
            SELECT p.*, 
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_community_posts p
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS like_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'community_post' AND is_like = true 
                GROUP BY entity_id
            ) l ON p.id = l.entity_id
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS dislike_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'community_post' AND is_like = false 
                GROUP BY entity_id
            ) d ON p.id = d.entity_id
            WHERE p.user_id = $1 AND p.deleted_at IS NULL
            ${orderClause}`;

        const result = await pool.query(getPostsQuery, [userId]);

        // Retorna a lista de posts de comunidade do usuário
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listCommunityPostsByCommunityId(communityId: number, orderBy: ListOrderBy) {
    try {
        const orderClause = getPostOrderClause(orderBy);
        const getPostsQuery = `
            SELECT p.*, 
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_community_posts p
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS like_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'community_post' AND is_like = true 
                GROUP BY entity_id
            ) l ON p.id = l.entity_id
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS dislike_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'community_post' AND is_like = false 
                GROUP BY entity_id
            ) d ON p.id = d.entity_id
            WHERE p.community_id = $1 AND p.deleted_at IS NULL
            ${orderClause}`;

        const result = await pool.query(getPostsQuery, [communityId]);

        // Retorna a lista de posts de comunidade da comunidade
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}