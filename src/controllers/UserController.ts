import { Request, Response } from 'express';
import { pool } from '../index';
import { encryptPassword, comparePasswords } from '../utils/encryptor';
import { isValidEmail, isValidPassword } from '../utils/validations';
import ms from 'ms';
import { User } from '../interfaces/User';
import jwt from 'jsonwebtoken';
import { generateSessionId } from '../utils/uuid';
import dotenv from 'dotenv';
dotenv.config();

// Função de cadastro de usuário
export async function signup(req: Request, res: Response) {
  try {
    const newUser: User = req.body;
    // Verifica se todos os campos obrigatórios foram enviados
    if (!newUser.username || !newUser.email || !newUser.password) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    // Verificar se a senha é válida
    if (!isValidPassword(newUser.password)) {
      return res.status(400).json({ message: 'A senha utilizada deve ter pelo menos 8 caracteres.' });
    }

    // Verificar se o email é válido
    if (!isValidEmail(newUser.email)) {
      return res.status(400).json({ message: 'O email enviado não é válido.' });
    }

    // Verificar se o email já está sendo utilizado por outro usuário
    const existingUserQuery = 'SELECT * FROM tb_users WHERE email = $1';
    const existingUserValues = [newUser.email];
    const existingUserResult = await pool.query(existingUserQuery, existingUserValues);

    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({ message: 'Este email já está sendo utilizado.' });
    }

    // Criptografa a senha antes de salvar no banco de dados
    const hashedPassword = await encryptPassword(newUser.password);

    // Insere o novo usuário no banco de dados
    const insertUserQuery =
      'INSERT INTO tb_users (username, email, password, avatar_url, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const insertUserValues = [newUser.username, newUser.email, hashedPassword, newUser.avatar_url, newUser.bio];
    const insertedUser = await pool.query(insertUserQuery, insertUserValues);

    // Criar o objeto de resposta 
    const response = {
      id: insertedUser.rows[0].id,
      email: insertedUser.rows[0].email,
      message: 'Usuário criado com sucesso.',
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: `Erro ao cadastrar usuário: ${error}` });
  }
}

// Função de login de usuário
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    // Busca o usuário pelo email no banco de dados
    const getUserQuery = 'SELECT * FROM tb_users WHERE email = $1';
    const getUserValues = [email];
    const userResult = await pool.query(getUserQuery, getUserValues);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const user: User = userResult.rows[0];

    // Verifica se o usuário está ativo
    if (!user.is_active) {
      return res.status(401).json({ message: 'Usuário deletado ou inativo.' });
    }

    // Compara a senha digitada com a senha criptografada armazenada no banco de dados
    const isPasswordMatch = await comparePasswords(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Gerar o session Id
    let sessionId = ''
    while (true) {
      sessionId = generateSessionId();
      const checkSessionIdQuery = 'SELECT COUNT(*) FROM tb_access WHERE session_id = $1';
      const checkSessionIdValues = [sessionId];
      const { rows } = await pool.query(checkSessionIdQuery, checkSessionIdValues);
      const count = parseInt(rows[0].count, 10);

      if (count === 0) {
        // O session ID não existe na tabela, pode ser usado
        break;
      }
    }
    // Gerar o token JWT
    const tokenPayload = {
      id: user.id,
      email: user.email,
      sessionId: sessionId,
      username: user.username,
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
    res.status(200).json({ message: 'Autenticação bem-sucedida.', token});
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ message: `Erro ao autenticar usuário: ${error}` });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o sessionId do usuário autenticado
    const sessionId = decodedToken.sessionId;

    // Atualizar o campo 'revoked' do token para true
    const updateTokenQuery = 'UPDATE tb_access SET revoked = true WHERE session_id = $1';
    const updateTokenValues = [sessionId];
    await pool.query(updateTokenQuery, updateTokenValues);

    // Retornar uma mensagem de sucesso
    res.status(200).json({ message: 'Logout realizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao realizar logout:', error);
    res.status(500).json({ message: 'Erro ao realizar logout.' });
  }
}

// Rota para listar os usuários cadastrados
export async function listUsers(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Consultar todos os usuários no banco de dados
    const getUsersQuery = 'SELECT id, username, email, avatar_url, bio, created_at, updated_at, deleted_at, is_active FROM tb_users';
    const usersResult = await pool.query(getUsersQuery);

    // Mapear os resultados para a interface de resposta
    const response: User[] = usersResult.rows;

    // Retornar a lista de usuários na resposta
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários.' });
  }
}

// Rota para buscar um usuário por id
export async function getUserById(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken) {
      // Token inválido ou não fornecido
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o ID do usuário a ser buscado a partir dos parâmetros da URL
    const userId = parseInt(req.params.id, 10);

    // Consultar o usuário no banco de dados pelo ID
    const getUserQuery = 'SELECT id, username, email, avatar_url, bio, created_at, updated_at, deleted_at, is_active FROM tb_users WHERE id = $1';
    const getUserValues = [userId];
    const userResult = await pool.query(getUserQuery, getUserValues);

    if (userResult.rows.length === 0) {
      // Nenhum usuário encontrado com o ID fornecido
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Mapear o resultado para a interface de resposta
    const userResponse: User = userResult.rows[0];

    // Verificar se usuário está ativo
    if (!userResponse.is_active) {
      // O usuário não está ativo
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Retornar o usuário na resposta
    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: `Erro ao buscar usuário: ${error}` });
  }
}

// Deletar usuário por id
export async function deleteUserById(req: Request, res: Response) {
  try {
    // Acesso ao payload decodificado pelo token
    const decodedToken = req.decodedToken;

    if (!decodedToken || !decodedToken.id) {
      // Token inválido ou não contém o ID do usuário autenticado
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    // Obter o ID do usuário autenticado
    const authenticatedUserId = decodedToken.id;

    // Obter o ID do usuário a ser deletado a partir dos parâmetros da URL
    const userId = parseInt(req.params.id, 10);

    // Verificar se o usuário autenticado é o proprietário do ID que está sendo deletado
    if (userId !== authenticatedUserId) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para deletar este usuário.' });
    }

    // Deletar o usuário 
    const deleteUserQuery = 'UPDATE tb_users SET deleted_at = NOW(), is_active = false WHERE id = $1';
    const deleteUserValues = [userId];
    await pool.query(deleteUserQuery, deleteUserValues);

    // Retornar uma mensagem de sucesso
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: `Erro ao deletar usuário: ${error}` });
  }
}

// Atualizar usuário
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
    const { username, email, password, avatar_url, bio } = req.body;

    // Verifica se o email foi fornecido e se é válido
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
    }

    // Montar a query SQL de atualização dos dados do usuário
    const updateColumns: string[] = [];
    const updateValues: any[] = [];

    if (username !== undefined) {
      updateColumns.push('username');
      updateValues.push(username);
    }

    if (email !== undefined) {
      updateColumns.push('email');
      updateValues.push(email);
    }

    if (password !== undefined) {
      updateColumns.push('password');
      updateValues.push(password);
    }

    if (avatar_url !== undefined) {
      updateColumns.push('avatar_url');
      updateValues.push(avatar_url);
    }

    if (bio !== undefined) {
      updateColumns.push('bio');
      updateValues.push(bio);
    }

    // Incluir o campo 'updated_at' na query e adicionar a data atual como valor
    updateColumns.push('updated_at');
    updateValues.push(new Date());

    if (updateColumns.length === 0) {
      // Nenhum campo foi fornecido para atualização
      return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
    }

    const updateQuery = `UPDATE tb_users SET ${updateColumns.map((column, index) => `${column} = $${index + 1}`).join(', ')} WHERE id = $${updateColumns.length + 1}`;
    const updateValuesWithId = [...updateValues, userId];

    // Executar a query SQL para atualizar os dados do usuário no banco de dados
    await pool.query(updateQuery, updateValuesWithId);

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