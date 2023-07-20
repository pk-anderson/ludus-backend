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

    // Retornar a nova comunidade criada na resposta
    res.status(201).json(createdCommunity.rows[0]);
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
      `;
      const communitiesResult = await pool.query(listCommunitiesQuery);
  
      const communities = communitiesResult.rows;
  
      res.status(200).json(communities);
    } catch (error) {
      console.error('Erro ao listar comunidades:', error);
      res.status(500).json({ message: `Erro ao listar comunidades: ${error}` });
    }
}
  
  // Função para buscar uma comunidade pelo ID
export async function getCommunityById(req: Request, res: Response) {
    try {
      const communityId = parseInt(req.params.id, 10);
  
      const getCommunityQuery = `
        SELECT c.*, u.username as creator_username
        FROM tb_communities c
        INNER JOIN tb_users u ON c.id_creator = u.id
        WHERE c.id = $1
      `;
      const getCommunityValues = [communityId];
      const communityResult = await pool.query(getCommunityQuery, getCommunityValues);
  
      const community = communityResult.rows[0];
  
      if (!community) {
        return res.status(404).json({ message: 'Comunidade não encontrada.' });
      }
  
      res.status(200).json(community);
    } catch (error) {
      console.error('Erro ao buscar comunidade:', error);
      res.status(500).json({ message: `Erro ao buscar comunidade: ${error}` });
    }
}