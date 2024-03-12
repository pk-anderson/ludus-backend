import { connect } from './config/conn';
import { init } from './config/init';

const pool = connect();
const app = init();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export { pool };
