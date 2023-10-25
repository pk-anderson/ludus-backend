import express from 'express';
import authRoutes from '../routes/AuthRoutes';
import usersRoutes from '../routes/UserRoutes';
import testRoutes from '../routes/TestRoutes';
import communityRoutes from '../routes/CommunityRoutes'
import memberRoutes from '../routes/MemberRoutes'
import followersRoutes from '../routes/FollowersRoutes'
import gameRoutes from '../routes/GameRoutes'

export function init() {
    const app = express();

    // Middleware para fazer o parse do corpo da requisição como JSON
    app.use(express.json());
    // Utilizar a rota de teste
    app.use('/', testRoutes);
    // Utilizar as rotas relacionadas a autenticação
    app.use('/auth', authRoutes);
    // Utilizar as rotas relacionadas aos usuários
    app.use('/users', usersRoutes);
    // Utilizar as rotas relacionadas às comunidades
    app.use('/community', communityRoutes);
    // Utilizar as rotas relacionadas a membros de comunidades
    app.use('/members', memberRoutes);
    // Utilizar as rotas relacionadas aos seguidores
    app.use('/followers', followersRoutes);
    // Utilizar as rotas relacionadas aos jogos
    app.use('/games', gameRoutes);

    //return
    return app
  }