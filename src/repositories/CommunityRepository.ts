import { Request, Response } from 'express';
import { pool } from '../index'; 

export async function createCommunity(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o ID do usuário autenticado
    const authenticatedUserId = decodedToken.id;

    const { name, description } = req.body;

    // Inserir a nova comunidade na base de dados, usando o userId obtido do token
    const createCommunityQuery =
      'INSERT INTO tb_communities (id_creator, name, description) VALUES ($1, $2, $3) RETURNING *';
    const createCommunityValues = [authenticatedUserId, name, description];
    const createdCommunity = await pool.query(createCommunityQuery, createCommunityValues);

    const response = createdCommunity.rows[0];

    // Retornar a nova comunidade criada na resposta
    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao criar comunidade:', error);
    res.status(500).json({ message: `Erro ao criar comunidade: ${error}` });
  }
}

// Função para listar todas as comunidades
export async function listCommunities(req: Request, res: Response) {
  try {
    const listCommunitiesQuery = `
      SELECT c.*, u.username as creator_username
      FROM tb_communities c
      INNER JOIN tb_users u ON c.id_creator = u.id
      WHERE c.is_active = true
    `;
    const communitiesResult = await pool.query(listCommunitiesQuery);

    const response = communitiesResult.rows;

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao listar comunidades:', error);
    res.status(500).json({ message: `Erro ao listar comunidades: ${error}` });
  }
}

export async function listOwnCommunities(req: Request, res: Response, isActive: boolean) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o ID do usuário autenticado
    const authenticatedUserId = decodedToken.id;

    // Consultar todas as comunidades do usuário no banco de dados
    const getCommunitiesQuery = `
      SELECT c.id, c.id_creator, c.name, c.description, c.created_at, c.updated_at, c.deleted_at, c.is_active, u.username AS creator_username
      FROM tb_communities c
      INNER JOIN tb_users u ON c.id_creator = u.id
      WHERE c.is_active = $1 AND c.id_creator = $2`;
    const communitiesResult = await pool.query(getCommunitiesQuery, [isActive, authenticatedUserId]);

    const response = communitiesResult.rows;

    // Retornar a lista de comunidades do usuário na resposta
    res.status(200).json(response);
  } catch (error) {
    console.error(`Erro ao listar comunidades ${isActive ? 'ativas' : 'inativas'} do usuário:`, error);
    res.status(500).json({ message: `Erro ao listar comunidades ${isActive ? 'ativas' : 'inativas'} do usuário: ${error}` });
  }
}
  
// Função para buscar uma comunidade 
export async function getCommunityById(req: Request, res: Response) {
  try {
    const communityId = parseInt(req.params.id, 10);

    const getCommunityQuery = `
      SELECT c.*, u.username as creator_username
      FROM tb_communities c
      INNER JOIN tb_users u ON c.id_creator = u.id
      WHERE c.id = $1 AND c.is_active = true
    `;
    const getCommunityValues = [communityId];
    const communityResult = await pool.query(getCommunityQuery, getCommunityValues);

    const response = communityResult.rows[0];

    if (!response) {
      return res.status(404).json({ message: 'Comunidade não encontrada.' });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar comunidade:', error);
    res.status(500).json({ message: `Erro ao buscar comunidade: ${error}` });
  }
}

export async function listCommunitiesByUserId(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o ID do usuário a ser listado a partir dos parâmetros da URL
    const otherUserId = parseInt(req.params.userId, 10);

    // Verificar se o usuário com o ID fornecido está ativo
    const checkUserQuery = 'SELECT is_active FROM tb_users WHERE id = $1';
    const checkUserValues = [otherUserId];
    const userResult = await pool.query(checkUserQuery, checkUserValues);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const userIsActive = userResult.rows[0].is_active;

    if (!userIsActive) {
      return res.status(401).json({ message: 'Usuário inativo.' });
    }

    // Consultar todas as comunidades ativas do usuário no banco de dados
    const getCommunitiesQuery = `
      SELECT c.id, c.id_creator, c.name, c.description, c.created_at, c.updated_at, c.deleted_at, c.is_active, u.username AS creator_username
      FROM tb_communities c
      INNER JOIN tb_users u ON c.id_creator = u.id
      WHERE c.is_active = true AND c.id_creator = $1`;
    const communitiesResult = await pool.query(getCommunitiesQuery, [otherUserId]);

    const response = communitiesResult.rows;

    // Retornar a lista de comunidades ativas do outro usuário na resposta
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao listar comunidades ativas de outro usuário:', error);
    res.status(500).json({ message: 'Erro ao listar comunidades ativas de outro usuário.' });
  }
}

export async function updateCommunity(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o ID do usuário autenticado
    const authenticatedUserId = decodedToken.id;

    // Obter o ID da comunidade a ser atualizada a partir dos parâmetros da URL
    const communityId = parseInt(req.params.id, 10);

    // Consultar a comunidade no banco de dados
    const getCommunityQuery = 'SELECT * FROM tb_communities WHERE id = $1 AND is_active = true';
    const getCommunityValues = [communityId];
    const communityResult = await pool.query(getCommunityQuery, getCommunityValues);

    if (communityResult.rows.length === 0) {
      return res.status(404).json({ message: 'Comunidade não encontrada.' });
    }

    const community = communityResult.rows[0];

    // Verificar se o usuário autenticado é o criador da comunidade
    if (community.id_creator !== authenticatedUserId) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para atualizar esta comunidade.' });
    }

    const { name, description } = req.body;

    // Verificar se pelo menos um campo foi informado para atualizar
    if (!name && !description) {
      return res.status(400).json({ message: 'Informe pelo menos um campo para atualizar.' });
    }

    // Atualizar apenas os campos informados e manter os demais inalterados
    const updatedCommunity = {
      ...community,
      name: name || community.name,
      description: description || community.description,
      updated_at: new Date(),
    };

    // Atualizar a comunidade no banco de dados
    const updateCommunityQuery =
      'UPDATE tb_communities SET name = $1, description = $2, updated_at = $3 WHERE id = $4 RETURNING *';
    const updateCommunityValues = [
      updatedCommunity.name,
      updatedCommunity.description,
      updatedCommunity.updated_at,
      communityId,
    ];

    const updatedResult = await pool.query(updateCommunityQuery, updateCommunityValues);

    const response = updatedResult.rows[0];

    // Retornar a comunidade atualizada na resposta
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao atualizar comunidade:', error);
    res.status(500).json({ message: 'Erro ao atualizar comunidade.' });
  }
}


// Função para deletar uma comunidade
export async function deleteCommunity(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o ID do usuário autenticado
    const authenticatedUserId = decodedToken.id;

    const communityId = parseInt(req.params.id, 10);

    // Verificar se o usuário autenticado é o criador da comunidade
    const getCommunityQuery = 'SELECT id_creator FROM tb_communities WHERE id = $1 AND is_active = true';
    const getCommunityValues = [communityId];
    const communityResult = await pool.query(getCommunityQuery, getCommunityValues);

    const community = communityResult.rows[0];

    if (!community || community.id_creator !== authenticatedUserId) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para deletar esta comunidade.' });
    }

    // Atualizar o campo 'is_active' para false e 'deleted_at' para o momento em que foi deletada
    const deleteCommunityQuery = 'UPDATE tb_communities SET is_active = false, deleted_at = NOW() WHERE id = $1';
    const deleteCommunityValues = [communityId];
    await pool.query(deleteCommunityQuery, deleteCommunityValues);

    res.status(200).json({ message: 'Comunidade deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar comunidade:', error);
    res.status(500).json({ message: `Erro ao deletar comunidade: ${error}` });
  }
}

export async function reactivateCommunity(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o ID do usuário autenticado
    const authenticatedUserId = decodedToken.id;

    // Obter o ID da comunidade a ser reativada a partir dos parâmetros da URL
    const communityId = parseInt(req.params.id, 10);

    // Consultar a comunidade no banco de dados
    const getCommunityQuery = 'SELECT * FROM tb_communities WHERE id = $1';
    const getCommunityValues = [communityId];
    const communityResult = await pool.query(getCommunityQuery, getCommunityValues);

    if (communityResult.rows.length === 0) {
      return res.status(404).json({ message: 'Comunidade não encontrada.' });
    }

    const community = communityResult.rows[0];

    // Verificar se o usuário autenticado é o proprietário da comunidade
    if (community.id_creator !== authenticatedUserId) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para reativar esta comunidade.' });
    }

    // Verificar se a comunidade já está ativa
    if (community.is_active) {
      return res.status(400).json({ message: 'A comunidade já está ativa.' });
    }

    // Reativar a comunidade atualizando o campo 'is_active' para true, 'updated_at' para o momento da reativação, e 'deleted_at' para nulo
    const reactivateCommunityQuery = 'UPDATE tb_communities SET is_active = true, updated_at = NOW(), deleted_at = NULL WHERE id = $1 RETURNING *';
    const reactivateCommunityValues = [communityId];
    const updatedCommunity = await pool.query(reactivateCommunityQuery, reactivateCommunityValues);

    const response = updatedCommunity.rows[0];

    // Retornar a comunidade reativada na resposta
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao reativar comunidade:', error);
    res.status(500).json({ message: 'Erro ao reativar comunidade.' });
  }
}



