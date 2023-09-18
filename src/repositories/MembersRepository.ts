import { Request, Response } from 'express';
import { pool } from '../index'; 

export async function checkIfMemberExists(userId: number, communityId: number) {
  try {
    // Verificar se o usuário já é um seguidor da comunidade
    const checkMemberQuery = 'SELECT * FROM tb_community_members WHERE user_id = $1 AND community_id = $2';
    const checkMemberValues = [userId, communityId];
    const existingMemberResult = await pool.query(checkMemberQuery, checkMemberValues);

    return existingMemberResult.rows[0]
    
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function updateFollow(id: number) {
  try {
    const updateFollowQuery = 'UPDATE tb_community_members SET deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1';
    const updateFollowValues = [id];
    await pool.query(updateFollowQuery, updateFollowValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function followCommunity(userId: number, communityId: number) {
    try {  
      // Execute a consulta SQL para inserir o registro do membro na tabela tb_community_members
      const insertMemberQuery =
        'INSERT INTO tb_community_members (user_id, community_id) VALUES ($1, $2) RETURNING *';
      const insertMemberValues = [userId, communityId];
      await pool.query(insertMemberQuery, insertMemberValues);

    } catch (error) {
      throw new Error(`${error}`);
    }
  }

// Listar todos os membros de uma comunidade
export async function listMembers(communityId: number) {
    try {
      // Consulta SQL para obter os membros da comunidade com suas informações de usuário associadas
      const listMembersQuery = `
      SELECT 
        cm.id as community_member_id,
        u.id as user_id,
        u.username,
        u.email,
        u.profile_pic,
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
  
      return membersResult.rows

    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  export async function unfollowCommunity(userId: number, communityId: number) {
    try { 
       // Atualizar o campo 'deleted_at' para marcar o usuário como não mais membro da comunidade
      const leaveCommunityQuery = 'UPDATE tb_community_members SET deleted_at = NOW() WHERE user_id = $1 AND community_id = $2';
      const leaveCommunityValues = [userId, communityId];
      await pool.query(leaveCommunityQuery, leaveCommunityValues);
  
    } catch (error) {
      throw new Error(`${error}`);
    }
  }