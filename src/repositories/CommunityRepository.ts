import { Community } from './../interfaces/Community';
import { pool } from '../index'; 

export async function createCommunity(community: Community) {
  try {
    const createCommunityQuery =
      'INSERT INTO tb_communities (id_creator, name, description) VALUES ($1, $2, $3) RETURNING *';
    const createCommunityValues = [community.id_creator, community.name, community.description];
    const createdCommunity = await pool.query(createCommunityQuery, createCommunityValues);

    const response = createdCommunity.rows[0];

    return response 
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function listCommunities() {
  try {
    const listCommunitiesQuery = `
      SELECT c.*, u.username as creator_username
      FROM tb_communities c
      INNER JOIN tb_users u ON c.id_creator = u.id
      WHERE c.is_active = true
    `;
    const communitiesResult = await pool.query(listCommunitiesQuery);

    const response = communitiesResult.rows;

    return response
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function listUserCommunities(userId: number, isActive: boolean) {
  try {
    const getCommunitiesQuery = `
      SELECT c.id, c.id_creator, c.name, c.description, c.created_at, c.updated_at, c.deleted_at, c.is_active, u.username AS creator_username
      FROM tb_communities c
      INNER JOIN tb_users u ON c.id_creator = u.id
      WHERE c.is_active = $1 AND c.id_creator = $2`;
    const communitiesResult = await pool.query(getCommunitiesQuery, [isActive, userId]);

    const response = communitiesResult.rows;

    return response 
  } catch (error) {
    throw new Error(`${error}`);
  }
}
  
export async function getCommunityById(communityId: number) {
  try {
    const getCommunityQuery = `
      SELECT c.*, u.username as creator_username
      FROM tb_communities c
      INNER JOIN tb_users u ON c.id_creator = u.id
      WHERE c.id = $1 AND c.is_active = true
    `;
    const getCommunityValues = [communityId];
    const communityResult = await pool.query(getCommunityQuery, getCommunityValues);

    return communityResult.rows[0];

  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getInactiveCommunity(communityId: number) {
  try {
    const getCommunityQuery = `
      SELECT c.*, u.username as creator_username
      FROM tb_communities c
      INNER JOIN tb_users u ON c.id_creator = u.id
      WHERE c.id = $1 AND c.is_active = false
    `;
    const getCommunityValues = [communityId];
    const communityResult = await pool.query(getCommunityQuery, getCommunityValues);

    return communityResult.rows[0];

  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function updateCommunity(community: Community) {
  try {
    const updateCommunityQuery =
      'UPDATE tb_communities SET name = $1, description = $2, updated_at = $3 WHERE id = $4 RETURNING *';
    const updateCommunityValues = [
      community.name,
      community.description,
      community.updated_at,
      community.id,
    ];

    const updatedResult = await pool.query(updateCommunityQuery, updateCommunityValues);

    return updatedResult.rows[0];

  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function deleteCommunity(communityId: number) {
  try {
    const deleteCommunityQuery = 'UPDATE tb_communities SET is_active = false, deleted_at = NOW() WHERE id = $1';
    const deleteCommunityValues = [communityId];
    await pool.query(deleteCommunityQuery, deleteCommunityValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function reactivateCommunity(communityId: number) {
  try {
    const reactivateCommunityQuery = 'UPDATE tb_communities SET is_active = true, updated_at = NOW(), deleted_at = NULL WHERE id = $1 RETURNING *';
    const reactivateCommunityValues = [communityId];
    await pool.query(reactivateCommunityQuery, reactivateCommunityValues);
    
  } catch (error) {
    throw new Error(`${error}`);
  }
}



