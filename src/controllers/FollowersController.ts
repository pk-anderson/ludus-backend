import { Request, Response } from 'express';
import { pool } from '../index';

// Seguir usuário
export async function followUser(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    const followerId = decodedToken.id;

    // Verifique se o ID do usuário foi obtido corretamente
    if (!followerId) {
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obtenha o userId do usuário a ser seguido a partir do corpo da requisição
    const { userId } = req.body;

    // Certifique-se de que o userId foi fornecido
    if (!userId) {
      return res.status(400).json({ message: 'Informe o ID do usuário que deseja seguir.' });
    }

    // Verificar se o usuário a ser seguido existe no banco de dados
    const followingQuery = 'SELECT * FROM tb_users WHERE id = $1';
    const followingValues = [userId];
    const followingResult = await pool.query(followingQuery, followingValues);

    if (followingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário a ser seguido não encontrado.' });
    }

    // Verificar se o usuário já está seguindo o usuário alvo
    const checkFollowingQuery = 'SELECT * FROM tb_followers WHERE user_id = $1 AND follower_id = $2';
    const checkFollowingValues = [userId, followerId];
    const existingFollowingResult = await pool.query(checkFollowingQuery, checkFollowingValues);

    if (existingFollowingResult.rows.length > 0) {
      // O usuário já está seguindo o usuário alvo
      const existingFollowing = existingFollowingResult.rows[0];
      if (existingFollowing.deleted_at) {
        // Se o campo deleted_at estiver preenchido, atualizar para o momento do novo follow
        const updateFollowingQuery = 'UPDATE tb_followers SET deleted_at = NULL, updated_at = NOW() WHERE user_id = $1 AND follower_id = $2';
        const updateFollowingValues = [userId, followerId];
        await pool.query(updateFollowingQuery, updateFollowingValues);
        return res.status(200).json({ message: 'Agora você está seguindo este usuário.' });
      } else {
        // Caso contrário, o usuário já está seguindo e não deve refazer o follow
        return res.status(400).json({ message: 'Você já está seguindo este usuário.' });
      }
    }

    // O usuário ainda não está seguindo o usuário alvo, então fazemos um novo follow
    const insertFollowingQuery =
      'INSERT INTO tb_followers (user_id, follower_id) VALUES ($1, $2) RETURNING *';
    const insertFollowingValues = [userId, followerId];
    const insertedFollowing = await pool.query(insertFollowingQuery, insertFollowingValues);

    // Responda com uma mensagem de sucesso
    res.status(200).json({ message: 'Agora você está seguindo este usuário.' });
  } catch (error) {
    console.error('Erro ao seguir usuário:', error);
    res.status(500).json({ message: `Erro ao seguir usuário: ${error}` });
  }
}

// Listar seguidores
export async function listFollowers(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    const userId = decodedToken.id;

    // Verifique se o ID do usuário foi obtido corretamente
    if (!userId) {
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Execute a consulta SQL para obter os seguidores do usuário
    const followersQuery = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.avatar_url,
        u.bio,
        f.created_at,
        f.updated_at,
        f.deleted_at
      FROM tb_users u
      INNER JOIN tb_followers f ON u.id = f.follower_id
      WHERE f.user_id = $1 AND u.is_active = true AND f.deleted_at IS NULL
    `;
    const followersValues = [userId];
    const followersResult = await pool.query(followersQuery, followersValues);
    const followers = followersResult.rows;

    // Responda com a lista de seguidores
    res.status(200).json({ followers });
  } catch (error) {
    console.error('Erro ao listar seguidores:', error);
    res.status(500).json({ message: `Erro ao listar seguidores: ${error}` });
  }
}

// Listar seguidores de outro usuário
export async function listFollowersOfUser(req: Request, res: Response) {
  try {

    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    const { userId } = req.params;
    // Certifique-se de que o userId foi fornecido e é um número válido
    if (!userId || isNaN(+userId)) {
      return res.status(400).json({ message: 'Informe um ID de usuário válido.' });
    }

    // Verificar se o usuário a buscado existe no banco de dados
    const userQuery = 'SELECT * FROM tb_users WHERE id = $1';
    const userValues = [userId];
    const userResult = await pool.query(userQuery, userValues);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Execute a consulta SQL para obter os seguidores do usuário
    const followersQuery = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.avatar_url,
        u.bio,
        f.created_at,
        f.updated_at,
        f.deleted_at
      FROM tb_users u
      INNER JOIN tb_followers f ON u.id = f.follower_id
      WHERE f.user_id = $1 AND u.is_active = true AND f.deleted_at IS NULL
    `;
    const followersValues = [userId];
    const followersResult = await pool.query(followersQuery, followersValues);
    const followers = followersResult.rows;

    // Responda com a lista de seguidores do usuário especificado
    res.status(200).json({ followers });
  } catch (error) {
    console.error('Erro ao listar seguidores do usuário:', error);
    res.status(500).json({ message: `Erro ao listar seguidores do usuário: ${error}` });
  }
}

// Listar todos os usuários que estou seguindo
export async function listFollowingUsers(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    const followerId = decodedToken.id;

    // Verifique se o ID do usuário foi obtido corretamente
    if (!followerId) {
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Execute a consulta SQL para obter os usuários que o usuário está seguindo
    const followingQuery = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.avatar_url,
        u.bio,
        f.created_at,
        f.updated_at,
        f.deleted_at
      FROM tb_users u
      INNER JOIN tb_followers f ON u.id = f.user_id
      WHERE f.follower_id = $1 AND u.is_active = true AND f.deleted_at IS NULL
    `;
    const followingValues = [followerId];
    const followingResult = await pool.query(followingQuery, followingValues);
    const followingUsers = followingResult.rows;

    // Responda com a lista de usuários que o usuário está seguindo
    res.status(200).json({ followingUsers });
  } catch (error) {
    console.error('Erro ao listar usuários que o usuário está seguindo:', error);
    res.status(500).json({ message: `Erro ao listar usuários que o usuário está seguindo: ${error}` });
  }
}

// Listar todos os usuários que um outro usuário está seguindo
export async function listFollowingOfUser(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    const { userId } = req.params;
    // Certifique-se de que o userId foi fornecido e é um número válido
    if (!userId || isNaN(+userId)) {
      return res.status(400).json({ message: 'Informe um ID de usuário válido.' });
    }

    // Verificar se o usuário a buscado existe no banco de dados
    const userQuery = 'SELECT * FROM tb_users WHERE id = $1';
    const userValues = [userId];
    const userResult = await pool.query(userQuery, userValues);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Execute a consulta SQL para obter os usuários que o usuário está seguindo
    const followingQuery = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.avatar_url,
        u.bio,
        f.created_at,
        f.updated_at,
        f.deleted_at
      FROM tb_users u
      INNER JOIN tb_followers f ON u.id = f.user_id
      WHERE f.follower_id = $1 AND u.is_active = true AND f.deleted_at IS NULL
    `;
    const followingValues = [userId];
    const followingResult = await pool.query(followingQuery, followingValues);
    const followingUsers = followingResult.rows;

    // Responda com a lista de usuários que o usuário especificado está seguindo
    res.status(200).json({ followingUsers });
  } catch (error) {
    console.error('Erro ao listar usuários que o usuário está seguindo:', error);
    res.status(500).json({ message: `Erro ao listar usuários que o usuário está seguindo: ${error}` });
  }
}

// Deixar de seguir usuário
export async function unfollowUser(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    const followerId = decodedToken.id;

    // Verifique se o ID do usuário foi obtido corretamente
    if (!followerId) {
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obtenha o userId (ID do usuário a ser deixado de seguir) a partir do corpo da requisição
    const { userId } = req.body;

    // Certifique-se de que o userId foi fornecido
    if (!userId) {
      return res.status(400).json({ message: 'Informe o ID do usuário que deseja deixar de seguir.' });
    }

    // Verificar se o usuário a ser deixado de seguir existe no banco de dados
    const followingQuery = 'SELECT * FROM tb_users WHERE id = $1';
    const followingValues = [userId];
    const followingResult = await pool.query(followingQuery, followingValues);

    if (followingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário a ser deixado de seguir não encontrado.' });
    }

    // Verificar se o usuário já está seguindo o usuário alvo
    const checkFollowingQuery = 'SELECT * FROM tb_followers WHERE follower_id = $1 AND user_id = $2';
    const checkFollowingValues = [followerId, userId];
    const existingFollowingResult = await pool.query(checkFollowingQuery, checkFollowingValues);

    if (existingFollowingResult.rows.length === 0) {
      return res.status(400).json({ message: 'Você não está seguindo este usuário.' });
    }

    // Execute a consulta SQL para atualizar o campo deleted_at para o momento do unfollow
    const unfollowQuery = 'UPDATE tb_followers SET deleted_at = NOW() WHERE follower_id = $1 AND user_id = $2';
    const unfollowValues = [followerId, userId];
    await pool.query(unfollowQuery, unfollowValues);

    // Responda com uma mensagem de sucesso
    res.status(200).json({ message: 'Você deixou de seguir este usuário.' });
  } catch (error) {
    console.error('Erro ao deixar de seguir usuário:', error);
    res.status(500).json({ message: `Erro ao deixar de seguir usuário: ${error}` });
  }
}