export enum ListOrderBy {
    RECENT = 1,
    OLDEST = 2,
    MOST_LIKED = 3,
    MOST_DISLIKED = 4,
  }

export function getCommentOrderClause(orderBy: ListOrderBy): string {
    switch (orderBy) {
        case ListOrderBy.RECENT:
            return 'ORDER BY c.created_at DESC';
        case ListOrderBy.OLDEST:
            return 'ORDER BY c.created_at ASC';
        case ListOrderBy.MOST_LIKED:
            return 'ORDER BY like_count DESC';
        case ListOrderBy.MOST_DISLIKED:
            return 'ORDER BY dislike_count DESC';
        default:
            return '';
    }
}

export function getPostOrderClause(orderBy: ListOrderBy): string {
    switch (orderBy) {
        case ListOrderBy.RECENT:
            return 'ORDER BY p.created_at DESC';
        case ListOrderBy.OLDEST:
            return 'ORDER BY p.created_at ASC';
        case ListOrderBy.MOST_LIKED:
            return 'ORDER BY like_count DESC';
        case ListOrderBy.MOST_DISLIKED:
            return 'ORDER BY dislike_count DESC';
        default:
            return '';
    }
}