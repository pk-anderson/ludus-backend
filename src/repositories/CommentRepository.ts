import { pool } from '../index'; 
import { 
    Comment,
    CommentOrderBy
 } from '../interfaces/Comment';
 import getOrderClause from '../utils/listOrder';
 
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

// Buscar comentário por id
export async function getCommentById(commentId: number) {
    try {
        const getCommentQuery = `
            SELECT c.*, 
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_comments c
            LEFT JOIN (
                SELECT comment_id, COUNT(*) AS like_count FROM tb_comment_likes GROUP BY comment_id
            ) l ON c.id = l.comment_id
            LEFT JOIN (
                SELECT comment_id, COUNT(*) AS dislike_count FROM tb_comment_dislikes GROUP BY comment_id
            ) d ON c.id = d.comment_id
            WHERE c.id = $1 and c.deleted_at is NULL`;
        const result = await pool.query(getCommentQuery, [commentId]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Listar todos os comentários de um usuário
export async function listCommentsByUserId(userId: number, orderBy: CommentOrderBy = CommentOrderBy.RECENT) {
    try {
        const orderByClause = getOrderClause(orderBy);

        const getCommentsQuery = `
            SELECT c.*, 
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_comments c
            LEFT JOIN (
                SELECT comment_id, COUNT(*) AS like_count FROM tb_comment_likes GROUP BY comment_id
            ) l ON c.id = l.comment_id
            LEFT JOIN (
                SELECT comment_id, COUNT(*) AS dislike_count FROM tb_comment_dislikes GROUP BY comment_id
            ) d ON c.id = d.comment_id
            WHERE c.user_id = $1 and c.deleted_at is NULL
            ${orderByClause}`;

        const result = await pool.query(getCommentsQuery, [userId]);
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Listar todos os comentários para um jogo
export async function listCommentsByGameId(gameId: number, orderBy: CommentOrderBy) {
    try {
        const orderByClause = getOrderClause(orderBy);

        const getCommentsQuery = `
            SELECT c.*, 
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_comments c
            LEFT JOIN (
                SELECT comment_id, COUNT(*) AS like_count FROM tb_comment_likes GROUP BY comment_id
            ) l ON c.id = l.comment_id
            LEFT JOIN (
                SELECT comment_id, COUNT(*) AS dislike_count FROM tb_comment_dislikes GROUP BY comment_id
            ) d ON c.id = d.comment_id
            WHERE c.game_id = $1 and c.deleted_at is NULL
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