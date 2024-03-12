import { Pool } from 'pg';
import dotenv from 'dotenv';

export function connect() {
  dotenv.config(); 
  
  const {
    DB_USER = '',
    DB_HOST = '',
    DB_DATABASE = '',
    DB_PASSWORD = '',
    DB_PORT = '5432',
  } = process.env;

  const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT, 10),
  });

  return pool;
}

