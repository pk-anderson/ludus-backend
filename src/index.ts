import { connect } from './config/conn';
import { init } from './config/init';

// Iniciar conexão
const pool = connect()
// Iniciar app express
const app = init()
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export { pool };
