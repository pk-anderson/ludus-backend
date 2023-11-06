import { pool } from '../index'; 
import { Comment } from '../interfaces/Comment';
import { ListOrderBy, getCommentOrderClause } from './../utils/listOrder';
 
//Função para inserir comentário na tabela tb_comments
export async function postComment(comment: Comment) {
    try {
        const insertCommentQuery =
            'INSERT INTO tb_comments (user_id, game_id, content, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *';
        const insertCommentValues = [comment.user_id, comment.game_id, comment.content];
        const result = await pool.query(insertCommentQuery, insertCommentValues);

        // Retorna o comentário inserido
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Atualizar conteúdo de comentário
export async function updateComment(commentId: number, content: string) {
    try {
        const updateCommentQuery = 'UPDATE tb_comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
        const updateCommentValues = [content, commentId];
        const result = await pool.query(updateCommentQuery, updateCommentValues);

        // Retorna o comentário atualizado
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Obter um comentário específico pelo ID, considerando likes e dislikes
export async function getCommentById(commentId: number) {
    try {
        const getCommentQuery = `
            SELECT c.*, 
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_comments c
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS like_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'comment' AND is_like = true 
                GROUP BY entity_id
            ) l ON c.id = l.entity_id
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS dislike_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'comment' AND is_like = false 
                GROUP BY entity_id
            ) d ON c.id = d.entity_id
            WHERE c.id = $1 AND c.deleted_at IS NULL`;

        const result = await pool.query(getCommentQuery, [commentId]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Listar todos os comentários de um usuário, considerando likes e dislikes
export async function listCommentsByUserId(userId: number, orderBy: ListOrderBy = ListOrderBy.RECENT) {
    try {
        const orderByClause = getCommentOrderClause(orderBy);

        const getCommentsQuery = `
            SELECT c.*, 
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_comments c
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS like_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'comment' AND is_like = true 
                GROUP BY entity_id
            ) l ON c.id = l.entity_id
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS dislike_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'comment' AND is_like = false 
                GROUP BY entity_id
            ) d ON c.id = d.entity_id
            WHERE c.user_id = $1 AND c.deleted_at IS NULL
            ${orderByClause}`;

        const result = await pool.query(getCommentsQuery, [userId]);
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Listar todos os comentários para um jogo, considerando likes e dislikes
export async function listCommentsByGameId(gameId: number, orderBy: ListOrderBy) {
    try {
        const orderByClause = getCommentOrderClause(orderBy);

        const getCommentsQuery = `
            SELECT c.*, 
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_comments c
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS like_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'comment' AND is_like = true 
                GROUP BY entity_id
            ) l ON c.id = l.entity_id
            LEFT JOIN (
                SELECT entity_id, COUNT(*) AS dislike_count 
                FROM tb_likes_dislikes 
                WHERE entity_type = 'comment' AND is_like = false 
                GROUP BY entity_id
            ) d ON c.id = d.entity_id
            WHERE c.game_id = $1 AND c.deleted_at IS NULL
            ${orderByClause}`;

        const result = await pool.query(getCommentsQuery, [gameId]);
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Deletar comentário
export async function deleteComment(commentId: number) {
    try {
        // Executa a consulta SQL para atualizar o campo deleted_at para o momento atual
        const deleteCommentQuery = 'UPDATE tb_comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
        const result = await pool.query(deleteCommentQuery, [commentId]);

        // Retorna o comentário marcado como deletado
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}