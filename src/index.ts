// index.ts

import express from 'express';
import routes from './routes';
import * as dotenv from 'dotenv';


const app = express();
dotenv.config();


// Middleware para lidar com requisições JSON
app.use(express.json());

// Rotas
app.use(routes);

// Inicie o servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});