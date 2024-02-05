import { connect } from './config/conn';
import { init } from './config/init';
import cors from 'cors';

// Iniciar conexão
const pool = connect()
// Iniciar app express
const app = init()
const PORT = 3000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export { pool };
