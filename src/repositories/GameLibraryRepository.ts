import { pool } from '../index';

export async function saveUserLibraryItem(userId: number, gameId: number) {
    try {
        // Primeiro, inserimos o jogo na biblioteca do usuário
        const insertLibraryItemQuery =
            `
            INSERT INTO tb_user_library (user_id, game_id, created_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP);
            `;
        const insertLibraryItemValues = [userId, gameId];
        await pool.query(insertLibraryItemQuery, insertLibraryItemValues);

        // Em seguida, obtemos o número total de jogos na biblioteca do usuário
        const countLibraryItemsQuery =
            `
            SELECT COUNT(*) AS total_games_added
            FROM tb_user_library
            WHERE user_id = $1 AND deleted_at IS NULL;
            `;
        const countLibraryItemsValues = [userId];
        const result = await pool.query(countLibraryItemsQuery, countLibraryItemsValues);

        // Retorna o número total de jogos na biblioteca do usuário
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}


export async function updateUserLibraryItem(itemId: number, userId: number) {
    try {
        const updateLibraryItemQuery =
            'UPDATE tb_user_library SET updated_at = CURRENT_TIMESTAMP, deleted_at = NULL WHERE id = $1 RETURNING *';
        await pool.query(updateLibraryItemQuery, [itemId]);

        // Em seguida, obtemos o número total de jogos na biblioteca do usuário
        const countLibraryItemsQuery =
            `
            SELECT COUNT(*) AS total_games_added
            FROM tb_user_library
            WHERE user_id = $1 AND deleted_at IS NULL;
            `;
        const countLibraryItemsValues = [userId];
        const result = await pool.query(countLibraryItemsQuery, countLibraryItemsValues);

        // Retorna o número total de jogos na biblioteca do usuário
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function deleteUserLibraryItem(libraryItemId: number) {
    try {
        const deleteLibraryItemQuery =
            'UPDATE tb_user_library SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
        const result = await pool.query(deleteLibraryItemQuery, [libraryItemId]);

        // Retorna o item da biblioteca deletado
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function getUserLibraryItemByUserAndGame(userId: number, gameId: number) {
    try {
        const getLibraryItemQuery = `
            SELECT *
            FROM tb_user_library
            WHERE user_id = $1 AND game_id = $2 
        `;

        const result = await pool.query(getLibraryItemQuery, [userId, gameId]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function getUserLibraryById(itemId: number) {
    try {
        const getLibraryItemQuery = `
            SELECT *
            FROM tb_user_library
            WHERE id = $1 AND deleted_at IS NULL
        `;

        const result = await pool.query(getLibraryItemQuery, [itemId]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listUserLibrary(userId: number) {
    try {
        const listLibraryQuery = `
            SELECT game_id
            FROM tb_user_library
            WHERE user_id = $1 AND deleted_at IS NULL
        `;

        const result = await pool.query(listLibraryQuery, [userId]);

        const gameIds = result.rows.map((row) => row.game_id);
        return gameIds.join(', ');
    } catch (error) {
        throw new Error(`${error}`);
    }
}