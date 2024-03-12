import { 
    unlockAchievement,
    userAchievementUnlocked
} from "../repositories/AchievementsRepository";

const COMMENTS_ACHIEVEMENT_ID = 1;
const COMMENTS_REQUIRED_FOR_ACHIEVEMENT = 5;

export async function checkCommentsAchievement(userId: number, comments: number) {
    try {
        if (comments < COMMENTS_REQUIRED_FOR_ACHIEVEMENT) {
            return; 
        }

        const isUnlocked = await userAchievementUnlocked(userId, COMMENTS_ACHIEVEMENT_ID);
        if (!isUnlocked) {
            await unlockAchievement(userId, COMMENTS_ACHIEVEMENT_ID);
        }
    } catch (error) {
        console.error(`Erro ao verificar o achievement de comentários: ${error}`);
    }
}