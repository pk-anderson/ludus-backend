import { 
    unlockAchievement,
    userAchievementUnlocked
} from "../repositories/AchievementsRepository";

const COMMENTS_ACHIEVEMENT_ID = 1;
const COMMENTS_REQUIRED_FOR_ACHIEVEMENT = 5;

export async function checkCommentsAchievement(userId: number, comments: number) {
    try {
        // Verifica se o usuário atingiu o número de comentários necessário para o achievement
        if (comments < COMMENTS_REQUIRED_FOR_ACHIEVEMENT) {
            return; 
        }

        // Verifica se o achievement já foi desbloqueado para o usuário
        const isUnlocked = await userAchievementUnlocked(userId, COMMENTS_ACHIEVEMENT_ID);

        // Se o achievement não estiver desbloqueado, desbloqueia
        if (!isUnlocked) {
            await unlockAchievement(userId, COMMENTS_ACHIEVEMENT_ID);
        }
    } catch (error) {
        console.error(`Erro ao verificar o achievement de comentários: ${error}`);
    }
}