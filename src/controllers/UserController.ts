import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from '../interfaces/User';
import { encryptPassword, comparePasswords } from '../utils/encryptor'; // Atualize o caminho correto para o arquivo encryptor.ts
import { isValidEmail } from '../utils/validations';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const prisma = new PrismaClient();

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar o usuário pelo email
    const user = await prisma.user_table.findUnique({ where: { email } });

    // Verificar se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Comparar as senhas
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar o token de acesso
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('Variável de ambiente não configurada.');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '24h' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;

    //verificar se email é válido
    const isValid = isValidEmail(user.email)
    if (!isValid) {
      return res.status(400).json({ message: 'O email fornecido não é válido' });
    }

    // Verifique se o usuário já existe
    const existingUser = await prisma.user_table.findUnique({ where: { email: user.email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Usuário com este email já existe' });
    }

    // Criptografar a senha antes de salvar no banco
    const hashedPassword = await encryptPassword(user.password);
    user.password = hashedPassword;

    // Crie o novo usuário
    const newUser = await prisma.user_table.create({
      data: user,
    });

  // Criar resposta
  const userResponse = { ...newUser, password: undefined };

    return res.status(201).json(userResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

export const listUsers = async (_req: Request, res: Response) => {
  try {
    // Consulta todos os usuários da tabela
    const users = await prisma.user_table.findMany();

    // Criar resposta, excluindo a senha de todos os usuários
    const usersResponse = users.map((user) => ({ ...user, password: undefined }));

    return res.status(200).json(usersResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID passado como parâmetro na URL

    // Buscar o usuário pelo ID
    const user = await prisma.user_table.findUnique({ where: { id: Number(id) } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Excluir a senha antes de enviar a resposta
    const userResponse = { ...user, password: undefined };

    return res.status(200).json(userResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};
