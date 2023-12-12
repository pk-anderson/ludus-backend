import { pool } from '../index'; 

export async function unlockAchievement(userId: number, achievementId: number) {
    try {
        const insertAchievementQuery =
            'INSERT INTO tb_user_achievements (user_id, achievement_id, achieved_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *';
        const insertAchievementValues = [userId, achievementId];
        const result = await pool.query(insertAchievementQuery, insertAchievementValues);

        // Retorna o registro de conquista desbloqueada
        return result.rows[0];
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function userAchievementUnlocked(userId: number, achievementId: number) {
    try {
        const checkAchievementQuery =
            'SELECT * FROM tb_user_achievements WHERE user_id = $1 AND achievement_id = $2';
        const checkAchievementValues = [userId, achievementId];
        const result = await pool.query(checkAchievementQuery, checkAchievementValues);

        // Retorna verdadeiro se o achievement estiver desbloqueado para o usuário, falso caso contrário
        return result.rows.length > 0;
    } catch (error) {
        throw new Error(`${error}`);
    }
}

export async function listUserAchievements(userId: number) {
    try {
        const userAchievementsQuery =
            'SELECT a.*, ua.achieved_at FROM tb_achievements a ' +
            'INNER JOIN tb_user_achievements ua ON a.id = ua.achievement_id ' +
            'WHERE ua.user_id = $1';
        const userAchievementsValues = [userId];
        const result = await pool.query(userAchievementsQuery, userAchievementsValues);

        // Calcula a soma total de points_rewarded dos achievements desbloqueados
        const totalPoints = result.rows.reduce((acc, row) => acc + row.points_rewarded, 0);

        // Retorna os achievements desbloqueados e a soma total de pontos
        return { achievements: result.rows, totalPoints };
    } catch (error) {
        throw new Error(`${error}`);
    }
}
