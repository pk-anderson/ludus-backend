import { Pool } from 'pg';
import dotenv from 'dotenv';

export function connect() {
  dotenv.config(); // Carregar variáveis de ambiente do arquivo .env
  
  // Verificar se todas as variáveis de ambiente obrigatórias estão definidas
  const {
    DB_USER = '',
    DB_HOST = '',
    DB_DATABASE = '',
    DB_PASSWORD = '',
    DB_PORT = '5432',
  } = process.env;

  // Configuração da conexão com o banco de dados
  const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT, 10),
  });

  return pool;
}

