import { pool } from '../index';
import dotenv from 'dotenv';
dotenv.config();

export async function checkSessionIdExists(sessionId: string) {
    try {
    const checkSessionIdQuery = 'SELECT COUNT(*) FROM tb_access WHERE session_id = $1';
    const checkSessionIdValues = [sessionId];
    const { rows } = await pool.query(checkSessionIdQuery, checkSessionIdValues);
    const count = parseInt(rows[0].count, 10);
    return count === 0;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

export async function createAccessToken(userId: number, token: string, sessionId: string) {
  try {
    const insertAccessTokenQuery =
      'INSERT INTO tb_access (user_id, access_token, session_id, expires_at, revoked) VALUES ($1, $2, $3, NOW() + INTERVAL \'1 day\', false) RETURNING *';
    const insertAccessTokenValues = [userId, token, sessionId];
    return await pool.query(insertAccessTokenQuery, insertAccessTokenValues);
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function logout(sessionId: string) {
    try {
      const updateTokenQuery = 'UPDATE tb_access SET revoked = true WHERE session_id = $1';
      const updateTokenValues = [sessionId];
      await pool.query(updateTokenQuery, updateTokenValues);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  