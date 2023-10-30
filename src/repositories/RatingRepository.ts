import { pool } from '../index';
import { Rating } from '../interfaces/Rating';

// Função para salvar uma avaliação de um jogo
export async function saveRating(rating: Rating) {
    try {
        const insertRatingQuery =
            'INSERT INTO tb_ratings (user_id, game_id, rating, review, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *';
        const insertRatingValues = [rating.user_id, rating.game_id, rating.rating, rating.review];
        const result = await pool.query(insertRatingQuery, insertRatingValues);

        // Retorna a avaliação inserida
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Função para atualizar uma avaliação
export async function updateRating(id: number, rating: Rating) {
    try {
        const updateRatingQuery =
            'UPDATE tb_ratings SET rating = $1, review = $2, updated_at = CURRENT_TIMESTAMP, deleted_at = $3 WHERE id = $4 RETURNING *';
        const updateRatingValues = [rating.rating, rating.review, rating.deleted_at, id];
        const result = await pool.query(updateRatingQuery, updateRatingValues);

        // Retorna a avaliação atualizada
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Função para buscar uma avaliação por id
export async function getRatingById(ratingId: number) {
    try {
        const getRatingQuery = 'SELECT * FROM tb_ratings WHERE id = $1';
        const result = await pool.query(getRatingQuery, [ratingId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Função para listar todas as avaliações de um usuário específico
export async function getRatingsByUser(userId: number) {
    try {
        const getRatingsQuery = 'SELECT * FROM tb_ratings WHERE user_id = $1 and deleted_at is NULL';
        const result = await pool.query(getRatingsQuery, [userId]);

        // Retorna as ratings encontradas
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Função para buscar todas as ratings de um mesmo jogo pelo ID do jogo 
export async function getRatingsByGame(gameId: number) {
    try {
        const getRatingsQuery = 'SELECT * FROM tb_ratings WHERE game_id = $1 and deleted_at is NULL';
        const result = await pool.query(getRatingsQuery, [gameId]);

        // Retorna as ratings encontradas para o jogo específico
        return result.rows;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Função para buscar uma avaliação específica de um usuário para um jogo pelo ID do usuário e ID do jogo
export async function getRatingByUserAndGame(userId: number, gameId: number) {
    try {
        const getRatingQuery = 'SELECT * FROM tb_ratings WHERE user_id = $1 AND game_id = $2';
        const result = await pool.query(getRatingQuery, [userId, gameId]);

        // Retorna a avaliação encontrada
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

// Função para "deletar" uma avaliação
export async function deleteRating(ratingId: number) {
    try {
        const deleteRatingQuery = 'UPDATE tb_ratings SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
        const result = await pool.query(deleteRatingQuery, [ratingId]);

        // Retorna a avaliação marcada como deletada
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}