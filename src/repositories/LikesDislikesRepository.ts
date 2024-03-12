import { pool } from '../index';
import { EntityType } from '../interfaces/LikesDislikes';

export async function checkLikeDislikeExists(userId: number, entityId: number, entityType: EntityType) {
    try {
        const checkLikesQuery = 'SELECT * FROM tb_likes_dislikes WHERE user_id = $1 AND entity_id = $2 AND entity_type = $3';
        const result = await pool.query(checkLikesQuery, [userId, entityId, entityType]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function addLike(userId: number, entityId: number, entityType: EntityType) {
    try {
        const insertLikeQuery = 'INSERT INTO tb_likes_dislikes (user_id, entity_id, entity_type, is_like, created_at) VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP) RETURNING id';
        const insertLikeValues = [userId, entityId, entityType];
        const likeResult = await pool.query(insertLikeQuery, insertLikeValues);

        return likeResult.rows[0].id;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function addDislike(userId: number, entityId: number, entityType: EntityType) {
    try {
        const insertDislikeQuery = 'INSERT INTO tb_likes_dislikes (user_id, entity_id, entity_type, is_like, created_at) VALUES ($1, $2, $3, false, CURRENT_TIMESTAMP) RETURNING id';
        const insertDislikeValues = [userId, entityId, entityType];
        const dislikeResult = await pool.query(insertDislikeQuery, insertDislikeValues);

        return dislikeResult.rows[0].id;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function updateLikeDislike(id: number, isLike: boolean): Promise<boolean> {
    try {
        const updateQuery = 'UPDATE tb_likes_dislikes SET is_like = $1 WHERE id = $2';
        const result = await pool.query(updateQuery, [isLike, id]);

        return result.rowCount > 0; 
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function removeLikeDislike(userId: number, entityId: number, entityType: EntityType) {
    try {
        const deleteLikeQuery = 'DELETE FROM tb_likes_dislikes WHERE user_id = $1 AND entity_id = $2 AND entity_type = $3';
        const deleteLikeValues = [userId, entityId, entityType];
        await pool.query(deleteLikeQuery, deleteLikeValues);
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listUsersWhoLikedEntity(entityId: number, entityType: EntityType) {
    try {
        const getUsersQuery = `
            SELECT u.id, u.username, u.email, u.profile_pic
            FROM tb_users u
            JOIN tb_likes_dislikes ld ON u.id = ld.user_id
            WHERE ld.entity_id = $1 AND ld.entity_type = $2 AND ld.is_like = true AND u.is_active = true`;
        const result = await pool.query(getUsersQuery, [entityId, entityType]);
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listUsersWhoDislikedEntity(entityId: number, entityType: EntityType) {
    try {
        const getUsersQuery = `
            SELECT u.id, u.username, u.email, u.profile_pic
            FROM tb_users u
            JOIN tb_likes_dislikes ld ON u.id = ld.user_id
            WHERE ld.entity_id = $1 AND ld.entity_type = $2 AND ld.is_like = false AND u.is_active = true`;
        const result = await pool.query(getUsersQuery, [entityId, entityType]);
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}