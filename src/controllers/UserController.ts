// controllers/UserController.ts
import { Request, Response } from 'express';
import { pool } from '../index';
import { encryptPassword, comparePasswords } from '../utils/encryptor';
import { isValidEmail } from '../utils/validations';
import { User } from '../interfaces/User';
import jwt from 'jsonwebtoken';
import { generateSessionId } from '../utils/uuid';
import dotenv from 'dotenv';
dotenv.config();

export async function signup(req: Request, res: Response) {
  try {
    const newUser: User = req.body;
    // Verifica se todos os campos obrigatórios foram enviados
    if (!newUser.username || !newUser.email || !newUser.password) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
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
      'INSERT INTO tb_users (username, email, password_hash, avatar_url, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const insertUserValues = [newUser.username, newUser.email, hashedPassword, newUser.avatar_url, newUser.bio];
    const insertedUser = await pool.query(insertUserQuery, insertUserValues);

    // Criar o objeto de resposta personalizada
    const response = {
      id: insertedUser.rows[0].id,
      email: insertedUser.rows[0].email,
      message: 'Usuário criado com sucesso.',
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
}

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

    // Gerar o token JWT
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
    res.status(200).json({ message: 'Autenticação bem-sucedida.', token});
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ message: 'Erro ao autenticar usuário.' });
  }
}
