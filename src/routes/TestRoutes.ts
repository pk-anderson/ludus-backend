import express from 'express';
import { pool } from '../index';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() as current_time');
    const currentTime = rows[0].current_time;

    res.send(`Conexão com o banco de dados PostgreSQL bem-sucedida. Hora atual do banco de dados: ${currentTime}`);
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    res.status(500).send(`Erro ao conectar ao banco de dados: ${error}`);
  }
});

export default router;
