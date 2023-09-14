import { User } from './../interfaces/User';
import { pool } from '../index';
import dotenv from 'dotenv';
dotenv.config();

// Função para verificar se o email já está sendo utilizado
export async function checkIfEmailExists(email: string): Promise<boolean> {
  try {
  const existingUserQuery = 'SELECT * FROM tb_users WHERE email = $1';
  const existingUserValues = [email];
  const existingUserResult = await pool.query(existingUserQuery, existingUserValues);

  return existingUserResult.rows.length > 0;
  } catch (error) {
    throw new Error(`${error}`);
  }
}


export async function signup(user: User) {
  try {
    // Insere o novo usuário no banco de dados
    const insertUserQuery =
      'INSERT INTO tb_users (username, email, password, profile_pic, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const insertUserValues = [user.username, user.email, user.password, user.profile_pic, user.bio];
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

// Rota para listar os usuários cadastrados
export async function listUsers() {
  try {
    // Consultar todos os usuários no banco de dados
    const getUsersQuery = 'SELECT id, username, email, bio, created_at, updated_at, deleted_at, is_active, profile_pic FROM tb_users';
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
    const getUserQuery = 'SELECT id, username, email, bio, created_at, updated_at, deleted_at, is_active, profile_pic FROM tb_users WHERE id = $1';
    const getUserValues = [userId];
    const userResult = await pool.query(getUserQuery, getUserValues);

    return userResult.rows.length === 0 ? null : userResult.rows[0];
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
export async function updateUserById(user: User) {
  try {
    // Montar a query SQL de atualização dos dados do usuário
    const updateQuery = `
      UPDATE tb_users 
      SET username = $1, email = $2, profile_pic = $3, bio = $4, updated_at = $5
      WHERE id = $6`;

    const updateValues = [
      user.username,
      user.email,
      user.profile_pic,
      user.bio,
      user.updated_at,
      user.id,
    ];

    // Executar a query SQL para atualizar os dados do usuário no banco de dados
    await pool.query(updateQuery, updateValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}

// Reativar usuário
export async function reactivateUser(userId: number) {
  try {
    // Reativa a conta (atualiza os campos is_active, deleted_at e updated_at)
    const reactivateUserQuery =
      'UPDATE tb_users SET is_active = true, deleted_at = NULL, updated_at = NOW() WHERE id = $1';
    const reactivateUserValues = [userId];

    await pool.query(reactivateUserQuery, reactivateUserValues);
  } catch (error) {
    throw new Error(`${error}`);
  }
}

// Função para atualizar a senha do usuário
export async function updatePassword(userId: number, password: string) {
  try {
    // Atualizar a senha no banco de dados
    const updatePasswordQuery = 'UPDATE tb_users SET password = $1 WHERE id = $2';
    const updatePasswordValues = [password, userId];

    await pool.query(updatePasswordQuery, updatePasswordValues);

  } catch (error) {
    throw new Error(`${error}`);
  }
}
