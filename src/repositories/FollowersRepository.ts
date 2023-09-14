import { pool } from '../index';

export async function checkIfFollowingExists(userId: number, followingId: number) {
  try {
  const checkFollowingQuery = 'SELECT * FROM tb_followers WHERE user_id = $1 AND following_id = $2';
  const checkFollowingValues = [userId, followingId];
  const existingFollowingResult = await pool.query(checkFollowingQuery, checkFollowingValues);

  return existingFollowingResult.rows;

  } catch (error) {
    throw new Error(`${error}`);
  }
}

// Função para atualizar o status de seguir um usuário
export async function updateFollowStatus(userId: number, followingId: number) {
  try {
    // Atualize o status de seguir um usuário 
    const updateFollowingQuery = 'UPDATE tb_followers SET deleted_at = NULL, updated_at = NOW() WHERE user_id = $1 AND following_id = $2';
    const updateFollowingValues = [userId, followingId];
    await pool.query(updateFollowingQuery, updateFollowingValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}

// Seguir usuário
export async function followUser(userId: number, followingId: number) {
  try {
    const insertFollowingQuery =
      'INSERT INTO tb_followers (user_id, following_id) VALUES ($1, $2) RETURNING *';
    const insertFollowingValues = [userId, followingId];
    await pool.query(insertFollowingQuery, insertFollowingValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}

// Listar seguidores de um usuário
export async function listFollowers(userId: number) {
  try {
    // Execute a consulta SQL para obter os seguidores do usuário
    const followersQuery = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.bio,
        u.profile_pic,
        f.created_at,
        f.updated_at,
        f.deleted_at
      FROM tb_users u
      INNER JOIN tb_followers f ON u.id = f.user_id
      WHERE f.following_id = $1 AND u.is_active = true AND f.deleted_at IS NULL
    `;
    const followersValues = [userId];
    const followersResult = await pool.query(followersQuery, followersValues);

    return followersResult.rows;

  } catch (error) {
    throw new Error(`${error}`);
  }
}

// Listar todos os usuários que um usuário está seguindo
export async function listFollowing(userId: number) {
  try {
    // Execute a consulta SQL para obter os usuários que o usuário está seguindo
    const followingQuery = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.bio,
        u.profile_pic,
        f.created_at,
        f.updated_at,
        f.deleted_at
      FROM tb_users u
      INNER JOIN tb_followers f ON u.id = f.following_id
      WHERE f.user_id = $1 AND u.is_active = true AND f.deleted_at IS NULL
    `;
    const followingValues = [userId];
    const followingResult = await pool.query(followingQuery, followingValues);

    return followingResult.rows

  } catch (error) {
    throw new Error(`${error}`);
  }
}

// Deixar de seguir usuário
export async function unfollowUser(userId: number, followingId: number) {
  try {
    // Execute a consulta SQL para atualizar o campo deleted_at para o momento do unfollow
    const unfollowQuery = 'UPDATE tb_followers SET deleted_at = NOW() WHERE user_id = $1 AND following_id = $2';
    const unfollowValues = [userId, followingId];
    await pool.query(unfollowQuery, unfollowValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}