import { 
    unlockAchievement,
    userAchievementUnlocked
} from "../repositories/AchievementsRepository";

const FOLLOW_ACHIEVEMENT_ID = 3;
const FOLLOW_REQUIRED_FOR_ACHIEVEMENT = 5;

export async function checkFollowAchievement(userId: number, followers: number) {
    try {
        if (followers < FOLLOW_REQUIRED_FOR_ACHIEVEMENT) {
            return; 
        }
        const isUnlocked = await userAchievementUnlocked(userId, FOLLOW_ACHIEVEMENT_ID);
        if (!isUnlocked) {
            await unlockAchievement(userId, FOLLOW_ACHIEVEMENT_ID);
        }
    } catch (error) {
        console.error(`Erro ao verificar o achievement de followers: ${error}`);
    }
}