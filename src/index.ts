// index.ts
import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import usersRoutes from './routes/UserRoutes';
import testRoutes from './routes/TestRoutes';

dotenv.config(); // Carregar variáveis de ambiente do arquivo .env

const app = express();
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

// Middleware para fazer o parse do corpo da requisição como JSON
app.use(express.json());

// Utilizar a rota de teste
app.use('/', testRoutes);

// Utilizar as rotas relacionadas aos usuários
app.use('/users', usersRoutes);


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor Express em execução na porta ${PORT}`);
});

export { pool };
