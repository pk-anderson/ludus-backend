import express from 'express';
import { validateToken } from '../middlewares/AuthMiddleware'
import {
    signupHandler,
    listHandler,
    findHandler,
    deleteHandler,
    updateHandler,
    reactivateHandler,
    updatePasswordHandler,
    profilePicHandler
} from '../handlers/UserHandlers'
import multer from 'multer';

const storage = multer.memoryStorage(); // Armazena os dados do arquivo em memória
const upload = multer({ storage: storage });

const router = express.Router();

// Rota para cadastro de usuário
router.post('/signup', upload.single('file'), signupHandler);

// Rota para listagem de usuários
router.get('/all', validateToken, listHandler);

// Rota para buscar a imagem de perfil do usuário
router.get('/picture/:id', validateToken, profilePicHandler);

// Rota para buscar um usuário por id
router.get('/:id', validateToken, findHandler);

// Rota para atualizar um usuário por id
router.put('/update', validateToken, upload.single('file'), updateHandler);

// Rota para deletar um usuário por id
router.delete('/delete', validateToken, deleteHandler);

// Rota para reativar um usuário por id
router.post('/reactivate', reactivateHandler);

// Rota para atualizar a senha do usuário
router.put('/update-password', validateToken, updatePasswordHandler);

export default router;
