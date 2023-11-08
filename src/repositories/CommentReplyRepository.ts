import { pool } from '../index'; 
import { ListOrderBy, getCommentOrderClause } from './../utils/listOrder';

export async function postReply(commentId: number, replyId: number) {
    try {
        const insertReplyQuery =
            'INSERT INTO tb_replies (original_comment_id, reply_comment_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *';
        const insertReplyValues = [commentId, replyId];
        const result = await pool.query(insertReplyQuery, insertReplyValues);

        // Retorna a resposta (reply) inserida
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listRepliesByCommentId(commentId: number, orderBy: ListOrderBy) {
    try {
        const orderByClause = getCommentOrderClause(orderBy);

        const listRepliesQuery = `
            SELECT c.id, c.user_id, u.username, u.email, c.entity_id, c.content, 
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count,
                   c.created_at
            FROM tb_comments c
            INNER JOIN tb_replies r ON c.id = r.reply_comment_id
            INNER JOIN tb_users u ON c.user_id = u.id
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
            WHERE r.original_comment_id = $1 AND c.deleted_at IS NULL
            ${orderByClause};
        `;
        
        const result = await pool.query(listRepliesQuery, [commentId]);
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}