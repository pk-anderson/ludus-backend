import { Request, Response } from 'express';
import { pool } from '../index'; 

export async function followCommunity(req: Request, res: Response) {
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
  
      // Obtenha o community_id da comunidade a partir dos parâmetros da rota
      const communityId = parseInt(req.params.communityId, 10);
  
      // Certifique-se de que o communityId foi fornecido e é um número válido
      if (!communityId || isNaN(communityId)) {
        return res.status(400).json({ message: 'Informe um ID de comunidade válido para seguir.' });
      }
  
      // Verificar se a comunidade com o ID fornecido existe no banco de dados
      const communityQuery = 'SELECT * FROM tb_communities WHERE id = $1';
      const communityValues = [communityId];
      const communityResult = await pool.query(communityQuery, communityValues);
  
      if (communityResult.rows.length === 0) {
        return res.status(404).json({ message: 'Comunidade não encontrada.' });
      }
  
      const community = communityResult.rows[0];
  
      // Verificar se o usuário é o próprio criador da comunidade
      if (community.creator_id === userId) {
        return res.status(403).json({ message: 'Você não pode seguir sua própria comunidade.' });
      }
  
      // Verificar se o usuário já é um seguidor da comunidade
      const checkMemberQuery = 'SELECT * FROM tb_community_members WHERE user_id = $1 AND community_id = $2';
      const checkMemberValues = [userId, communityId];
      const existingMemberResult = await pool.query(checkMemberQuery, checkMemberValues);
  
      if (existingMemberResult.rows.length > 0) {
        const existingMember = existingMemberResult.rows[0];
  
        // Se o usuário já está seguindo a comunidade, verificar se ele está refazendo o follow
        if (existingMember.deleted_at) {
          // Atualizar o deleted_at para nulo e o updated_at para o momento do novo follow
          const updateFollowQuery = 'UPDATE tb_community_members SET deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1';
          const updateFollowValues = [existingMember.id];
          await pool.query(updateFollowQuery, updateFollowValues);
  
          return res.status(200).json({ message: 'Agora você está seguindo esta comunidade.' });
        } else {
          return res.status(400).json({ message: 'Você já está seguindo esta comunidade.' });
        }
      }
  
      // Execute a consulta SQL para inserir o registro do membro na tabela tb_community_members
      const insertMemberQuery =
        'INSERT INTO tb_community_members (user_id, community_id) VALUES ($1, $2) RETURNING *';
      const insertMemberValues = [userId, communityId];
      const insertedMember = await pool.query(insertMemberQuery, insertMemberValues);
  
      // Responda com uma mensagem de sucesso
      res.status(200).json({ message: 'Agora você está seguindo esta comunidade.' });
    } catch (error) {
      console.error('Erro ao seguir comunidade:', error);
      res.status(500).json({ message: `Erro ao seguir comunidade: ${error}` });
    }
  }

// Listar todos os membros de uma comunidade
export async function listMembers(req: Request, res: Response) {
    try {
      // Obtenha o community_id da comunidade a partir dos parâmetros da rota
      const communityId = parseInt(req.params.communityId, 10);
  
      // Certifique-se de que o communityId foi fornecido e é um número válido
      if (!communityId || isNaN(communityId)) {
        return res.status(400).json({ message: 'Informe um ID de comunidade válido.' });
      }
  
      // Consulta SQL para verificar se a comunidade com o ID fornecido existe no banco de dados
      const checkCommunityQuery = 'SELECT * FROM tb_communities WHERE id = $1';
      const checkCommunityValues = [communityId];
      const communityResult = await pool.query(checkCommunityQuery, checkCommunityValues);
  
      if (communityResult.rows.length === 0) {
        return res.status(404).json({ message: 'Comunidade não encontrada.' });
      }
  
      // Consulta SQL para obter os membros da comunidade com suas informações de usuário associadas
      const listMembersQuery = `
      SELECT 
        cm.id as community_member_id,
        u.id as user_id,
        u.username,
        u.email,
        u.avatar_url,
        u.bio,
        cm.created_at,
        cm.updated_at,
        cm.deleted_at
      FROM tb_community_members cm
      JOIN tb_users u ON cm.user_id = u.id
      WHERE cm.community_id = $1 AND cm.deleted_at IS NULL AND u.is_active = true
    `;
  
      const listMembersValues = [communityId];
      const membersResult = await pool.query(listMembersQuery, listMembersValues);
  
      // Retornar a lista de membros da comunidade com as informações solicitadas
      res.status(200).json(membersResult.rows);
    } catch (error) {
      console.error('Erro ao listar membros da comunidade:', error);
      res.status(500).json({ message: `Erro ao listar membros da comunidade: ${error}` });
    }
  }

  export async function unfollowCommunity(req: Request, res: Response) {
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
  
      // Obtenha o community_id da comunidade a partir dos parâmetros da rota
      const communityId = parseInt(req.params.communityId, 10);
  
      // Certifique-se de que o communityId foi fornecido e é um número válido
      if (!communityId || isNaN(communityId)) {
        return res.status(400).json({ message: 'Informe um ID de comunidade válido.' });
      }
  
      // Consulta SQL para verificar se a comunidade com o ID fornecido existe no banco de dados
      const checkCommunityQuery = 'SELECT * FROM tb_communities WHERE id = $1';
      const checkCommunityValues = [communityId];
      const communityResult = await pool.query(checkCommunityQuery, checkCommunityValues);
  
      if (communityResult.rows.length === 0) {
        return res.status(404).json({ message: 'Comunidade não encontrada.' });
      }
  
      // Verificar se o usuário é membro da comunidade
      const checkMemberQuery = 'SELECT * FROM tb_community_members WHERE user_id = $1 AND community_id = $2 AND deleted_at IS NULL';
      const checkMemberValues = [userId, communityId];
      const memberResult = await pool.query(checkMemberQuery, checkMemberValues);
  
      if (memberResult.rows.length === 0) {
        return res.status(404).json({ message: 'Você não é membro desta comunidade.' });
      }
  
      // Atualizar o campo 'deleted_at' para marcar o usuário como não mais membro da comunidade
      const leaveCommunityQuery = 'UPDATE tb_community_members SET deleted_at = NOW() WHERE user_id = $1 AND community_id = $2';
      const leaveCommunityValues = [userId, communityId];
      await pool.query(leaveCommunityQuery, leaveCommunityValues);
  
      // Responda com uma mensagem de sucesso
      res.status(200).json({ message: 'Você deixou de ser membro desta comunidade.' });
    } catch (error) {
      console.error('Erro ao deixar de ser membro da comunidade:', error);
      res.status(500).json({ message: `Erro ao deixar de ser membro da comunidade: ${error}` });
    }
  }