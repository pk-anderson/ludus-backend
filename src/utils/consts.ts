// SUCCESS

// auth
export const AUTHENTICATION_SUCCESSFUL = 'Autenticação bem-sucedida.';
export const LOGOUT_SUCCESSFUL = 'Logout realizado com sucesso.';

// user
export const CREATE_USER_SUCCESS = 'Usuário criado com sucesso.'
export const DELETE_USER_SUCCESS = 'Usuário deletado com sucesso.'
export const UPDATE_USER_SUCCESS = 'Usuário atualizado com sucesso.'

// followers
export const FOLLOW_SUCCESS = 'Você agora segue este usuário.'
export const UNFOLLOW_SUCCESS = 'Você agora deixou de seguir este usuário.'

// community
export const UPDATE_COMMUNITY_SUCCESS = 'Comunidade atualizada com sucesso.'
export const DELETE_COMMUNITY_SUCCESS = 'Comunidade desativada com sucesso.'
export const REACTIVATE_COMMUNITY_SUCCESS = 'Comunidade reativada com sucesso.'

// member
export const FOLLOWING_COMMUNITY = 'Agora você está seguindo esta comunidade.'
export const UNFOLLOWING_COMMUNITY = 'Agora você não é mais seguidor desta comunidade.'

// rating
export const DELETE_RATING_SUCCESS = 'Avaliação removida com sucesso.'

// comment
export const NO_CONTENT_ERROR = 'O comentário está vazio.'
export const DELETE_COMMENT_SUCCESS = 'Comentário removido com sucesso.'
export const LIKE_SUCCESS = 'Like atribuído com sucesso.'
export const REMOVELIKE_SUCCESS = 'Like removido com sucesso.'
export const DISLIKE_SUCCESS = 'Dislike atribuído com sucesso.'
export const REMOVEDISLIKE_SUCCESS = 'Dislike removido com sucesso.'
export const INVALID_ENTITY = 'Tipo de entidade enviado é inválido.'

// post
export const NOT_MEMBER_ERROR = 'Usuário deve ser membro da comunidade para fazer um post.'
export const DELETE_POST_SUCCESS = 'Postagem removida com sucesso.'

// ERROR 

// member
export const FOLLOW_OWN_COMMUNITY_ERROR = 'Você não pode seguir sua própria comunidade.'
export const FOLLOWING_COMMUNITY_ERROR = 'Você já está seguindo esta comunidade.'
export const NOT_FOLLOWING_COMMUNITY_ERROR = 'Você não é seguidor desta comunidade.'

// Internal
export const INTERNAL_SERVER_ERROR = 'Erro interno do servidor.'
export const ENV_VARIABLE_NOT_CONFIGURED = 'Variável de ambiente não configurada.';

// Auth
export const UNAUTHORIZED_ACCESS = 'Acesso não autorizado.';
export const AUTHENTICATION_ERROR = 'Erro ao autenticar usuário.'
export const CREDENTIALS_INVALID = 'Credenciais inválidas.';
export const LOGOUT_ERROR = 'Erro ao realizar logout.';
export const REVOKE_ERROR = 'Erro ao revogar token';

// Followers
export const ALREADY_FOLLOWING = 'Você já é seguidor deste usuário.';
export const NOT_FOLLOWING = 'Você não é seguidor deste usuário.';
export const FOLLOWING_ERROR = 'Erro ao seguir usuário.'
export const UNFOLLOWING_ERROR = 'Erro ao deixar de seguir usuário.'
export const OWN_USER_FOLLOW = 'O usuário não pode seguir a si mesmo.'

// Validations
export const EMAIL_ALREADY_IN_USE = 'Este email já está sendo utilizado.';
export const MISSING_REQUIRED_FIELDS = 'Todos os campos obrigatórios devem ser preenchidos.';
export const INVALID_PASSWORD = 'A senha utilizada deve ter pelo menos 8 caracteres.';
export const INVALID_EMAIL = 'O email enviado não é válido.';

// Generic
export const CREATE_ENTITY_ERROR = 'Erro ao cadastrar entidade'
export const FIND_ENTITY_ERROR = 'Entidade não encontrada'
export const LIST_ENTITY_ERROR = 'Erro ao listar todas as entidades'
export const DELETE_ENTITY_ERROR = 'Erro ao deletar a entidade'
export const UPDATE_ENTITY_ERROR = 'Erro ao atualizar a entidade'
export const REACTIVATE_ERROR = 'Erro ao reativar entidade.'