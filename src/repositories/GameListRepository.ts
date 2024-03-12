import { GameList, GameListItem } from './../interfaces/GameList';
import { pool } from '../index';

export async function saveGameList(gameList: GameList){
    try {
        const insertGameListQuery = `
            INSERT INTO tb_game_lists (user_id, title, description, cover_image, created_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING *`;

        const insertGameListValues = [
            gameList.user_id,
            gameList.title,
            gameList.description || null,
            gameList.cover_image || null,
        ];

        const result = await pool.query(insertGameListQuery, insertGameListValues);

        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function updateGameList(gameList:GameList ) {
    try {
        const updateGameListQuery = `
            UPDATE tb_game_lists
            SET 
                title = COALESCE($2, title),
                description = COALESCE($3, description),
                cover_image = COALESCE($4, cover_image),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *`;

        const updateGameListValues = [
            gameList.id,
            gameList.title || null,
            gameList.description || null,
            gameList.cover_image || null,
        ];

        const result = await pool.query(updateGameListQuery, updateGameListValues);

        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function getUserGameLists(userId: number) {
    try {
        const getListsQuery = `
            SELECT *
            FROM tb_game_lists
            WHERE user_id = $1 AND deleted_at IS NULL
        `;
        const result = await pool.query(getListsQuery, [userId]);

        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function getGameListById(gameListId: number) {
    try {
        const getGameListQuery = `
            SELECT gl.*, 
                   COUNT(gli.id) AS game_count, 
                   ARRAY_AGG(gli.game_id) AS game_ids
            FROM tb_game_lists gl
            LEFT JOIN tb_game_list_items gli ON gl.id = gli.list_id AND gli.deleted_at IS NULL
            WHERE gl.id = $1 AND gl.deleted_at IS NULL
            GROUP BY gl.id
        `;
        const result = await pool.query(getGameListQuery, [gameListId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function deleteGameList(listId: number) {
    try {
        const deleteListQuery = `
            UPDATE tb_game_lists
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1
        `;
        const result = await pool.query(deleteListQuery, [listId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function saveGameListItem(gameListItem: GameListItem) {
    try {
        const insertGameListItemQuery = `
            INSERT INTO tb_game_list_items (user_id, list_id, game_id, created_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            RETURNING *`;

        const insertGameListItemValues = [gameListItem.user_id, gameListItem.list_id, gameListItem.game_id];

        const result = await pool.query(insertGameListItemQuery, insertGameListItemValues);

        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function getGameListItem(userId: number, gameId: number, listId: number) {
    try {
        const getGameListItemQuery = `
            SELECT *
            FROM tb_game_list_items
            WHERE user_id = $1 AND game_id = $2 and list_id = $3
        `;
        const result = await pool.query(getGameListItemQuery, [userId, gameId, listId]);
        
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}


export async function getExistingGameListItem(userId: number, gameId: number, listId: number) {
    try {
        const getGameListItemQuery = `
            SELECT *
            FROM tb_game_list_items
            WHERE user_id = $1 AND game_id = $2 AND list_id = $3 AND deleted_at IS NULL
        `;
        const result = await pool.query(getGameListItemQuery, [userId, gameId, listId]);
        
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function updateGameListItem(itemId: number) {
    try {
        const updateItemQuery = `
            UPDATE tb_game_list_items
            SET
                updated_at = CURRENT_TIMESTAMP,
                deleted_at = null
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(updateItemQuery, [itemId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}


export async function removeGameListItem(itemId: number) {
    try {
        const removeItemQuery = `
            UPDATE tb_game_list_items
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1 
            RETURNING *
        `;
        const result = await pool.query(removeItemQuery, [itemId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}
