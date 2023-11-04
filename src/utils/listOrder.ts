import { CommentOrderBy } from "../interfaces/Comment";

export default function getOrderClause(orderBy: CommentOrderBy): string {
    switch (orderBy) {
        case CommentOrderBy.RECENT:
            return 'ORDER BY c.created_at DESC';
        case CommentOrderBy.OLDEST:
            return 'ORDER BY c.created_at ASC';
        case CommentOrderBy.MOST_LIKED:
            return 'ORDER BY like_count DESC';
        case CommentOrderBy.MOST_DISLIKED:
            return 'ORDER BY dislike_count DESC';
        default:
            return '';
    }
}