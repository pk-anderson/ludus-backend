import { 
    unlockAchievement,
    userAchievementUnlocked
} from "../repositories/AchievementsRepository";

const FOLLOW_ACHIEVEMENT_ID = 3;
const FOLLOW_REQUIRED_FOR_ACHIEVEMENT = 5;

export async function checkFollowAchievement(userId: number, followers: number) {
    try {
        // Verifica se o usuário seguiu o número de users necessário para o achievement
        if (followers < FOLLOW_REQUIRED_FOR_ACHIEVEMENT) {
            return; 
        }

        // Verifica se o achievement já foi desbloqueado para o usuário
        const isUnlocked = await userAchievementUnlocked(userId, FOLLOW_ACHIEVEMENT_ID);

        // Se o achievement não estiver desbloqueado, desbloqueia
        if (!isUnlocked) {
            await unlockAchievement(userId, FOLLOW_ACHIEVEMENT_ID);
        }
    } catch (error) {
        console.error(`Erro ao verificar o achievement de followers: ${error}`);
    }
}