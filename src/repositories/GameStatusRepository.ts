import { pool } from '../index';
import { GameStatus, StatusType } from "../interfaces/GameStatus";

export async function saveStatus(status: GameStatus) {
    try {
        const insertStatusQuery =
            'INSERT INTO tb_status (user_id, game_id, status, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *';
        const insertStatusValues = [status.user_id, status.game_id, status.status];
        const result = await pool.query(insertStatusQuery, insertStatusValues);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listStatusByUserAndType(userId: number, statusType: StatusType) {
    try {
        const listGameIdsQuery = `
            SELECT game_id
            FROM tb_status
            WHERE user_id = $1 AND status = $2 AND deleted_at IS NULL
        `;

        const result = await pool.query(listGameIdsQuery, [userId, statusType]);
        const gameIds = result.rows.map((status: GameStatus) => status.game_id);
        return gameIds.join(', ');
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function getExistingStatusByUserAndGame(userId: number, gameId: number) {
    try {
        const getStatusQuery = `
            SELECT *
            FROM tb_status
            WHERE user_id = $1 AND game_id = $2 AND deleted_at IS NULL
        `;

        const result = await pool.query(getStatusQuery, [userId, gameId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function getStatusByUserAndGame(userId: number, gameId: number) {
    try {
        const getStatusQuery = `
            SELECT *
            FROM tb_status
            WHERE user_id = $1 AND game_id = $2
        `;

        const result = await pool.query(getStatusQuery, [userId, gameId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function getStatusById(statusId: number) {
    try {
        const getStatusQuery = `
            SELECT *
            FROM tb_status
            WHERE id = $1 AND deleted_at IS NULL
        `;

        const result = await pool.query(getStatusQuery, [statusId]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function updateStatus(statusId: number, newStatus: StatusType) {
    try {
        const updateStatusQuery = `
            UPDATE tb_status
            SET status = $1, updated_at = CURRENT_TIMESTAMP, deleted_at = NULL
            WHERE id = $2
            RETURNING *
        `;

        const result = await pool.query(updateStatusQuery, [newStatus, statusId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function deleteStatus(statusId: number) {
    try {
        const deleteStatusQuery = `
            UPDATE tb_status
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const result = await pool.query(deleteStatusQuery, [statusId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}