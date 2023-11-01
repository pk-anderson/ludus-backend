import { pool } from '../index';

// Verificar se o usuário já deu like ou dislike
export async function checkLikeDislikeExists(userId: number, commentId: number) {
    try {
        const checkLikesQuery = 'SELECT id FROM tb_comment_likes WHERE user_id = $1 AND comment_id = $2';
        const checkDislikesQuery = 'SELECT id FROM tb_comment_dislikes WHERE user_id = $1 AND comment_id = $2';

        const likesResult = await pool.query(checkLikesQuery, [userId, commentId]);
        const dislikesResult = await pool.query(checkDislikesQuery, [userId, commentId]);

        const hasLiked = likesResult.rows.length > 0;
        const hasDisliked = dislikesResult.rows.length > 0;

        return { hasLiked, hasDisliked };
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Adicionar like
export async function addLike(userId: number, commentId: number) {
    try {
        // Insere um novo like na tabela tb_likes
        const insertLikeQuery = 'INSERT INTO tb_comment_likes (user_id, comment_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id';
        const insertLikeValues = [userId, commentId];
        const likeResult = await pool.query(insertLikeQuery, insertLikeValues);

        // Obtém o ID do like inserido
        return likeResult.rows[0].id;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Adicionar dislike
export async function addDislike(userId: number, commentId: number) {
    try {
        // Insere um novo dislike na tabela tb_dislikes
        const insertDislikeQuery = 'INSERT INTO tb_comment_dislikes (user_id, comment_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id';
        const insertDislikeValues = [userId, commentId];
        const dislikeResult = await pool.query(insertDislikeQuery, insertDislikeValues);

        // Obtém o ID do dislike inserido
        return dislikeResult.rows[0].id;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Remover like
export async function removeLike(userId: number, commentId: number) {
    try {
        const deleteLikeQuery = 'DELETE FROM tb_comment_likes WHERE user_id = $1 AND comment_id = $2';
        const deleteLikeValues = [userId, commentId];
        await pool.query(deleteLikeQuery, deleteLikeValues);
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Remover dislike
export async function removeDislike(userId: number, commentId: number) {
    try {
        const deleteDislikeQuery = 'DELETE FROM tb_comment_dislikes WHERE user_id = $1 AND comment_id = $2';
        const deleteDislikeValues = [userId, commentId];
        await pool.query(deleteDislikeQuery, deleteDislikeValues);
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Buscar dados de todos os usuários que deram like em um comentário
export async function listUsersWhoLikedComment(commentId: number) {
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
export async function listUsersWhoDislikedComment(commentId: number) {
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