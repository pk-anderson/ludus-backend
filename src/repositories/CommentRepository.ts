import { pool } from '../index'; 
import { Comment } from '../interfaces/Comment';
import { ListOrderBy, getCommentOrderClause } from './../utils/listOrder';
import { CommentType } from '../interfaces/Comment';


 export async function postComment(comment: Comment, entityType: CommentType) {
    try {
        
        const insertCommentQuery =
            `
            INSERT INTO tb_comments (user_id, entity_id, entity_type, content, created_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING *
            `;
        const insertCommentValues = [comment.user_id, comment.entity_id, entityType, comment.content];
        const insertedComment = await pool.query(insertCommentQuery, insertCommentValues);

        
        const countCommentsQuery =
            `
            SELECT COUNT(*) AS total_comments
            FROM tb_comments
            WHERE user_id = $1 AND deleted_at IS NULL;
            `;
        const countCommentsValues = [comment.user_id];
        const commentCount = await pool.query(countCommentsQuery, countCommentsValues);

        return {
            data: insertedComment.rows[0], 
            total: commentCount.rows[0].total_comments 
        };
    } catch (error) {
        throw new Error(`${error}`);
    }
}


export async function updateComment(commentId: number, content: string) {
    try {
        const updateCommentQuery = 'UPDATE tb_comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
        const updateCommentValues = [content, commentId];
        const result = await pool.query(updateCommentQuery, updateCommentValues);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function getCommentById(commentId: number) {
    try {
        const getCommentQuery = `
            SELECT c.*, u.username, u.email,
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_comments c
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
            WHERE c.id = $1 AND c.deleted_at IS NULL`;

        const result = await pool.query(getCommentQuery, [commentId]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listCommentsByUserId(userId: number, entityType: CommentType, orderBy: ListOrderBy = ListOrderBy.RECENT) {
    try {
        const orderByClause = getCommentOrderClause(orderBy);

        const getCommentsQuery = `
            SELECT c.*, u.username, u.email,
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_comments c
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
            WHERE c.user_id = $1 AND c.entity_type = $2 AND c.deleted_at IS NULL
            ${orderByClause}`;

        const result = await pool.query(getCommentsQuery, [userId, entityType]);
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listCommentsByEntityId(entityId: number, entityType: CommentType, orderBy: ListOrderBy, page: number, limit: number) {
    try {
        const orderByClause = getCommentOrderClause(orderBy);
        const offset = (page - 1) * limit;

        const countCommentsQuery = `
            SELECT COUNT(*) AS total_comments 
            FROM tb_comments 
            WHERE entity_id = $1 AND entity_type = $2 AND deleted_at IS NULL`;
        const countResult = await pool.query(countCommentsQuery, [entityId, entityType]);
        const totalComments = parseInt(countResult.rows[0].total_comments);

        const totalPages = Math.ceil(totalComments / limit);

        const getCommentsQuery = `
            SELECT c.*, u.username, u.email, u.profile_pic,
                   COALESCE(l.like_count, 0) AS like_count, 
                   COALESCE(d.dislike_count, 0) AS dislike_count 
            FROM tb_comments c
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
            WHERE c.entity_id = $1 AND c.entity_type = $2 AND c.deleted_at IS NULL
            ${orderByClause}
            LIMIT $3 OFFSET $4`;

        const result = await pool.query(getCommentsQuery, [entityId, entityType, limit, offset]);

        return { comments: result.rows, totalPages };
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function deleteComment(commentId: number) {
    try {
       
        const deleteCommentQuery = 'UPDATE tb_comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
        const result = await pool.query(deleteCommentQuery, [commentId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}