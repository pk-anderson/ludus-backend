import { User } from './../interfaces/User';
import { pool } from '../index';
import dotenv from 'dotenv';
dotenv.config();

export async function checkIfEmailExists(email: string): Promise<boolean> {
  try {
  const existingUserQuery = 'SELECT * FROM tb_users WHERE email = $1';
  const existingUserValues = [email];
  const existingUserResult = await pool.query(existingUserQuery, existingUserValues);

  return existingUserResult.rows.length > 0;
  } catch (error) {
    throw new Error(`${error}`);
  }
}


export async function signup(user: User) {
  try {
    const insertUserQuery =
      'INSERT INTO tb_users (username, email, password, profile_pic, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const insertUserValues = [user.username, user.email, user.password, user.profile_pic, user.bio];
    const insertedUser = await pool.query(insertUserQuery, insertUserValues);

    return insertedUser
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getUserByEmail(email: string) {
  try {
    const getUserQuery = 'SELECT * FROM tb_users WHERE email = $1';
    const getUserValues = [email];
    const userResult = await pool.query(getUserQuery, getUserValues);
    return userResult.rows.length === 0 ? null : userResult.rows[0];
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function listUsers() {
  try {
    const getUsersQuery = 'SELECT id, username, email, bio, created_at, updated_at, deleted_at, is_active, profile_pic FROM tb_users';
    const usersResult = await pool.query(getUsersQuery);

    return usersResult.rows

  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getUserById(userId: number) {
  try {
    const getUserQuery = `SELECT
    u.id,
    u.username,
    u.email,
    u.bio,
    u.created_at,
    u.updated_at,
    u.deleted_at,
    u.is_active,
    u.profile_pic,
    COALESCE(ua.total_points, 0) AS total_points, -- Total de pontos ganhos pelo usuário
    ua.achievements -- Lista de achievements do usuário
FROM
    tb_users u
LEFT JOIN (
    -- Subconsulta para buscar os achievements do usuário e calcular o total de pontos
    SELECT
        user_id,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', a.id,
                'name', a.name,
                'description', a.description,
                'points_rewarded', a.points_rewarded,
                'created_at', a.created_at,
                'updated_at', a.updated_at,
                'deleted_at', a.deleted_at,
                'achieved_at', ua.achieved_at
            )
        ) AS achievements, -- Lista de achievements do usuário
        COALESCE(SUM(a.points_rewarded), 0) AS total_points -- Total de pontos ganhos pelo usuário
    FROM
        tb_user_achievements ua
    LEFT JOIN
        tb_achievements a ON ua.achievement_id = a.id
    GROUP BY
        user_id
) ua ON u.id = ua.user_id
WHERE
    u.id = $1;`;
    const getUserValues = [userId];
    const userResult = await pool.query(getUserQuery, getUserValues);

    return userResult.rows.length === 0 ? null : userResult.rows[0];
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function deleteUserById(userId: number) {
  try {
    const deleteUserQuery = 'UPDATE tb_users SET deleted_at = NOW(), is_active = false WHERE id = $1';
    const deleteUserValues = [userId];
    await pool.query(deleteUserQuery, deleteUserValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function updateUserById(user: User) {
  try {
    const updateQuery = `
      UPDATE tb_users 
      SET username = $1, email = $2, profile_pic = $3, bio = $4, updated_at = $5
      WHERE id = $6`;

    const updateValues = [
      user.username,
      user.email,
      user.profile_pic,
      user.bio,
      user.updated_at,
      user.id,
    ];

    await pool.query(updateQuery, updateValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function reactivateUser(userId: number) {
  try {
    const reactivateUserQuery =
      'UPDATE tb_users SET is_active = true, deleted_at = NULL, updated_at = NOW() WHERE id = $1';
    const reactivateUserValues = [userId];

    await pool.query(reactivateUserQuery, reactivateUserValues);
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function updatePassword(userId: number, password: string) {
  try {
    const updatePasswordQuery = 'UPDATE tb_users SET password = $1 WHERE id = $2';
    const updatePasswordValues = [password, userId];

    await pool.query(updatePasswordQuery, updatePasswordValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}
