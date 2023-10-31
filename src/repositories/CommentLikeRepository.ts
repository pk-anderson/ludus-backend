import { pool } from '../index';

// Verificar se o usuário já deu like (isLike = true) ou dislike (isLike = false) num comentário
export async function checkLikeDislikeExists(user_id: number, comment_id: number, isLike: boolean) {
    const tableName = isLike ? 'tb_comment_likes' : 'tb_comment_dislikes';
    const result = await pool.query(`SELECT id FROM ${tableName} WHERE user_id = $1 AND comment_id = $2`, [user_id, comment_id]);
    return result.rows.length > 0;
}

// Adicionar like
export async function addLike(user_id: number, comment_id: number) {
    try {
        // Insere um novo like na tabela tb_likes
        const insertLikeQuery = 'INSERT INTO tb_comment_likes (user_id, comment_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id';
        const insertLikeValues = [user_id, comment_id];
        const likeResult = await pool.query(insertLikeQuery, insertLikeValues);

        // Obtém o ID do like inserido
        return likeResult.rows[0].id;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Adicionar dislike
export async function addDislike(user_id: number, comment_id: number) {
    try {
        // Insere um novo dislike na tabela tb_dislikes
        const insertDislikeQuery = 'INSERT INTO tb_comment_dislikes (user_id, comment_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id';
        const insertDislikeValues = [user_id, comment_id];
        const dislikeResult = await pool.query(insertDislikeQuery, insertDislikeValues);

        // Obtém o ID do dislike inserido
        return dislikeResult.rows[0].id;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Remover like
export async function removeLike(user_id: number, comment_id: number) {
    try {
        const deleteLikeQuery = 'DELETE FROM tb_comment_likes WHERE user_id = $1 AND comment_id = $2';
        const deleteLikeValues = [user_id, comment_id];
        await pool.query(deleteLikeQuery, deleteLikeValues);
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Buscar dados de todos os usuários que deram like em um comentário
export async function getUsersWhoLikedComment(commentId: number) {
    try {
        const getUsersQuery = `
            SELECT u.id, u.username, u.email, u.profile_pic
            FROM tb_users u
            JOIN tb_comment_likes l ON u.id = l.user_id
            WHERE l.comment_id = $1 AND u.is_active = true`;
        const result = await pool.query(getUsersQuery, [commentId]);
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Buscar dados de todos os usuários que deram dislike em um comentário
export async function getUsersWhoDislikedComment(commentId: number) {
    try {
        const getUsersQuery = `
            SELECT u.id, u.username, u.email, u.profile_pic
            FROM tb_users u
            JOIN tb_comment_dislikes d ON u.id = d.user_id
            WHERE d.comment_id = $1 AND u.is_active = true`;
        const result = await pool.query(getUsersQuery, [commentId]);
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Remover dislike
export async function removeDislike(user_id: number, comment_id: number) {
    try {
        const deleteDislikeQuery = 'DELETE FROM tb_comment_dislikes WHERE user_id = $1 AND comment_id = $2';
        const deleteDislikeValues = [user_id, comment_id];
        await pool.query(deleteDislikeQuery, deleteDislikeValues);
    } catch (error) {
        throw new Error(`${error}`);
    }
}