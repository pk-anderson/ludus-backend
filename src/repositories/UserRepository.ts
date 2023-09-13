import { Request, Response } from 'express';
import { User } from './../interfaces/User';
import { pool } from '../index';
import { encryptPassword, comparePasswords } from '../utils/encryptor';
import { isValidEmail, isValidPassword } from '../utils/validations';
import jwt from 'jsonwebtoken';
import { generateSessionId } from '../utils/uuid';
import dotenv from 'dotenv';
import {
  CREATE_ENTITY_ERROR,
  FIND_ENTITY_ERROR,
  REVOKE_ERROR,
  LIST_ENTITY_ERROR,
  DELETE_ENTITY_ERROR
} from '../utils/consts';
dotenv.config();

// Função para verificar se o email já está sendo utilizado
export async function checkIfEmailExists(email: string): Promise<boolean> {
  const existingUserQuery = 'SELECT * FROM tb_users WHERE email = $1';
  const existingUserValues = [email];
  const existingUserResult = await pool.query(existingUserQuery, existingUserValues);

  return existingUserResult.rows.length > 0;
}

export async function checkSessionIdExists(sessionId: string) {
  const checkSessionIdQuery = 'SELECT COUNT(*) FROM tb_access WHERE session_id = $1';
  const checkSessionIdValues = [sessionId];
  const { rows } = await pool.query(checkSessionIdQuery, checkSessionIdValues);
  const count = parseInt(rows[0].count, 10);
  return count === 0;
}

export async function signup(user: User) {
  try {
    // Insere o novo usuário no banco de dados
    const insertUserQuery =
      'INSERT INTO tb_users (username, email, password, avatar_url, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const insertUserValues = [user.username, user.email, user.password, user.avatar_url, user.bio];
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

// Rota para listar os usuários cadastrados
export async function listUsers() {
  try {
    // Consultar todos os usuários no banco de dados
    const getUsersQuery = 'SELECT id, username, email, avatar_url, bio, created_at, updated_at, deleted_at, is_active FROM tb_users';
    const usersResult = await pool.query(getUsersQuery);

    return usersResult.rows

  } catch (error) {
    throw new Error(`${error}`);
  }
}

// Rota para buscar um usuário por id
export async function getUserById(userId: number) {
  try {

    // Consultar o usuário no banco de dados pelo ID
    const getUserQuery = 'SELECT id, username, email, avatar_url, bio, created_at, updated_at, deleted_at, is_active FROM tb_users WHERE id = $1';
    const getUserValues = [userId];
    const userResult = await pool.query(getUserQuery, getUserValues);

    return userResult
  } catch (error) {
    throw new Error(`${error}`);
  }
}

// Deletar usuário por id
export async function deleteUserById(userId: number) {
  try {
    // Deletar o usuário 
    const deleteUserQuery = 'UPDATE tb_users SET deleted_at = NOW(), is_active = false WHERE id = $1';
    const deleteUserValues = [userId];
    await pool.query(deleteUserQuery, deleteUserValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}

// Função para atualizar usuário
export async function updateUserById(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken || !decodedToken.id) {
      // Token inválido ou não contém o ID do usuário autenticado
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o ID do usuário autenticado
    const authenticatedUserId = decodedToken.id;

    // Obter o ID do usuário a ser atualizado a partir dos parâmetros da URL
    const userId = parseInt(req.params.id, 10);

    // Verificar se o usuário autenticado é o proprietário do ID que está sendo atualizado
    if (userId !== authenticatedUserId) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para atualizar os dados deste usuário.' });
    }

    // Obter os dados enviados no corpo da requisição
    const { username, email, avatar_url, bio } = req.body;

    // Consultar o usuário no banco de dados para obter os dados atuais
    const getUserQuery = 'SELECT * FROM tb_users WHERE id = $1';
    const getUserValues = [userId];
    const userResult = await pool.query(getUserQuery, getUserValues);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = userResult.rows[0];

    // Verificar e modificar apenas os campos fornecidos no corpo da requisição
    if (username !== undefined) {
      user.username = username;
    }

    if (email !== undefined) {
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'O email enviado não é válido.' });
      }

      // Verifica se o novo email já está em uso
      const checkEmailQuery = 'SELECT id FROM tb_users WHERE email = $1';
      const checkEmailValues = [email];
      const existingUserWithEmail = await pool.query(checkEmailQuery, checkEmailValues);

      if (existingUserWithEmail.rows.length > 0) {
        return res.status(400).json({ message: 'O email fornecido já está em uso por outro usuário.' });
      }

      user.email = email;
    }

    if (avatar_url !== undefined) {
      user.avatar_url = avatar_url;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    // Incluir o campo 'updated_at' no objeto do usuário e adicionar a data atual como valor
    user.updated_at = new Date();

    // Montar a query SQL de atualização dos dados do usuário
    const updateQuery = `
      UPDATE tb_users 
      SET username = $1, email = $2, avatar_url = $3, bio = $4, updated_at = $5
      WHERE id = $6`;

    const updateValues = [
      user.username,
      user.email,
      user.avatar_url,
      user.bio,
      user.updated_at,
      userId,
    ];

    // Executar a query SQL para atualizar os dados do usuário no banco de dados
    await pool.query(updateQuery, updateValues);

    // Retornar uma mensagem de sucesso
    res.status(200).json({ message: 'Dados do usuário atualizados com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    res.status(500).json({ message: `Erro ao atualizar dados do usuário: ${error}` });
  }
}


// Reativar usuário
export async function reactivateUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Busca o usuário pelo email no banco de dados
    const getUserQuery = 'SELECT * FROM tb_users WHERE email = $1';
    const getUserValues = [email];
    const userResult = await pool.query(getUserQuery, getUserValues);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = userResult.rows[0];

    // Compara a senha digitada com a senha criptografada armazenada no banco de dados
    const isPasswordMatch = await comparePasswords(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Verifica se a conta está desativada (is_active = false)
    if (user.is_active) {
      return res.status(400).json({ message: 'A conta já está ativa.' });
    }

    // Reativa a conta (atualiza os campos is_active, deleted_at e updated_at)
    const reactivateUserQuery =
      'UPDATE tb_users SET is_active = true, deleted_at = NULL, updated_at = NOW() WHERE id = $1';
    const reactivateUserValues = [user.id];
    await pool.query(reactivateUserQuery, reactivateUserValues);

    // Autenticação bem-sucedida, gerar o token JWT
    const sessionId = generateSessionId();
    const tokenPayload = {
      id: user.id,
      email: user.email,
      sessionId: sessionId,
      username: user.username,
      revoked: false
    };

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('Variável de ambiente não configurada.');
    }
    const token = jwt.sign(tokenPayload, secretKey, {
      expiresIn: '24h', // Define o tempo de expiração do token
    });

    // Salvar o token na tabela tb_access
    const insertAccessTokenQuery =
      'INSERT INTO tb_access (user_id, access_token, session_id, expires_at, revoked) VALUES ($1, $2, $3, NOW() + INTERVAL \'1 day\', false) RETURNING *';
    const insertAccessTokenValues = [user.id, token, sessionId];
    const insertedAccessToken = await pool.query(insertAccessTokenQuery, insertAccessTokenValues);

    // Retornar o token JWT na resposta
    res.status(200).json({ message: 'Conta reativada com sucesso.', token });
  } catch (error) {
    console.error('Erro ao reativar conta:', error);
    res.status(500).json({ message: `Erro ao reativar conta: ${error}` });
  }
}

// Função para atualizar a senha do usuário
export async function updatePassword(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken || !decodedToken.id) {
      // Token inválido ou não contém o ID do usuário autenticado
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o ID do usuário autenticado
    const authenticatedUserId = decodedToken.id;

    // Obter a nova senha enviada no corpo da requisição
    const { password } = req.body;
    
    // Verificar se a senha é válida
    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'A senha utilizada deve ter pelo menos 8 caracteres.' });
    }

    // Criptografar a nova senha
    const hashedPassword = await encryptPassword(password);

    // Atualizar a senha no banco de dados
    const updatePasswordQuery = 'UPDATE tb_users SET password = $1 WHERE id = $2';
    const updatePasswordValues = [hashedPassword, authenticatedUserId];
    await pool.query(updatePasswordQuery, updatePasswordValues);

    // Retornar uma mensagem de sucesso
    res.status(200).json({ message: 'Senha atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar senha do usuário:', error);
    res.status(500).json({ message: `Erro ao atualizar senha do usuário: ${error}` });
  }
}
